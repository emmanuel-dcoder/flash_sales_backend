import { IResponse } from "../../constants"
import { queryConstructor } from "../../utils"
import { IProduct } from "../product/product.interface"
import UserRepository from "../user/user.repository"
import { userMessages } from "../user/user.messages"
import payment from "../payment/payment.model"

export default class LeadershipService {
  static async fetchUserPaidProducts(
    payload: Partial<IProduct>,
  ): Promise<IResponse> {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "User",
    )

    if (error) return { success: false, msg: error }

    const user = await UserRepository.fetchUsersByParams(
      {
        ...params,
        _id: {
          $in: await payment.distinct("userId", { status: "paid" }),
        },
        limit,
        skip,
        sort,
      },
      { _id: 1, email: 1, phoneNumber: 1, role: 1 },
    )

    if (user.length < 1)
      return { success: true, msg: userMessages.NOT_FOUND, data: [] }

    return {
      success: true,
      msg: userMessages.FETCH_USERS,
      data: user,
    }
  }
}
