import { calculateIRPF, calculateTaxes, createRevenue } from "@/http/controllers/revenues-controller"
import { verifyJwt } from "@/http/middlewares/verify-jwt-middleware"
import { FastifyInstance } from "fastify"

export default async function revenuesRoutes(app: FastifyInstance) {
  app.post("/taxes", { preHandler: [verifyJwt], handler: calculateTaxes })
  app.post("/irpf", { preHandler: [verifyJwt], handler: calculateIRPF })
  app.post("/", { preHandler: [verifyJwt], handler: createRevenue })
}
