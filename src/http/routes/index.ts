import { FastifyInstance } from "fastify"
import { authRoutes } from "./auth-routes"
import { calculateRoutes } from "./calculate"
import { healthRoutes } from "./health-routes"
import { remunerationsRoutes } from "./remunerations"
import revenuesRoutes from "./revenues"
import { usersRoutes } from "./users-routes"

export default async function configureRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: "/auth" })
  app.register(healthRoutes)
  app.register(usersRoutes, { prefix: "/users" })
  app.register(revenuesRoutes, { prefix: "/revenues" })
  app.register(remunerationsRoutes, { prefix: "/remunerations" })
  app.register(calculateRoutes, { prefix: "/calculate" })
}
