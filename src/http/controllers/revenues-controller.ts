import { makeRevenuesService } from "@/services/factories/make-revenues-service"
import { Anexo3Year, makeAnexo3Service } from "@/services/factories/taxes-factories/make-anexo3-service"
import { IRPFYear, makeIRPFService } from "@/services/factories/taxes-factories/make-irpf-service"
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

export async function calculateTaxes(request: FastifyRequest, reply: FastifyReply) {
  const calculateTaxesBodySchema = z.object({
    rba12: z.number(),
    last12MonthRemuneration: z.number(),
    isAbroad: z.boolean(),
  })

  const { rba12, last12MonthRemuneration, isAbroad } = calculateTaxesBodySchema.parse(request.body)

  const anexo3Service = makeAnexo3Service(Anexo3Year.Y2025);
  const tax = await anexo3Service.calculateTax({ last12MonthRemuneration, rba12, isAbroad });

  return reply.status(200).send({ ...tax });
}

export async function calculateIRPF(request: FastifyRequest, reply: FastifyReply) {
  const calculateIRPFBodySchema = z.object({
    grossSalary: z.number(),
    dependentsCount: z.number().optional(),
  })

  const { grossSalary, dependentsCount } = calculateIRPFBodySchema.parse(request.body)

  const irpfService = makeIRPFService(IRPFYear.Y2025);
  const tax = await irpfService.calculateTax(grossSalary, dependentsCount);

  return reply.status(200).send({ ...tax });
}

export async function getRevenuesByDate(request: FastifyRequest, reply: FastifyReply) {
  const getRevenuesByDateBodySchema = z.object({
    companyId: z.number(),
    date: z.string(),
  })

  const { companyId, date } = getRevenuesByDateBodySchema.parse(request.body)

  const revenuesService = makeRevenuesService()
  const revenues = await revenuesService.getRevenuesByDate({ companyId, date })

  return reply.status(200).send(revenues)
}
