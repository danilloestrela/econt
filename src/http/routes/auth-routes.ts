import {
  login,
  refresh,
  register
} from "@/http/controllers/auth-controller"
import { FastifyInstance } from "fastify"

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", register)

  app.post("/login", login)

  app.patch("/refresh", refresh)
  // app.get("/login/google", googleLogin)

  // app.get("/auth/google/callback", googleCallback)
}
