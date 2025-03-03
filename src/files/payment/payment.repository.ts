import { IPayment } from "./payment.interface"
import Payment from "./payment.model"
import pagination, { IPagination } from "../../constants"
import { UpdateQuery } from "mongoose"

const { LIMIT, SKIP, SORT } = pagination

export default class PaymentRepository {
  static async create(paymentPayment: Partial<IPayment>): Promise<IPayment> {
    return await Payment.create(paymentPayment)
  }

  static async fetch(
    paymentPayment: Partial<IPayment>,
    select: Partial<Record<keyof IPayment, number | boolean | object>> = {
      _id: 1,
    },
  ): Promise<Partial<IPayment> | null> {
    const payment: Awaited<IPayment | null> = await Payment.findOne(
      {
        ...paymentPayment,
      },
      select,
    ).lean()
    return payment
  }

  static async validate(
    query: Partial<IPayment> | { $or: Partial<IPayment>[] },
  ) {
    return Payment.exists(query)
  }

  static async update(
    payload: Partial<IPayment>,
    update: UpdateQuery<Partial<IPayment>>,
  ) {
    const payment = await Payment.findOneAndUpdate(
      {
        ...payload,
      },
      { ...update },
      { new: true, runValidators: true },
    )

    return payment
  }

  static async fetchByParams(
    payload: Partial<IPayment & IPagination>,
    select: Partial<Record<keyof IPayment, number | boolean | object>> = {
      _id: 1,
    },
  ) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = payload
    const payment: Awaited<IPayment[] | null> = await Payment.find({
      ...restOfPayload,
    })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select)
      .populate({
        path: "userId",
        select: "fullName email image",
      })
      .populate({
        path: "productId",
      })
    return payment
  }

  static async count(payload: Partial<IPayment>) {
    return await Payment.countDocuments({
      ...payload,
    })
  }
}
