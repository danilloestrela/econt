import { makeUsersService } from "@/services/factories/make-users-service"
import { FastifyReply, FastifyRequest } from "fastify"
export async function adminProtected(request: FastifyRequest, reply: FastifyReply) {
  const usersService = makeUsersService()
  const isAdmin = await usersService.isUserAdmin(request.user.sub)
  if (!isAdmin) {
    return reply.status(401).send({ message: "Unauthorized" })
  }
}
