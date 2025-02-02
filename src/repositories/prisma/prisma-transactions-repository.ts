import { prisma } from "@/lib/prisma";
import { TransactionsRepository } from "@/repositories/transactions-repository";
import { Prisma, Transactions } from "@prisma/client";

export class PrismaTransactionsRepository implements TransactionsRepository {
    async delete(id: number): Promise<Transactions> {
        return await prisma.transactions.delete({ where: { id } });
    }
    async findByTransactionId(transactionId: number): Promise<Transactions | null> {
        return await prisma.transactions.findUnique({ where: { id: transactionId } });
    }
    async create(data: Prisma.TransactionsCreateInput): Promise<Transactions> {
        return await prisma.transactions.create({ data });
    }
}