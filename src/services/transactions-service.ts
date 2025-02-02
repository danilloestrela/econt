import { TransactionsRepository } from "@/repositories/transactions-repository";
import { Prisma, Transactions } from "@prisma/client";

export class TransactionsService {
    constructor(private transactionsRepository: TransactionsRepository) {}

    async create(data: Prisma.TransactionsCreateInput): Promise<Transactions> {
        return this.transactionsRepository.create(data);
    }

    async findByTransactionId(transactionId: number): Promise<Transactions | null> {
        return this.transactionsRepository.findByTransactionId(transactionId);
    }

    async delete(id: number): Promise<Transactions> {
        return this.transactionsRepository.delete(id);
    }
}