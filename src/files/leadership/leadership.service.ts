import { IResponse } from "../../constants"
import { IProduct } from "../product/product.interface"
import { userMessages } from "../user/user.messages"
import PaymentRepository from "../payment/payment.repository"

export default class LeadershipService {
  static async fetchUserPaidProducts(
    payload: Partial<IProduct>,
  ): Promise<IResponse> {
    const user = await PaymentRepository.fetchUsersWithSuccessfulPayments()

    if (user.length < 1)
      return { success: true, msg: userMessages.NOT_FOUND, data: [] }

    return {
      success: true,
      msg: userMessages.FETCH_USERS,
      data: user,
    }
  }
}
