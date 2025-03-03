import { NextFunction, Response, Request } from "express"
import { responseHandler } from "../../core/response"
import { manageAsyncOps } from "../../utils"
import { CustomError } from "../../utils/error"
import { statusCode } from "../../constants/statusCode"
import LeadershipService from "./leadership.service"

class LeadershipController {
  async fetch(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      LeadershipService.fetchUserPaidProducts(req.query),
    )
    if (error) return next(error)
    if (!data?.success)
      return next(new CustomError(data!.msg, statusCode.BAD_REQUEST, data!))
    return responseHandler(res, statusCode.CREATED, data!)
  }
}

export default new LeadershipController()
