import { FastifyInstance } from "fastify"
import { authRoutes } from "./auth-routes"
import { healthRoutes } from "./health-routes"
import revenuesRoutes from "./revenues"
import { usersRoutes } from "./users-routes"

export default async function configureRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: "/auth" })
  app.register(healthRoutes)
  app.register(usersRoutes, { prefix: "/users" })
  app.register(revenuesRoutes, { prefix: "/revenues" })
}
