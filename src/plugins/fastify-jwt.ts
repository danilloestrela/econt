import { env } from "@/env"
import fastifyJwt from "@fastify/jwt"
import fp from "fastify-plugin"

export default fp(async (app) => {
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: 'refreshToken',
      signed: false,
    },
    sign: {
      expiresIn: '10m',
    },
  })
})
