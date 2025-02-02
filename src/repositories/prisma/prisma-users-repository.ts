import { prisma } from "@/lib/prisma"
import { Prisma, Users } from "@prisma/client"
import { UsersRepository } from "../users-repository"

export class PrismaUsersRepository implements UsersRepository {
  async listUsers(): Promise<Users[]> {
    return await prisma.users.findMany()
  }

  async create(data: Prisma.UsersCreateInput) {
    return await prisma.users.create({ data })
  }

  async findByEmail(email: string): Promise<Users | null> {
    return await prisma.users.findUnique({
      where: { email },
    })
  }

  async findById(id: string): Promise<Users | null> {
    return await prisma.users.findUnique({
      where: { id },
    })
  }
}
