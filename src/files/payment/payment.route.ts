import express from "express"
import paymentController from "./payment.controller"
const { checkSchema } = require("express-validator")
import validate from "../../validations/validate"
import paymentValidation from "../../validations/payment/payment.validation"
import { isAuthenticated } from "../../utils"

const PaymentRoute = express.Router()

const { create, paystackWebHook, fetch } = paymentController

PaymentRoute.post("/webhook", paystackWebHook)
PaymentRoute.use(isAuthenticated)

PaymentRoute.post("/", validate(checkSchema(paymentValidation)), create)
PaymentRoute.get("/", fetch)

export default PaymentRoute
