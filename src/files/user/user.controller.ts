import { NextFunction, Response, Request } from "express"
import { responseHandler } from "../../core/response"
import { fileModifier, manageAsyncOps } from "../../utils"
import { CustomError } from "../../utils/error"
import UserService from "./user.service"
import { statusCode } from "../../constants/statusCode"

class UserController {
  async signupController(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(UserService.signup(req.body))
    if (error) return next(error)
    if (!data?.success)
      return next(new CustomError(data!.msg, statusCode.BAD_REQUEST, data!))
    return responseHandler(res, statusCode.CREATED, data!)
  }

  async loginController(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(UserService.login(req.body))
    if (error) return next(error)
    if (!data?.success)
      return next(new CustomError(data!.msg, statusCode.BAD_REQUEST, data!))
    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      UserService.forgotPassword(req.body),
    )
    if (error) return next(error)
    if (!data?.success)
      return next(new CustomError(data!.msg, statusCode.BAD_REQUEST, data!))
    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      UserService.resetPassword(req.body),
    )
    if (error) return next(error)
    if (!data?.success)
      return next(new CustomError(data!.msg, statusCode.BAD_REQUEST, data!))
    return responseHandler(res, statusCode.SUCCESS, data!)
  }

  async profileImage(req: Request, res: Response, next: NextFunction) {
    let { image } = fileModifier(req)
    const [error, data] = await manageAsyncOps(
      UserService.profileImage({ image, _id: res.locals.jwt._id }),
    )
    if (error) return next(error)
    if (!data?.success)
      return next(new CustomError(data!.msg, statusCode.BAD_REQUEST, data!))
    return responseHandler(res, statusCode.SUCCESS, data!)
  }
}

export default new UserController()
