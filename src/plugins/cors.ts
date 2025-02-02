import cors from "@fastify/cors"
import fp from "fastify-plugin"

export default fp(async (app) => {
  await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "authorization", "refresh-token", "x-api-key"],
  })
})
