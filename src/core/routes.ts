import { Application } from "express"

import UserRoute from "../files/user/user.route"
import ProductRoute from "../files/product/product.route"
import PaymentRoute from "../files/payment/payment.route"
import LeadershipRoute from "../files/leadership/leadership.route"

export const routes = (app: Application) => {
  const base = "/api/v1"

  app.use(`${base}/user`, UserRoute)
  app.use(`${base}/product`, ProductRoute)
  app.use(`${base}/payment`, PaymentRoute)
  app.use(`${base}/leadership`, LeadershipRoute)
}
