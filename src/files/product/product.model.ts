import mongoose, { Schema, model } from "mongoose"
import { IProduct } from "./product.interface"

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    totalUnits: {
      type: Number,
      default: 200,
    },
    amount: {
      type: Number,
    },
    image: {
      type: String,
    },
    availableUnits: {
      type: Number,
      default: 200,
    },
    purchaseLimit: {
      type: Number,
      default: 1,
    },
    salesStartTime: {
      type: Date,
      required: true,
    },
    salesEndTime: {
      type: Date,
      required: true,
    },
    isActive: { type: Boolean, default: false },
    seller: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

const product = model<IProduct>("Product", ProductSchema, "product")

export default product
