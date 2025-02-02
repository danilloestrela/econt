import { ApiKey, Prisma } from "@prisma/client"

export interface ApiKeysRepository {
  create(data: Prisma.ApiKeyCreateInput): Promise<ApiKey>
  findByKey(key: string): Promise<ApiKey | null>
}
