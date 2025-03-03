import { NextFunction, Response, Request } from "express"
import { responseHandler } from "../../core/response"
import { manageAsyncOps } from "../../utils"
import { CustomError } from "../../utils/error"
import PaymentService from "./payment.service"
import { statusCode } from "../../constants/statusCode"
import config from "../../core/config"
import crypto from "crypto"

class PaymentController {
  async create(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      PaymentService.create({ userId: res.locals.jwt._id, ...req.body }),
    )
    if (error) return next(error)
    if (!data?.success)
      return next(new CustomError(data!.msg, statusCode.BAD_REQUEST, data!))
    return responseHandler(res, statusCode.CREATED, data!)
  }

  async fetch(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(PaymentService.fetch(req.query))
    if (error) return next(error)
    if (!data?.success)
      return next(new CustomError(data!.msg, statusCode.BAD_REQUEST, data!))
    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  async paystackWebHook(req: Request, res: Response, next: NextFunction) {
    const hash = crypto
      .createHmac("sha512", config.PAYSTACK_KEY!)
      .update(JSON.stringify(req.body))
      .digest("hex")

    if (hash == req.headers["x-paystack-signature"]) {
      const event = req.body
      const [error, data] = await manageAsyncOps(
        PaymentService.verifyCardPayment(event),
      )
      res.send(200)
    }
  }
}

export default new PaymentController()
