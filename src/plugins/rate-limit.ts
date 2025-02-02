import rateLimit from "@fastify/rate-limit"
import fp from "fastify-plugin"

export default fp(async (app) => {
  await app.register(rateLimit, {
    max: 100, // maximum number of requests
    timeWindow: '5 minutes', // time window for the rate limit
    errorResponseBuilder: (req, res) => {
      return { message: "Too many requests, please try again later." }
    }
  })
})
