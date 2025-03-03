import { Schema, model } from "mongoose"
import { IUser } from "./user.interface"

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    image: { type: String },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verificationOtp: { type: String },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      required: true,
    },
  },
  { timestamps: true },
)

const user = model<IUser>("User", UserSchema, "user")

export default user
