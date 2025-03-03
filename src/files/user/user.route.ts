import express from "express"
import userController from "./user.controller"
const { checkSchema } = require("express-validator")
import validate from "../../validations/validate"
import userValidation from "../../validations/user/user.validation"
import { isAuthenticated } from "../../utils"
import uploadManager from "../../utils/multer"

const UserRoute = express.Router()

const {
  signupController,
  loginController,
  resetPassword,
  forgotPassword,
  profileImage,
} = userController

UserRoute.post("/", validate(checkSchema(userValidation)), signupController)
UserRoute.post("/login", loginController)
UserRoute.post("/forgot-password", forgotPassword)
UserRoute.post("/reset-password", resetPassword)
UserRoute.use(isAuthenticated)
UserRoute.put(
  "/profile-image",
  uploadManager("ProfileImage").single("image"),
  profileImage,
)

export default UserRoute
