import mongoose, { Schema, model } from "mongoose"
import { IPayment } from "./payment.interface"

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    productId: { type: mongoose.Types.ObjectId, ref: "Product" },
    amount: { type: Number },
    reference: { type: String },
    channel: { type: String, default: "paystack" },
    status: { type: String, default: "pending" },
    purchaseTime: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

const payment = model<IPayment>("Payment", PaymentSchema, "payment")

export default payment
