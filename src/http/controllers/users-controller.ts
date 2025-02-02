import { makeUsersService } from "@/services/factories/make-users-service"
import { FastifyReply, FastifyRequest } from "fastify"

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const usersService = makeUsersService()
  const users = await usersService.listUsers()
  reply.send(users)
}
