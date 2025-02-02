import { Prisma, Sessions } from "@prisma/client"

export interface SessionsRepository {
  create(data: Prisma.SessionsCreateInput): Promise<Sessions>
  findByToken(token: string): Promise<Sessions | null>
  findByUserId(userId: string): Promise<Sessions | null>
  deleteByToken(token: string): Promise<Sessions | null>
}
