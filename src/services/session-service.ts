import jwt from "jsonwebtoken"
import { SessionsRepository } from "@/repositories/session-repository"
import { Prisma, Session, User } from "@prisma/client"
import * as userErrors from "@/services/errors/user-errors"
import { env } from "@/env"

export class SessionService {
  constructor(private sessionsRepository: SessionsRepository) {}

  async createSession(data: Prisma.SessionCreateInput): Promise<Session> {
    return this.sessionsRepository.create(data)
  }

  async getPreviousJwtFromUser(user: User): Promise<Session | null> {
    const session = await this.sessionsRepository.findByUserId(user.id)
    return session
  }

  async getPreviousJwtFromToken(jwtToken: string): Promise<Session | null> {
    const session = await this.sessionsRepository.findByToken(jwtToken)
    return session
  }

  async checkJwtAndRemoveIfExpired(token: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload
      const session = await this.getPreviousJwtFromToken(token)

      if (!session) {
        throw new userErrors.UserSessionNotFoundError()
      }

      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        await this.sessionsRepository.deleteByToken(token)
        throw new userErrors.UserSessionExpiredError()
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        await this.sessionsRepository.deleteByToken(token)
      } else {
        throw error
      }
    }
  }
}
