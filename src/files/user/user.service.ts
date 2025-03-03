import { IPagination, IResponse } from "../../constants"
import {
  AlphaNumeric,
  hashPassword,
  tokenHandler,
  verifyPassword,
} from "../../utils"
import { IUser } from "./user.interface"
import { userMessages } from "./user.messages"
import UserRepository from "./user.repository"
import { sendMailNotification } from "../../utils/email"
import { generalMessages } from "../../core/messages"
import mongoose from "mongoose"
import user from "./user.model"

export default class UserService {
  //sign-up or create user
  static async signup(userPayload: IUser): Promise<IResponse> {
    userPayload.email = userPayload.email.toLowerCase()
    const { email, phoneNumber, role } = userPayload

    const validateUser = await UserRepository.validateUser({
      $or: [{ email }, { phoneNumber }],
    })

    if (validateUser) return { success: false, msg: userMessages.USER_EXISTS }
    if (!role) return { success: false, msg: userMessages.ROLE_CHECK }

    const user = await UserRepository.createUser({
      ...userPayload,
      password: await hashPassword(userPayload.password),
    })

    if (!user) return { success: false, msg: userMessages.ERROR_SIGNUP }

    try {
      const substitutional_parameters = {
        name: userPayload.fullName,
      }
      await sendMailNotification(
        email,
        "Flash Sale - Welcome",
        substitutional_parameters,
        "WELCOME",
      )
    } catch (error) {
      console.log("email notification error:", error)
    }

    return {
      success: true,
      msg: userMessages.SIGN_UP_SUCCESS,
    }
  }

  //login service
  static async login(
    data: Pick<IUser, "email" | "password">,
  ): Promise<IResponse> {
    const { email, password } = data
    const validateUser = await UserRepository.fetchUser({ email }, {})
    if (!validateUser)
      return { success: false, msg: generalMessages.INCORRECT_DETAILS }

    const validatePassword = await verifyPassword(
      password,
      validateUser.password!,
    )
    if (!validatePassword)
      return { success: false, msg: generalMessages.INCORRECT_DETAILS }

    const token = tokenHandler({
      _id: validateUser._id,
      role: validateUser.role,
    })

    delete validateUser.password
    return {
      success: true,
      msg: generalMessages.SUCCESSFUL_LOGIN,
      data: { ...validateUser, token },
    }
  }

  //forgot password
  static async forgotPassword(data: Pick<IUser, "email">): Promise<IResponse> {
    const { email } = data

    const confirmEmail = await UserRepository.fetchUser({ email }, {})
    if (!confirmEmail)
      return { success: false, msg: userMessages.USER_NOT_FOUND }

    const generateOtp = AlphaNumeric(4, "number")

    await UserRepository.updateUsersProfile(
      { email },
      { verificationOtp: generateOtp },
    )

    try {
      const substitutional_parameters = {
        otp: generateOtp,
      }

      await sendMailNotification(
        email,
        "Reset Password",
        substitutional_parameters,
        "RESET_OTP",
      )
    } catch (error) {
      console.log("forgot password notification error", error)
    }

    return { success: true, msg: generalMessages.OTP }
  }

  //reest password
  static async resetPassword(partnerPayload: {
    otp: string
    newPassword: string
    email: string
  }): Promise<IResponse> {
    const { newPassword, email, otp } = partnerPayload
    const user = await UserRepository.fetchUser(
      {
        email,
        verificationOtp: otp,
      },
      {},
    )
    if (!user) return { success: false, msg: generalMessages.INCORRECT_OTP }

    const updateUser = await UserRepository.updateUsersProfile(
      { email },
      { password: await hashPassword(newPassword), verificationOtp: "" },
    )
    if (!updateUser) return { success: false, msg: generalMessages.OTP_ERROR }

    return { success: true, msg: userMessages.RESET_PASSWORD }
  }

  static async profileImage(
    payload: Pick<IUser, "image" | "_id">,
  ): Promise<IResponse> {
    const { _id, image } = payload
    const imageUpload = await UserRepository.updateUsersProfile(
      { _id: new mongoose.Types.ObjectId(_id) },
      { image },
    )
    if (!imageUpload)
      return { success: false, msg: userMessages.UPDATE_IMAGE_FAILURE }

    return { success: true, msg: userMessages.UPDATE_IMAGE_SUCCESS }
  }
}
