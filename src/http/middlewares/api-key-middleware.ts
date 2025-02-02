import { makeAuthService } from "@/services/factories/make-auth-service"
import { FastifyReply, FastifyRequest } from "fastify"

export async function apiKeyAuth(request: FastifyRequest, reply: FastifyReply) {
  const apiKey = request.headers["x-api-key"] as string

  if (!apiKey) {
    return reply.code(401).send({ message: "01 - Unauthorized" })
  }

  const authService = makeAuthService()
  const validApiKey = await authService.isApiKeyValid(apiKey)
  if (!validApiKey) {
    return reply.code(401).send({ message: "02 - Unauthorized" })
  }
}
