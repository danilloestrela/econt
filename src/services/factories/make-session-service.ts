import { PrismaSessionsRepository } from "@/repositories/prisma/prisma-session.repository"
import { SessionService } from "../session-service"

export function makeSessionService() {
  const sessionService = new SessionService(new PrismaSessionsRepository())
  return sessionService
}
