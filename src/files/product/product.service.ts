import mongoose from "mongoose"
import { IResponse } from "../../constants"
import { queryConstructor } from "../../utils"
import { IProduct } from "./product.interface"
import { productMessages } from "./product.messages"
import ProductRepository from "./product.repository"
import { userMessages } from "../user/user.messages"
import { IJwt } from "../user/user.interface"

export default class ProductService {
  //create product
  static async create(
    payload: IProduct,
    locals: Partial<IJwt>,
  ): Promise<IResponse> {
    if (locals.role !== "seller")
      return {
        success: false,
        msg: userMessages.UNAUTHORIZED,
      }
    const { name, image } = payload
    if (!image) return { success: false, msg: productMessages.IMAGE_ERROR }

    const validate = await ProductRepository.validate({
      name,
      seller: new mongoose.Types.ObjectId(locals._id),
    })
    if (validate) return { success: false, msg: productMessages.EXIST }

    const product = await ProductRepository.create({
      seller: new mongoose.Types.ObjectId(locals._id),
      ...payload,
    })
    if (!product) return { success: false, msg: productMessages.PRODUCT_ERROR }
    return {
      success: true,
      msg: productMessages.CREATE,
      data: product,
    }
  }

  //fetch one
  static async fetchOne(payload: string): Promise<IResponse> {
    const product = await ProductRepository.fetch(
      { _id: new mongoose.Types.ObjectId(payload) },
      {},
    )

    if (!product) return { success: false, msg: productMessages.NOT_FOUND }

    return { success: true, msg: productMessages.FETCH, data: product }
  }

  //fetch all product with dynamic filters
  static async fetch(payload: Partial<IProduct>): Promise<IResponse> {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Product",
    )

    if (error) return { success: false, msg: error }

    const product = await ProductRepository.fetchByParams(
      {
        ...params,
        limit,
        skip,
        sort,
      },
      {},
    )

    if (product.length < 1)
      return { success: true, msg: productMessages.NOT_FOUND, data: [] }

    return {
      success: true,
      msg: productMessages.FETCH,
      data: product,
    }
  }

  //reset product sales time and date
  static async resetProduct(
    payload: Pick<IProduct, "salesStartTime" | "salesEndTime">,
    productId: string,
  ): Promise<IResponse> {
    const product = await ProductRepository.update(
      {
        _id: new mongoose.Types.ObjectId(productId),
      },
      { availableUnits: 200, ...payload },
    )

    if (!product) return { success: false, msg: productMessages.ERROR_UPDATE }

    return { success: true, msg: productMessages.RESET, data: product }
  }

  //update product
  static async update(
    payload: Partial<IProduct>,
    productId: string,
  ): Promise<IResponse> {
    const product = await ProductRepository.update(
      {
        _id: new mongoose.Types.ObjectId(productId),
      },
      { ...payload },
    )

    if (!product) return { success: false, msg: productMessages.ERROR_UPDATE }

    return { success: true, msg: productMessages.UPDATE, data: product }
  }
}
