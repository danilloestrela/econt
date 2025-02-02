import Fastify, { FastifyInstance } from "fastify"

export const app: FastifyInstance = Fastify({ logger: true })
