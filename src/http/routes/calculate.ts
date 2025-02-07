import { calculateIRPF, calculateTaxes } from "@/http/controllers/calcs-controler";
import { verifyJwt } from "@/http/middlewares/verify-jwt-middleware";
import { FastifyInstance } from "fastify";

export function calculateRoutes(app: FastifyInstance) {
    app.post("/taxes", { preHandler: [verifyJwt], handler: calculateTaxes })
    app.post("/irpf", { preHandler: [verifyJwt], handler: calculateIRPF })
}
