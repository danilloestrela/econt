import { makeRemunerationsService } from "@/services/factories/make-remunerations-service"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function getRemunerationsByDate(request: FastifyRequest, reply: FastifyReply) {
  const getRemunerationsBodySchema = z.object({
    companyId: z.coerce.number(),
    date: z.string(),
  })
  const { companyId, date } = getRemunerationsBodySchema.parse(request.query)

  const remunerationsService = makeRemunerationsService()
  const remunerations = await remunerationsService.getRemunerationsByDate({companyId, date})

  return reply.status(200).send(remunerations)
}
