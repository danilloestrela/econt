import { verifyJwt } from "@/http/middlewares/verify-jwt-middleware";
import { FastifyInstance } from "fastify";
import { getRemunerationsByDate } from "../controllers/remunerations-controller";

export function remunerationsRoutes(app: FastifyInstance) {
    app.get("/", { preHandler: [verifyJwt], handler: getRemunerationsByDate })
}