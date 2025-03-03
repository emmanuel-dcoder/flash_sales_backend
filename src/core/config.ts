import * as dotenv from "dotenv"
dotenv.config()

const config = {
  SECRET_KEY: process.env.SECRET_KEY,
  PAYSTACK_URL: process.env.PAYSTACK_BASE_URL,
  PAYSTACK_KEY: process.env.PAYSTACK_SK_KEY,
  ENV: process.env.ENVIRONMENT,
}

export default config
