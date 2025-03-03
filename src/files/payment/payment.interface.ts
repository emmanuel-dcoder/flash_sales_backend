import mongoose, { Types } from "mongoose"
import { IResponse } from "../../constants"

export interface IPayment {
  _id?: mongoose.Types.ObjectId
  userId?: mongoose.Types.ObjectId
  productId?: mongoose.Types.ObjectId
  amount: number
  reference: string
  channel: "paystack"
  status: "paid" | "failed" | "pending"
  purchaseTime: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface IPaymentCode {
  authorizationUrl: string
  accessCode: string
  reference: string
}

export type paymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | { $in: Record<string, any> }

export interface IPaymentProvider {
  initiatePayment: (payload: {
    amount: number
    email: string
  }) => Promise<IResponse>

  verifyCardPayment: (payload: Record<any, any>) => Promise<IResponse>

  verifyProviderPayment: (reference: string) => Promise<IResponse>
}
