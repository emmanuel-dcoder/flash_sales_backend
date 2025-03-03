import { IResponse } from "../../constants"

export interface IPaymentProvider {
  initiatePayment: (payload: {
    amount: number
    email: string
  }) => Promise<IResponse>

  verifyCardPayment: (payload: Record<string, string>) => Promise<IResponse>

  verifyProviderPayment: (reference: string) => Promise<IResponse>
}
