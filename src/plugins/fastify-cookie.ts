import fastifyCookie from "@fastify/cookie"
import fp from "fastify-plugin"

export default fp(async (app) => {
  await app.register(fastifyCookie)
})
