import { createRevenue, getRevenuesByDate } from "@/http/controllers/revenues-controller"
import { verifyJwt } from "@/http/middlewares/verify-jwt-middleware"
import { FastifyInstance } from "fastify"

export default async function revenuesRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: [verifyJwt], handler: createRevenue })
  app.get("/", { preHandler: [verifyJwt], handler: getRevenuesByDate } )
}
