import { prisma } from "@/lib/prisma"
import { SessionsRepository } from "@/repositories/session-repository"
import { Prisma, Sessions } from "@prisma/client"

export class PrismaSessionsRepository implements SessionsRepository {
  async create(data: Prisma.SessionsCreateInput): Promise<Sessions> {
    return await prisma.sessions.create({ data, include: {
      user: true
    } })
  }

  async findByToken(jwt: string): Promise<Sessions | null> {
    return await prisma.sessions.findFirst({
      where: { sessionToken: jwt },
      include: {
        user: true
      }
    })
  }

  async findByUserId(userId: string): Promise<Sessions | null> {
    return await prisma.sessions.findFirst({
      where: { user_id: userId },
      include: {
        user: true
      }
    })
  }

  async deleteByToken(jwt: string): Promise<Sessions | null> {
    return await prisma.sessions.delete({
      where: { sessionToken: jwt },
      include: {
        user: true
      }
    })
  }
}
