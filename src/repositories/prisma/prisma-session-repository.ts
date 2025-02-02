import { prisma } from "@/lib/prisma"
import { SessionsRepository } from "@/repositories/session-repository"
import { Prisma, Sessions } from "@prisma/client"

export class PrismaSessionsRepository implements SessionsRepository {
  async create(data: Prisma.SessionsCreateInput): Promise<Sessions> {
    return await prisma.sessions.create({ data })
  }

  async findByToken(jwt: string): Promise<Sessions | null> {
    return await prisma.sessions.findFirst({ where: { sessionToken: jwt } })
  }

  async findByUserId(userId: string): Promise<Sessions | null> {
    return await prisma.sessions.findFirst({ where: { user_id: userId } })
  }

  async deleteByToken(jwt: string): Promise<Sessions | null> {
    return await prisma.sessions.delete({ where: { sessionToken: jwt } })
  }
}
