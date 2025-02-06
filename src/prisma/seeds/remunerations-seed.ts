import { prisma } from "@/lib/prisma";
import { convertNumberToDecimalPrecision } from "@/utils/decimalUtils";
import { Currencies, Prisma, TransactionAgents, Transactions, TransactionTypes } from "@prisma/client";

export async function execute() {

    const users = await prisma.users.findFirst({where: {
        email: 'hey@danilloestrela.com'
        }})

        const transactions: Prisma.TransactionsCreateInput[] = [
        {
            description: 'janeiro/2024',
            date: new Date('2024-01-01').toISOString(),
            transaction_type: TransactionTypes.withdraw,
            from_agent: TransactionAgents.company,
            to_agent: TransactionAgents.business_associate,
            users: {
                connect: {
                    id: users!.id
                }
            }
        },
        {
            description: 'fevereiro/2024',
            date: new Date('2024-02-01').toISOString(),
            transaction_type: TransactionTypes.withdraw,
            from_agent: TransactionAgents.company,
            to_agent: TransactionAgents.business_associate,
            users: {
                connect: {
                    id: users!.id
                }
            }
        },
        {
            description: 'março/2024',
            date: new Date('2024-03-01').toISOString(),
            transaction_type: TransactionTypes.withdraw,
            from_agent: TransactionAgents.company,
            to_agent: TransactionAgents.business_associate,
            users: {
                connect: {
                    id: users!.id
                }
            }
        },
        {
            description: 'abril/2024',
            date: new Date('2024-04-01').toISOString(),
            transaction_type: TransactionTypes.withdraw,
            from_agent: TransactionAgents.company,
            to_agent: TransactionAgents.business_associate,
            users: {
                connect: {
                    id: users!.id
                }
            }
        },
        {
            description: 'maio/2024',
            date: new Date('2024-05-01').toISOString(),
            transaction_type: TransactionTypes.withdraw,
            from_agent: TransactionAgents.company,
            to_agent: TransactionAgents.business_associate,
            users: {
                connect: {
                    id: users!.id
                }
            }
        },
        {
            description: 'junho/2024',
            date: new Date('2024-06-01').toISOString(),
            transaction_type: TransactionTypes.withdraw,
            from_agent: TransactionAgents.company,
            to_agent: TransactionAgents.business_associate,
            users: {
                connect: {
                    id: users!.id
                }
            }
        },
        {
            description: 'julho/2024',
            date: new Date('2024-07-01').toISOString(),
            transaction_type: TransactionTypes.withdraw,
            from_agent: TransactionAgents.company,
            to_agent: TransactionAgents.business_associate,
            users: {
                connect: {
                    id: users!.id
                }
            }
        },
        {
            description: 'agosto/2024',
            date: new Date('2024-08-01').toISOString(),
            transaction_type: TransactionTypes.withdraw,
            from_agent: TransactionAgents.company,
            to_agent: TransactionAgents.business_associate,
            users: {
                connect: {
                    id: users!.id
                }
            }
        },
        {
            description: 'setembro/2024',
            date: new Date('2024-09-01').toISOString(),
            transaction_type: TransactionTypes.withdraw,
            from_agent: TransactionAgents.company,
            to_agent: TransactionAgents.business_associate,
            users: {
                connect: {
                    id: users!.id
                }
            }
        },
        {
            description: 'outubro/2024',
            date: new Date('2024-10-01').toISOString(),
            transaction_type: TransactionTypes.withdraw,
            from_agent: TransactionAgents.company,
            to_agent: TransactionAgents.business_associate,
            users: {
                connect: {
                    id: users!.id
                }
            }
        },
        {
            description: 'novembro/2024',
            date: new Date('2024-11-01').toISOString(),
            transaction_type: TransactionTypes.withdraw,
            from_agent: TransactionAgents.company,
            to_agent: TransactionAgents.business_associate,
            users: {
                connect: {
                    id: users!.id
                }
            }
        },
        {
            description: 'dezembro/2024',
            date: new Date('2024-12-01').toISOString(),
            transaction_type: TransactionTypes.withdraw,
            from_agent: TransactionAgents.company,
            to_agent: TransactionAgents.business_associate,
            users: {
                connect: {
                    id: users!.id
                }
            }
        }
    ]

    const remunerations: Prisma.RemunerationsCreateInput[] = [
        {
            description: 'janeiro/2024',
            amount_sugested: convertNumberToDecimalPrecision(10896.00).toString(),
            amount_paid: convertNumberToDecimalPrecision(10896.00).toString(),
            netAmount_sugested: convertNumberToDecimalPrecision(9566.29).toString(),
            netAmount_paid: convertNumberToDecimalPrecision(9566.29).toString(),
            date: new Date('2024-01-01').toISOString(),
            currency: Currencies.brl,
            company: {
                connect: {
                    id: 1
                }
            },
            employee: {
                connect: {
                    id: 1
                }
            }
        },
        {
            description: 'fevereiro/2024',
            amount_sugested: convertNumberToDecimalPrecision(10896.00).toString(),
            amount_paid: convertNumberToDecimalPrecision(10896.00).toString(),
            netAmount_sugested: convertNumberToDecimalPrecision(8663.75).toString(),
            netAmount_paid: convertNumberToDecimalPrecision(8663.75).toString(),
            date: new Date('2024-02-01').toISOString(),
            currency: Currencies.brl,
            company: {
                connect: {
                    id: 1
                }
            },
            employee: {
                connect: {
                    id: 1
                }
            }
        },
        {
            description: 'março/2024',
            amount_sugested: convertNumberToDecimalPrecision(10896.00).toString(),
            amount_paid: convertNumberToDecimalPrecision(10896.00).toString(),
            netAmount_sugested: convertNumberToDecimalPrecision(9047.92).toString(),
            netAmount_paid: convertNumberToDecimalPrecision(9047.92).toString(),
            date: new Date('2024-03-01').toISOString(),
            currency: Currencies.brl,
            company: {
                connect: {
                    id: 1
                }
            },
            employee: {
                connect: {
                    id: 1
                }
            }
        },
        {
            description: 'abril/2024',
            amount_sugested: convertNumberToDecimalPrecision(10896.00).toString(),
            amount_paid: convertNumberToDecimalPrecision(10896.00).toString(),
            netAmount_sugested: convertNumberToDecimalPrecision(9005.85).toString(),
            netAmount_paid: convertNumberToDecimalPrecision(9005.85).toString(),
            date: new Date('2024-04-01').toISOString(),
            currency: Currencies.brl,
            company: {
                connect: {
                    id: 1
                }
            },
            employee: {
                connect: {
                    id: 1
                }
            }
        },
        {
            description: 'maio/2024',
            amount_sugested: convertNumberToDecimalPrecision(10896.00).toString(),
            amount_paid: convertNumberToDecimalPrecision(10896.00).toString(),
            netAmount_sugested: convertNumberToDecimalPrecision(8470.97).toString(),
            netAmount_paid: convertNumberToDecimalPrecision(8470.97).toString(),
            date: new Date('2024-05-01').toISOString(),
            currency: Currencies.brl,
            company: {
                connect: {
                    id: 1
                }
            },
            employee: {
                connect: {
                    id: 1
                }
            }
        },
        {
            description: 'junho/2024',
            amount_sugested: convertNumberToDecimalPrecision(10896.00).toString(),
            amount_paid: convertNumberToDecimalPrecision(10896.00).toString(),
            netAmount_sugested: convertNumberToDecimalPrecision(8287.27).toString(),
            netAmount_paid: convertNumberToDecimalPrecision(8287.27).toString(),
            date: new Date('2024-06-01').toISOString(),
            currency: Currencies.brl,
            company: {
                connect: {
                    id: 1
                }
            },
            employee: {
                connect: {
                    id: 1
                }
            }
        },
        {
            description: 'julho/2024',
            amount_sugested: convertNumberToDecimalPrecision(9437.14).toString(),
            amount_paid: convertNumberToDecimalPrecision(9437.14).toString(),
            netAmount_sugested: convertNumberToDecimalPrecision(7700.06).toString(),
            netAmount_paid: convertNumberToDecimalPrecision(7700.06).toString(),
            date: new Date('2024-07-01').toISOString(),
            currency: Currencies.brl,
            company: {
                connect: {
                    id: 1
                }
            },
            employee: {
                connect: {
                    id: 1
                }
            }
        },
        {
            description: 'agosto/2024',
            amount_sugested: convertNumberToDecimalPrecision(11375.00).toString(),
            amount_paid: convertNumberToDecimalPrecision(11375.00).toString(),
            netAmount_sugested: convertNumberToDecimalPrecision(9450.20).toString(),
            netAmount_paid: convertNumberToDecimalPrecision(9450.20).toString(),
            date: new Date('2024-08-01').toISOString(),
            currency: Currencies.brl,
            company: {
                connect: {
                    id: 1
                }
            },
            employee: {
                connect: {
                    id: 1
                }
            }
        },
        {
            description: 'setembro/2024',
            amount_sugested: convertNumberToDecimalPrecision(11375.00).toString(),
            amount_paid: convertNumberToDecimalPrecision(11375.00).toString(),
            netAmount_sugested: convertNumberToDecimalPrecision(7509.89).toString(),
            netAmount_paid: convertNumberToDecimalPrecision(7509.89).toString(),
            date: new Date('2024-09-01').toISOString(),
            currency: Currencies.brl,
            company: {
                connect: {
                    id: 1
                }
            },
            employee: {
                connect: {
                    id: 1
                }
            }
        },
        {
            description: 'outubro/2024',
            amount_sugested: convertNumberToDecimalPrecision(11375.00).toString(),
            amount_paid: convertNumberToDecimalPrecision(11375.00).toString(),
            netAmount_sugested: convertNumberToDecimalPrecision(7512.55).toString(),
            netAmount_paid: convertNumberToDecimalPrecision(7512.55).toString(),
            date: new Date('2024-10-01').toISOString(),
            currency: Currencies.brl,
            company: {
                connect: {
                    id: 1
                }
            },
            employee: {
                connect: {
                    id: 1
                }
            }
        },
        {
            description: 'novembro/2024',
            amount_sugested: convertNumberToDecimalPrecision(11375.00).toString(),
            amount_paid: convertNumberToDecimalPrecision(11375.00).toString(),
            netAmount_sugested: convertNumberToDecimalPrecision(7164.95).toString(),
            netAmount_paid: convertNumberToDecimalPrecision(7164.95).toString(),
            date: new Date('2024-11-01').toISOString(),
            currency: Currencies.brl,
            company: {
                connect: {
                    id: 1
                }
            },
            employee: {
                connect: {
                    id: 1
                }
            }
        },
        {
            description: 'dezembro/2024',
            amount_sugested: convertNumberToDecimalPrecision(11375.00).toString(),
            amount_paid: convertNumberToDecimalPrecision(11375.00).toString(),
            netAmount_sugested: convertNumberToDecimalPrecision(9298.10).toString(),
            netAmount_paid: convertNumberToDecimalPrecision(9298.10).toString(),
            date: new Date('2024-12-01').toISOString(),
            currency: Currencies.brl,
            company: {
                connect: {
                    id: 1
                }
            },
            employee: {
                connect: {
                    id: 1
                }
            }
        }
    ]

  for (let index = 0; index < transactions.length; index++) {
    const transaction = transactions[index];
    // check if transaction already exists
    const existingTransaction = await prisma.transactions.findFirst({
      where: {
        description: transaction.description,
      },
    });

    const remuneration = remunerations[index];
    // check if remuneration already exists
    const existingRemuneration = await prisma.remunerations.findFirst({
      where: {
        description: remuneration.description,
      },
    });
    let createdTransaction: Transactions | null = null;
    if (!existingTransaction) {
        createdTransaction = await prisma.transactions.create({
        data: transaction,
      });
      console.info(` - Remuneration created: ${remuneration.description}`);
    } else {
      console.info(` - Skipping transaction (already exists): ${transaction.description}`);
    }

    if (!existingRemuneration && createdTransaction) {
      await prisma.remunerations.create({
        data: {
          ...remuneration,
          transaction: {
            connect: {
                id: createdTransaction.id,
            },
          },
        },
      });
      console.info(` - Remuneration created: ${remuneration.description}`);
    } else {
      console.info(` - Skipping remuneration (already exists): ${remuneration.description}`);
    }
  }
  console.log('\n');
}

export default { execute }