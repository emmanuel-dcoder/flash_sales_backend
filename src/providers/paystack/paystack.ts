import { IResponse } from "../../constants"
import { RequestHandler } from "../../utils/axios.provision"
import { providerMessages } from "../providers.messages"
import { paymentMessages } from "../../files/payment/payment.messages"
import { IPaymentProvider } from "./transaction.providers"
import config from "../../core/config"
import { paymentStatus } from "../../files/payment/payment.interface"
import PaymentRepository from "../../files/payment/payment.repository"
import ProductRepository from "../../files/product/product.repository"
import mongoose from "mongoose"

export default class PaystackPaymentService implements IPaymentProvider {
  private paymentRequestHandler = RequestHandler.setup({
    baseURL: config.PAYSTACK_URL,
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${config.PAYSTACK_KEY}`,
      "Accept-Encoding": "gzip,deflate,compress",
    },
  })

  private checkSuccessStatus(
    status: string,
    gatewayResponse: string,
  ): {
    success: boolean
    msg: string
  } {
    if (status === "success") return { success: true, msg: gatewayResponse }

    return { success: false, msg: gatewayResponse }
  }

  private async verifySuccessOfPayment(payload: Record<any, any>) {
    const statusVerification = this.checkSuccessStatus(
      payload.status,
      payload.gateway_response,
    )

    let responseStatus = "pending" as paymentStatus
    if (statusVerification.success) {
      responseStatus = "paid"
    } else {
      responseStatus = "failed"
    }

    const updatePayment = PaymentRepository.update(
      { reference: payload.reference },
      { status: responseStatus, metaData: JSON.stringify(payload) },
    )

    if (!updatePayment)
      return { success: false, msg: paymentMessages.NOT_VERIFIED }

    return { success: statusVerification.success, msg: statusVerification.msg }
  }

  async initiatePayment(paymentPayload: {
    amount: number
    email: string
  }): Promise<IResponse> {
    const { email } = paymentPayload

    const initialAmount = paymentPayload.amount * 100

    const paystackResponse = await this.paymentRequestHandler({
      method: "POST",
      url: "/transaction/initialize",
      data: {
        amount: initialAmount,
        email,
      },
    })

    if (!paystackResponse.status)
      return { success: false, msg: providerMessages.INITIATE_PAYMENT_FAILURE }

    const paystackData = paystackResponse.data.data

    const response = {
      authorizationUrl: paystackData.authorization_url,
      accessCode: paystackData.access_code,
      reference: paystackData.reference,
    }

    return {
      success: true,
      msg: providerMessages.INITIATE_PAYMENT_SUCCESS,
      data: response,
    }
  }

  async verifyCardPayment(payload: Record<any, any>): Promise<IResponse> {
    //check success of transaction
    const { data } = payload
    const payment = await PaymentRepository.fetch(
      {
        reference: data.reference,
      },
      {},
    )

    if (!payment?._id) return { success: false, msg: paymentMessages.NOT_FOUND }

    //check for duplicate
    if (payment?.status === "paid")
      return { success: false, msg: paymentMessages.DUPLICATE_TRANSACTION }

    const verifyAndUpdateTransactionRecord =
      await this.verifySuccessOfPayment(data)

    if (!verifyAndUpdateTransactionRecord.success) {
      return { success: false, msg: verifyAndUpdateTransactionRecord.msg }
    }

    //update product and payment with webhook
    await Promise.all([
      ProductRepository.update(
        { _id: new mongoose.Types.ObjectId(payment.productId) },
        { $inc: { availableUnits: -1 } },
      ),
      PaymentRepository.update(
        { _id: new mongoose.Types.ObjectId(payment._id) },
        { status: "paid" },
      ),
    ])

    return { success: true, msg: paymentMessages.VERIFIED }
  }

  async verifyProviderPayment(reference: string): Promise<IResponse> {
    const { data: response } = (await this.paymentRequestHandler({
      method: "GET",
      url: `/transaction/verify/${reference}`,
    })) as any

    if (response.status && response.message == "Verification successful") {
      return this.verifyCardPayment(response)
    }

    return { success: false, msg: response.message }
  }
}
