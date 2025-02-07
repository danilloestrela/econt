import { makeRevenuesService } from "@/services/factories/make-revenues-service"
import { Currencies, FeeTypes } from "@prisma/client"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function createRevenue(request: FastifyRequest, reply: FastifyReply) {
  const createRevenueBodySchema = z.object({
    companyId: z.number(),
    platformId: z.number(),
    fromAmount: z.number(),
    fromCurrency: z.nativeEnum(Currencies).default(Currencies.usd),
    toCurrency: z.nativeEnum(Currencies).default(Currencies.brl),
    marketCurrencyValue: z.number(),
    platformCurrencyValue: z.number(),
    receivedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
    sourceId: z.number(),
    fees: z.array(
        z.object({
          amount: z.number(),
          amount_percentage: z.number().optional(),
          description: z.string(),
          fee_type: z.nativeEnum(FeeTypes),
          currency: z.nativeEnum(Currencies),
        })
      ).optional(),
  })

  const revenue = createRevenueBodySchema.parse(request.body)

  if (!revenue) {
    return reply.status(400).send({ message: "Invalid" })
  }

  const revenuesService = makeRevenuesService()
  const newRevenue = await revenuesService.newRevenue({
    companyId: revenue.companyId,
    fromAmount: revenue.fromAmount,
    fromCurrency: revenue.fromCurrency,
    toCurrency: revenue.toCurrency,
    marketCurrencyValue: revenue.marketCurrencyValue,
    platformCurrencyValue: revenue.platformCurrencyValue,
    receivedDate: revenue.receivedDate,
    fees: revenue.fees,
    userId: request.user.sub,
    platformId: revenue.platformId,
    sourceId: revenue.sourceId,
  })


  return reply.status(201).send(newRevenue)
}

export async function getRevenuesByDate(request: FastifyRequest, reply: FastifyReply) {
  const getRevenuesByDateBodySchema = z.object({
    companyId: z.coerce.number(),
    date: z.string(),
  })

  const { companyId, date } = getRevenuesByDateBodySchema.parse(request.query)

  const revenuesService = makeRevenuesService()
  const revenues = await revenuesService.getRevenuesByDate({ companyId, date })

  return reply.status(200).send(revenues)
}
