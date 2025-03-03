import mongoose, { mongo } from "mongoose"
import { IResponse } from "../../constants"
import { IPayment, IPaymentProvider } from "./payment.interface"
import { paymentMessages } from "./payment.messages"
import PaymentRepository from "./payment.repository"
import PaystackPaymentService from "../../providers/paystack/paystack"
import ProductRepository from "../product/product.repository"
import UserRepository from "../user/user.repository"
import { queryConstructor } from "../../utils"

export default class PaymentService {
  private static paymentProvider: IPaymentProvider
  static async getConfig() {
    this.paymentProvider = new PaystackPaymentService()
  }

  //create payment
  static async create(payload: Partial<IPayment>): Promise<IResponse> {
    await this.getConfig()
    const { productId, userId } = payload

    //valid product and user
    const [validateUser, validateProduct] = await Promise.all([
      UserRepository.fetchUser(
        {
          _id: new mongoose.Types.ObjectId(userId),
        },
        {},
      ),
      ProductRepository.fetch(
        {
          _id: new mongoose.Types.ObjectId(productId),
        },
        {},
      ),
    ])

    if (!validateProduct || !validateUser)
      return { success: false, msg: paymentMessages.INVALID }

    // Extract sale times
    const {
      salesStartTime,
      salesEndTime,
      availableUnits,
      amount,
      purchaseLimit,
    } = validateProduct
    const currentTime = new Date()

    // Check if the sale is active
    if (
      currentTime < new Date(salesStartTime!) ||
      currentTime > new Date(salesEndTime!)
    ) {
      return { success: false, msg: paymentMessages.SALE_ERROR }
    }

    // Check if user has exceeded the purchase limit
    const userPurchaseCount = await PaymentRepository.count({
      userId,
      productId,
    })

    if (userPurchaseCount >= purchaseLimit!) {
      return { success: false, msg: paymentMessages.PURCHASE_LIMIT }
    }

    //prevent under-purchasing
    if (availableUnits! < 0)
      return { success: false, msg: paymentMessages.STOCK_ERROR }

    const initiatePayment = await this.paymentProvider.initiatePayment({
      amount: amount!,
      email: validateUser.email!,
    })

    const paymentReference = initiatePayment.data?.reference

    const product = await PaymentRepository.create({
      reference: paymentReference,
      productId,
      userId,
      amount: validateProduct.amount,
    })
    if (!product) return { success: false, msg: paymentMessages.PRODUCT_ERROR }
    return {
      success: true,
      msg: paymentMessages.CREATE,
      data: { product, paymentUrlDetails: initiatePayment.data },
    }
  }

  //fetch all product with dynamic filters
  static async fetch(payload: Partial<IPayment>): Promise<IResponse> {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Payment",
    )

    if (error) return { success: false, msg: error }

    const payment = await PaymentRepository.fetchByParams(
      {
        ...params,
        limit,
        skip,
        sort,
      },
      {},
    )

    if (payment.length < 1)
      return { success: true, msg: paymentMessages.NOT_FOUND, data: [] }

    return {
      success: true,
      msg: paymentMessages.FETCH,
      data: payment,
    }
  }

  //webhook verification service
  static async verifyCardPayment(payload: any) {
    await this.getConfig()
    return await this.paymentProvider.verifyCardPayment(payload)
  }
}
