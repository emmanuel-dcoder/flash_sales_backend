import { NextFunction, Response, Request } from "express"
import { responseHandler } from "../../core/response"
import { fileModifier, manageAsyncOps } from "../../utils"
import { CustomError } from "../../utils/error"
import ProductService from "./product.service"
import { statusCode } from "../../constants/statusCode"

class ProductController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { image, body } = fileModifier(req)
    const [error, data] = await manageAsyncOps(
      ProductService.create({ image, ...body }, res.locals.jwt),
    )
    if (error) return next(error)
    if (!data?.success)
      return next(new CustomError(data!.msg, statusCode.BAD_REQUEST, data!))
    return responseHandler(res, statusCode.CREATED, data!)
  }

  async fetchOne(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      ProductService.fetchOne(req.params.id),
    )
    if (error) return next(error)
    if (!data?.success)
      return next(new CustomError(data!.msg, statusCode.BAD_REQUEST, data!))
    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  async fetch(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(ProductService.fetch(req.query))
    if (error) return next(error)
    if (!data?.success)
      return next(new CustomError(data!.msg, statusCode.BAD_REQUEST, data!))
    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  async reset(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      ProductService.resetProduct(req.body, req.params.id),
    )
    if (error) return next(error)
    if (!data?.success)
      return next(new CustomError(data!.msg, statusCode.BAD_REQUEST, data!))
    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      ProductService.update(req.body, req.params.id),
    )
    if (error) return next(error)
    if (!data?.success)
      return next(new CustomError(data!.msg, statusCode.BAD_REQUEST, data!))
    return responseHandler(res, statusCode.SUCCESS, data!)
  }
}

export default new ProductController()
