import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { UsersService } from "../users-service"

export function makeUsersService() {
  const usersService = new UsersService(new PrismaUsersRepository())
  return usersService
}

