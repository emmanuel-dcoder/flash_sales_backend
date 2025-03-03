import mongoose from "mongoose"

export interface IProduct {
  _id?: mongoose.Types.ObjectId
  name: string
  totalUnits: number
  availableUnits: number
  amount: number
  image: string
  purchaseLimit: number
  salesStartTime: Date
  salesEndTime?: Date
  isActive: boolean
  seller?: mongoose.Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
}
