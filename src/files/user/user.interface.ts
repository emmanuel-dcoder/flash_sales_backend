import mongoose from "mongoose"

export interface IUser {
  _id?: mongoose.Types.ObjectId
  fullName: string
  image: string
  email: string
  phoneNumber: string
  password: string
  role: "buyer" | "seller"
  verificationOtp: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IJwt {
  _id: string
  role: string
}
