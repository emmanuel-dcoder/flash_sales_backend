import { IUser } from "./user.interface"
import User from "./user.model"
import pagination, { IPagination } from "../../constants"
import { UpdateQuery } from "mongoose"

const { LIMIT, SKIP, SORT } = pagination

export default class UserRepository {
  static async createUser(userPayload: IUser): Promise<IUser> {
    return await User.create(userPayload)
  }

  static async fetchUser(
    userPayload: Partial<IUser>,
    select: Partial<Record<keyof IUser, number | boolean | object>> = {
      _id: 1,
      email: 1,
    },
  ): Promise<Partial<IUser> | null> {
    const user: Awaited<IUser | null> = await User.findOne(
      {
        ...userPayload,
      },
      select,
    ).lean()
    return user
  }

  static async validateUser(query: Partial<IUser> | { $or: Partial<IUser>[] }) {
    return User.exists(query)
  }

  static async updateUsersProfile(
    userPayload: Partial<IUser>,
    update: UpdateQuery<Partial<IUser>>,
  ) {
    const updateUser = await User.findOneAndUpdate(
      {
        ...userPayload,
      },
      { ...update },
      { new: true, runValidators: true },
    )

    return updateUser
  }

  static async fetchUsersByParams(
    userPayload: Partial<IUser & IPagination>,
    select: Partial<Record<keyof IUser, number | boolean | object>> = {
      _id: 1,
      email: 1,
    },
  ) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = userPayload
    const user: Awaited<IUser[] | null> = await User.find({
      ...restOfPayload,
    })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select)
    return user
  }
}
