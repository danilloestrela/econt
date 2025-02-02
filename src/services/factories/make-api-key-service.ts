import { PrismaApiKeysRepository } from "@/repositories/prisma/prisma-api-keys-repository"
import { ApiKeyService } from "../api-key-service"

export function makeApiKeyService() {
  const apiKeyService = new ApiKeyService(new PrismaApiKeysRepository())
  return apiKeyService
}
