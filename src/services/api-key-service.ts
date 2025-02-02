import { ApiKeysRepository } from "@/repositories/api-keys-repository"
import { Prisma, ApiKey } from "@prisma/client"

export interface ApiKeyRequest {
  id?: string
  key: string
  name: string
  created_by_user_id: string
}

export class ApiKeyService {
  constructor(private apiKeyRepository: ApiKeysRepository) {}

  async create(apiKeyData: Partial<ApiKeyRequest>): Promise<ApiKey> {
    return await this.apiKeyRepository.create(
      apiKeyData as Prisma.ApiKeyCreateInput,
    )
  }

  async getApiKey(apiKey: string): Promise<ApiKey | null> {
    return this.apiKeyRepository.findByKey(apiKey)
  }
}
