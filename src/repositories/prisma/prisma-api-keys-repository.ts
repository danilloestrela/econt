import { prisma } from "@/lib/prisma"
import { ApiKey, Prisma } from "@prisma/client"
import { ApiKeysRepository } from "@/repositories/api-keys-repository"

export class PrismaApiKeysRepository implements ApiKeysRepository {
  async create(data: Prisma.ApiKeyCreateInput) {
    return await prisma.apiKey.create({ data })
  }

  async findByKey(key: string): Promise<ApiKey | null> {
    return await prisma.apiKey.findUnique({
      where: { key },
    })
  }
}
