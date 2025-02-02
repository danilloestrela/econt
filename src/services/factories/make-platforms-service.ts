import { PrismaPlatformsRepository } from "@/repositories/prisma/prisma-platforms-repository";
import { PlatformsService } from "@/services/platforms-service";

export function makePlatformsService() {
    const platformsRepository = new PrismaPlatformsRepository();
    return new PlatformsService(platformsRepository);
}