import configureRoutes from "@/http/routes"
import corsPlugin from "@/plugins/cors"
import fastifyCookiePlugin from "@/plugins/fastify-cookie"
import fastifyJwtPlugin from "@/plugins/fastify-jwt"
import rateLimitPlugin from "@/plugins/rate-limit"
import websocketPlugin from "@/plugins/websocket"
import helmet from "@fastify/helmet"
import { FastifyInstance } from "fastify"

export async function configurePlugins(app: FastifyInstance) {
  await configureRoutes(app)
  await app.register(helmet)
  await app.register(rateLimitPlugin)
  await app.register(corsPlugin)
  await app.register(websocketPlugin)
  await app.register(fastifyJwtPlugin)
  await app.register(fastifyCookiePlugin)
  // Register other plugins here
}
