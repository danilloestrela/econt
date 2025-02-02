import { UsersRepository } from "@/repositories/users-repository"
import { hashPassword } from "@/utils/passwordUtils"
import { Prisma, Roles, Users } from "@prisma/client"
import {
  UserAlreadyExistsError,
  UserDoesNotExistsError,
  UserNeedsEmailToRegisterError
} from "./errors/user-errors"

export interface UsersServiceRequest {
  id?: string
  email: string
  password?: string
  googleId?: string
  name?: string
  role?: Roles
}

export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(userData: Partial<UsersServiceRequest>): Promise<Users> {
    if (!userData.email) {
      throw new UserNeedsEmailToRegisterError()
    }

    const existingUser = await this.usersRepository.findByEmail(userData.email)
    if (existingUser) {
      throw new UserAlreadyExistsError()
    }

    if (userData.password) {
      userData.password = await hashPassword(userData.password)
    }

    return await this.usersRepository.create(userData as Prisma.UsersCreateInput)
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    const user = await this.usersRepository.findById(userId)
    return user?.role === Roles.admin
  }

  async listUsers(): Promise<Users[]> {
    return await this.usersRepository.listUsers()
  }

  async findByEmail(email: string): Promise<Users | null> {
    return await this.usersRepository.findByEmail(email)
  }

  async userExists(userId: string): Promise<boolean> {
    const user = await this.usersRepository.findById(userId)
    if(!user) {
      throw new UserDoesNotExistsError()
    }
    return true
  }
}
