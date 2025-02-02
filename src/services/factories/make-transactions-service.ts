import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository"
import { TransactionsService } from "../transactions-service"

export function makeTransactionsService() {
    const transactionsRepository = new PrismaTransactionsRepository()
    return new TransactionsService(transactionsRepository)
}