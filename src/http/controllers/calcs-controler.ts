import { makeIRPFService } from "@/services/factories/taxes-factories/make-irpf-service";

import { makeAnexo3Service } from "@/services/factories/taxes-factories/make-anexo3-service";

import { Anexo3Year } from "@/services/factories/taxes-factories/make-anexo3-service";
import { IRPFYear } from "@/services/factories/taxes-factories/make-irpf-service";
import { FastifyRequest } from "fastify";

import { FastifyReply } from "fastify";
import { z } from "zod";

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