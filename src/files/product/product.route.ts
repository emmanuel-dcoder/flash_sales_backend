import express from "express"
import productController from "./product.controller"
const { checkSchema } = require("express-validator")
import validate from "../../validations/validate"
import productValidation from "../../validations/product/product.validation"
import { isAuthenticated } from "../../utils"
import uploadManager from "../../utils/multer"

const ProductRoute = express.Router()

const { create, update, fetch, fetchOne, reset } = productController

ProductRoute.use(isAuthenticated)

ProductRoute.post(
  "/",
  uploadManager("productImage").single("image"),
  validate(checkSchema(productValidation)),
  create,
)
ProductRoute.put("/:id", update)
ProductRoute.put("/reset/:id", reset)
ProductRoute.get("/fetch", fetch)
ProductRoute.get("/fetch-one/:id", fetchOne)

export default ProductRoute
