import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import * as userErrors from "@/services/errors/user-errors"
import { makeSessionService } from "@/services/factories/make-session-service"

interface SessionFastifyRequest extends FastifyRequest {
  session?: string
}

export async function sessionAuth(
  request: SessionFastifyRequest,
  reply: FastifyReply,
) {
  const jwtToken = request.headers["authorization"]?.split(" ")[1]

  const tokenSchema = z.string().min(1, { message: "Session token is missing" })
  const token = tokenSchema.parse(jwtToken)

  try {
    const sessionService = makeSessionService()
    await sessionService.checkJwtAndRemoveIfExpired(token)
    return
  } catch (error) {
    if (error instanceof userErrors.UserSessionNotFoundError) {
      reply.status(401).send({ message: error.message })
    }
  }
}
