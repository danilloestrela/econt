import { makeRevenuesService } from "@/services/factories/make-revenues-service"
import { Anexo3Year, makeAnexo3Service } from "@/services/factories/taxes-factories/make-anexo3-service"
import { IRPFYear, makeIRPFService } from "@/services/factories/taxes-factories/make-irpf-service"
import { Currencies, Months } from "@prisma/client"
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
    period: z.object({
      month_period: z.nativeEnum(Months),
      year_period: z.number(),
      description: z.string().optional(),
    }),
    sourceId: z.number(),
    fees: z.array(
        z.object({
          amount: z.number(),
          description: z.string(),
          type: z.object({
            name: z.string(),
            description: z.string(),
          }),
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
    period: revenue.period,
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
    revenue: z.number(),
    isAbroad: z.boolean(),
  })

  const { rba12, revenue, isAbroad } = calculateTaxesBodySchema.parse(request.body)

  const anexo3Service = makeAnexo3Service(Anexo3Year.Y2025);
  const tax = await anexo3Service.calculateTax({ revenue, rba12, isAbroad });

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
