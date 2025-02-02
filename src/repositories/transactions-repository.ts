import { Prisma, Transactions } from "@prisma/client"

export interface TransactionsRepository {
  create(data: Prisma.TransactionsCreateInput): Promise<Transactions>
  delete(id: number): Promise<Transactions>
  findByTransactionId(transactionId: number): Promise<Transactions | null>
}