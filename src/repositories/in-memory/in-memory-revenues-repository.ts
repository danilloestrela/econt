import { RevenuesRepository } from "@/repositories/revenues-respository";
import { Prisma, Revenues } from "@prisma/client";
export class InMemoryRevenuesRepository implements RevenuesRepository {
    async create(data: Prisma.RevenuesCreateInput): Promise<Revenues> {
        return {
            id: "1",
            total_amount: BigInt(0),
            total_fee_amount: BigInt(0),
            source_id: 1,
            period_id: 1,
            company_id: 1,
            conversion_id: null,
            transaction_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
        }
    }
    update(id: string, data: Prisma.RevenuesUpdateInput): Promise<Revenues> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<Revenues | Error> {
        throw new Error("Method not implemented.");
    }
    findByCompanyId(companyId: number): Promise<Revenues | null> {
        throw new Error("Method not implemented.");
    }
}