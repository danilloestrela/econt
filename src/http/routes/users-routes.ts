import { list } from "@/http/controllers/users-controller"
import { adminProtected } from "@/http/middlewares/admin-protected-middleware"
import { verifyJwt } from "@/http/middlewares/verify-jwt-middleware"
import { FastifyInstance } from "fastify"
export async function usersRoutes(app: FastifyInstance) {

  app.get("/", { onRequest: [verifyJwt, adminProtected] }, async (request, reply) => {
    return list(request, reply)
  })

  app.post("/", { onRequest: [verifyJwt, adminProtected] }, async (request, reply) => {
    return reply.send({ message: "Create User" })
  })

  app.put("/:id", { onRequest: [verifyJwt, adminProtected] }, async (request, reply) => {
    return reply.send({ message: "Update User" })
  })

  app.delete("/:id", { onRequest: [verifyJwt, adminProtected] }, async (request, reply) => {
    return reply.send({ message: "Delete User" })
  })

  // Current user allowed actions
  app.get("/me", { onRequest: [verifyJwt] }, async (request, reply) => {
    return reply.send({ message: "Get Me" })
  })

  app.put("/me", { onRequest: [verifyJwt] }, async (request, reply) => {
    return reply.send({ message: "Update Me" })
  })
}
