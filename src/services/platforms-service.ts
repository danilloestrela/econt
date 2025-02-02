import { PlatformsRepository } from "@/repositories/platforms-repository";

export class PlatformsService {
    constructor(private platformsRepository: PlatformsRepository) {}

    async getPlatform(id: number) {
        return this.platformsRepository.findById(id)
    }

    async hasPlatform(id: number) {
        const platform = await this.platformsRepository.findById(id)
        return platform
    }
}