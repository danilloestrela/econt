import { PrismaConversionsRepository } from "@/repositories/prisma/prisma-conversions-repository";
import { ConversionsService } from "@/services/conversions-service";

export function makeConversionsService() {
    const conversionsRepository = new PrismaConversionsRepository();
    return new ConversionsService(conversionsRepository);
}