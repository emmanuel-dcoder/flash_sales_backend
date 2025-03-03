import { IProduct } from "./product.interface"
import Product from "./product.model"
import pagination, { IPagination } from "../../constants"
import { UpdateQuery } from "mongoose"

const { LIMIT, SKIP, SORT } = pagination

export default class ProductRepository {
  static async create(productPayload: Partial<IProduct>): Promise<IProduct> {
    return await Product.create(productPayload)
  }

  static async fetch(
    productPayload: Partial<IProduct>,
    select: Partial<Record<keyof IProduct, number | boolean | object>> = {
      _id: 1,
    },
  ): Promise<Partial<IProduct> | null> {
    const product: Awaited<IProduct | null> = await Product.findOne(
      {
        ...productPayload,
      },
      select,
    ).lean()
    return product
  }

  static async validate(
    query: Partial<IProduct> | { $or: Partial<IProduct>[] },
  ) {
    return Product.exists(query)
  }

  static async update(
    payload: Partial<IProduct>,
    update: UpdateQuery<Partial<IProduct>>,
  ) {
    const product = await Product.findOneAndUpdate(
      {
        ...payload,
      },
      { ...update },
      { new: true, runValidators: true },
    )

    return product
  }

  static async fetchByParams(
    payload: Partial<IProduct & IPagination>,
    select: Partial<Record<keyof IProduct, number | boolean | object>> = {
      _id: 1,
    },
  ) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = payload
    const product: Awaited<IProduct[] | null> = await Product.find({
      ...restOfPayload,
    })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select)
      .populate({
        path: "seller",
        select: "fullName email image",
      })

    return product
  }
}
