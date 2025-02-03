import { prisma } from "@/lib/prisma";
import { convertNumberToDecimalPrecision } from "@/utils/decimalUtils";
import { Currencies, Prisma, TransactionAgents, Transactions, TransactionTypes } from "@prisma/client";

export async function execute() {

  const users = await prisma.users.findFirst({where: {
    email: 'hey@danilloestrela.com'
  }})

  const transactions = [
    {
      transaction_type: TransactionTypes.revenue,
      description: 'revenue -janeiro/2024',
      from_agent: TransactionAgents.external_platform,
      to_agent: TransactionAgents.company,
      users: {
        connect: {
          id: users!.id
        }
      },
      date: new Date('2024-01-01').toISOString(),
      created_at: new Date('2024-01-01').toISOString(),
      updated_at: new Date('2024-01-01').toISOString(),
    },
    {
      transaction_type: TransactionTypes.revenue,
      description: 'revenue - fevereiro/2024',
      from_agent: TransactionAgents.external_platform,
      to_agent: TransactionAgents.company,
      users: {
        connect: {
          id: users!.id
        }
      },
      date: new Date('2024-02-01').toISOString(),
      created_at: new Date('2024-02-01').toISOString(),
      updated_at: new Date('2024-02-01').toISOString(),
    },
    {
      transaction_type: TransactionTypes.revenue,
      description: 'revenue - março/2024',
      from_agent: TransactionAgents.external_platform,
      to_agent: TransactionAgents.company,
      users: {
        connect: {
          id: users!.id
        }
      },
      date: new Date('2024-03-01').toISOString(),
      created_at: new Date('2024-03-01').toISOString(),
      updated_at: new Date('2024-03-01').toISOString(),
    },
    {
      transaction_type: TransactionTypes.revenue,
      description: 'revenue - abril/2024',
      from_agent: TransactionAgents.external_platform,
      to_agent: TransactionAgents.company,
      users: {
        connect: {
          id: users!.id
        }
      },
      date: new Date('2024-04-01').toISOString(),
      created_at: new Date('2024-04-01').toISOString(),
      updated_at: new Date('2024-04-01').toISOString(),
    },
    {
      transaction_type: TransactionTypes.revenue,
      description: 'revenue - maio/2024',
      from_agent: TransactionAgents.external_platform,
      to_agent: TransactionAgents.company,
      users: {
        connect: {
          id: users!.id
        }
      },
      date: new Date('2024-05-01').toISOString(),
      created_at: new Date('2024-05-01').toISOString(),
      updated_at: new Date('2024-05-01').toISOString(),
    },
    {
      transaction_type: TransactionTypes.revenue,
      description: 'revenue - junho/2024',
      from_agent: TransactionAgents.external_platform,
      to_agent: TransactionAgents.company,
      users: {
        connect: {
          id: users!.id
        }
      },
      date: new Date('2024-06-01').toISOString(),
      created_at: new Date('2024-06-01').toISOString(),
      updated_at: new Date('2024-06-01').toISOString(),
    },
    {
      transaction_type: TransactionTypes.revenue,
      description: 'revenue - julho/2024',
      from_agent: TransactionAgents.external_platform,
      to_agent: TransactionAgents.company,
      users: {
        connect: {
          id: users!.id
        }
      },
      date: new Date('2024-07-01').toISOString(),
      created_at: new Date('2024-07-01').toISOString(),
      updated_at: new Date('2024-07-01').toISOString(),
    },
    {
      transaction_type: TransactionTypes.revenue,
      description: 'revenue - agosto/2024',
      from_agent: TransactionAgents.external_platform,
      to_agent: TransactionAgents.company,
      users: {
        connect: {
          id: users!.id
        }
      },
      date: new Date('2024-08-01').toISOString(),
      created_at: new Date('2024-08-01').toISOString(),
      updated_at: new Date('2024-08-01').toISOString(),
    },
    {
      transaction_type: TransactionTypes.revenue,
      description: 'revenue - setembro/2024',
      from_agent: TransactionAgents.external_platform,
      to_agent: TransactionAgents.company,
      users: {
        connect: {
          id: users!.id
        }
      },
      date: new Date('2024-09-01').toISOString(),
      created_at: new Date('2024-09-01').toISOString(),
      updated_at: new Date('2024-09-01').toISOString(),
    },
    {
      transaction_type: TransactionTypes.revenue,
      description: 'revenue - outubro/2024',
      from_agent: TransactionAgents.external_platform,
      to_agent: TransactionAgents.company,
      users: {
        connect: {
          id: users!.id
        }
      },
      date: new Date('2024-11-01').toISOString(),
      created_at: new Date('2024-11-01').toISOString(),
      updated_at: new Date('2024-11-01').toISOString(),
    },
    {
      transaction_type: TransactionTypes.revenue,
      description: 'revenue - novembro/2024',
      from_agent: TransactionAgents.external_platform,
      to_agent: TransactionAgents.company,
      users: {
        connect: {
          id: users!.id
        }
      },
      date: new Date('2024-11-01').toISOString(),
      created_at: new Date('2024-11-01').toISOString(),
      updated_at: new Date('2024-11-01').toISOString(),
    },
    {
      transaction_type: TransactionTypes.revenue,
      description: 'revenue - dezembro/2024',
      from_agent: TransactionAgents.external_platform,
      to_agent: TransactionAgents.company,
      users: {
        connect: {
          id: users!.id
        }
      },
      date: new Date('2024-12-01').toISOString(),
      created_at: new Date('2024-12-01').toISOString(),
      updated_at: new Date('2024-12-01').toISOString(),
    }
  ]

  const revenues: Prisma.RevenuesCreateInput[] = [
    {
      total_amount: convertNumberToDecimalPrecision(22452.80).toString(),
      total_fee_amount: convertNumberToDecimalPrecision(0).toString(),
      total_taxes_amount: convertNumberToDecimalPrecision(688.52).toString(),
      received_date: new Date('2024-01-01').toISOString(),
      description: 'revenue - janeiro/2024',
      currency: Currencies.brl,
      sources: {
        connect: {
          id: 5
        }
      },
      company: {
        connect: { id: 1 }
      },
      transaction: {
        connect: { id: 1 }
      }
    },
    {
      total_amount: convertNumberToDecimalPrecision(32418.64).toString(),
      total_fee_amount: convertNumberToDecimalPrecision(0).toString(),
      total_taxes_amount: convertNumberToDecimalPrecision(1028.82).toString(),
      received_date: new Date('2024-02-01').toISOString(),
      description: 'revenue - fevereiro/2024',
      currency: Currencies.brl,
      sources: {
        connect: {
          id: 5
        }
      },
      company: {
        connect: { id: 1 }
      },
      transaction: {
        connect: { id: 2 }
      }
    },
    {
      total_amount: convertNumberToDecimalPrecision(28897.80).toString(),
      total_fee_amount: convertNumberToDecimalPrecision(0).toString(),
      total_taxes_amount: convertNumberToDecimalPrecision(975.48).toString(),
      received_date: new Date('2024-03-01').toISOString(),
      description: 'revenue - março/2024',
      currency: Currencies.brl,
      sources: {
        connect: {
          id: 5
        }
      },
      company: {
        connect: { id: 1 }
      },
      transaction: {
        connect: { id: 3 }
      }
    },
    {
      total_amount: convertNumberToDecimalPrecision(29590.30).toString(),
      total_fee_amount: convertNumberToDecimalPrecision(0).toString(),
      total_taxes_amount: convertNumberToDecimalPrecision(999.93).toString(),
      received_date: new Date('2024-04-01').toISOString(),
      description: 'revenue - abril/2024',
      currency: Currencies.brl,
      sources: {
        connect: {
          id: 5
        }
      },
      company: {
        connect: { id: 1 }
      },
      transaction: {
        connect: { id: 4 }
      }
    },
    {
      total_amount: convertNumberToDecimalPrecision(30628.48).toString(),
      total_fee_amount: convertNumberToDecimalPrecision(0).toString(),
      total_taxes_amount: convertNumberToDecimalPrecision(1295.10).toString(),
      received_date: new Date('2024-05-01').toISOString(),
      description: 'revenue - maio/2024',
      currency: Currencies.brl,
      sources: {
        connect: {
          id: 5
        }
      },
      company: {
        connect: { id: 1 }
      },
      transaction: {
        connect: { id: 5 }
      }
    },
    {
      total_amount: convertNumberToDecimalPrecision(38718.05).toString(),
      total_fee_amount: convertNumberToDecimalPrecision(0).toString(),
      total_taxes_amount: convertNumberToDecimalPrecision(1452.55).toString(),
      received_date: new Date('2024-06-01').toISOString(),
      description: 'revenue - junho/2024',
      currency: Currencies.brl,
      sources: {
        connect: {
          id: 5
        }
      },
      company: {
        connect: { id: 1 }
      },
      transaction: {
        connect: { id: 6 }
      }
    },
    {
      total_amount: convertNumberToDecimalPrecision(11318.81).toString(),
      total_fee_amount: convertNumberToDecimalPrecision(0).toString(),
      total_taxes_amount: convertNumberToDecimalPrecision(353.68).toString(),
      received_date: new Date('2024-07-01').toISOString(),
      description: 'revenue - julho/2024',
      currency: Currencies.brl,
      sources: {
        connect: {
          id: 5
        }
      },
      company: {
        connect: { id: 1 }
      },
      transaction: {
        connect: { id: 7 }
      }
    },
    {
      total_amount: convertNumberToDecimalPrecision(50665.52).toString(),
      total_fee_amount: convertNumberToDecimalPrecision(0).toString(),
      total_taxes_amount: convertNumberToDecimalPrecision(1763.85).toString(),
      received_date: new Date('2024-08-01').toISOString(),
      description: 'revenue - agosto/2024',
      currency: Currencies.brl,
      sources: {
        connect: {
          id: 5
        }
      },
      company: {
        connect: { id: 1 }
      },
      transaction: {
        connect: { id: 8 }
      }
    },
    {
      total_amount: convertNumberToDecimalPrecision(55685.46).toString(),
      total_fee_amount: convertNumberToDecimalPrecision(0).toString(),
      total_taxes_amount: convertNumberToDecimalPrecision(2249.47).toString(),
      received_date: new Date('2024-09-01').toISOString(),
      description: 'revenue - setembro/2024',
      currency: Currencies.brl,
      sources: {
        connect: {
          id: 5
        }
      },
      company: {
        connect: { id: 1 }
      },
      transaction: {
        connect: { id: 9 }
      }
    },
    {
      total_amount: convertNumberToDecimalPrecision(55498.17).toString(),
      total_fee_amount: convertNumberToDecimalPrecision(0).toString(),
      total_taxes_amount: convertNumberToDecimalPrecision(2867.70).toString(),
      received_date: new Date('2024-10-01').toISOString(),
      description: 'revenue - outubro/2024 - Esta guia DAS está sem fator R, então está no anexo V. Devido ao ajuste que fizemos para enquadramento retroativo esta guia gerou saldo positivo para sua empresa compensar nos impostos futuros de DAS.',
      currency: Currencies.brl,
      sources: {
        connect: {
          id: 5
        }
      },
      company: {
        connect: { id: 1 }
      },
      transaction: {
        connect: { id: 10 }
      }
    },
    {
      total_amount: convertNumberToDecimalPrecision(90516.50).toString(),
      total_fee_amount: convertNumberToDecimalPrecision(0).toString(),
      total_taxes_amount: convertNumberToDecimalPrecision(0).toString(),
      received_date: new Date('2024-11-01').toISOString(),
      description: 'revenue - novembro/2024 - Esta guia DAS está sem fator R, então está no anexo V. Devido ao ajuste que fizemos para enquadramento retroativo esta guia gerou saldo positivo para sua empresa compensar nos impostos futuros de DAS.',
      currency: Currencies.brl,
      sources: {
        connect: {
          id: 5
        }
      },
      company: {
        connect: { id: 1 }
      },
      transaction: {
        connect: { id: 11 }
      }
    },
    {
      total_amount: convertNumberToDecimalPrecision(40386.18).toString(),
      total_fee_amount: convertNumberToDecimalPrecision(0).toString(),
      total_taxes_amount: convertNumberToDecimalPrecision(1906.98).toString(),
      received_date: new Date('2024-12-01').toISOString(),
      description: 'revenue - dezembro/2024 - Aqui não houve desconto de INSS, pois já recolhe no vínculo CLT no teto. / No DAS houve uma compensação de impostos que reduziu o valor da guia paga, porém a guia calculada era o valor informado na coluna.',
      currency: Currencies.brl,
      sources: {
        connect: {
          id: 5
        }
      },
      company: {
        connect: { id: 1 }
      },
      transaction: {
        connect: { id: 12 }
      }
    }
  ];

  for (let index = 0; index < transactions.length; index++) {
    const transaction = transactions[index];
    // check if transaction already exists
    const existingTransaction = await prisma.transactions.findFirst({
      where: {
        description: transaction.description,
      },
    });

    const revenue = revenues[index];
    // check if revenue already exists
    const existingRevenue = await prisma.revenues.findFirst({
      where: {
        description: revenue.description,
      },
    });

    let createdTransaction: Transactions | null = null;
    if (!existingTransaction) {
      createdTransaction = await prisma.transactions.create({
        data: transaction,
      });
      console.info(` - Revenue for transaction created: ${transaction.description}`);
    } else {
      console.info(` - Skipping revenue for transaction (already exists): ${transaction.description}`);
    }

    if (!existingRevenue && createdTransaction) {
      await prisma.revenues.create({
        data: {
          ...revenue,
          transaction: {
            connect: {
              id: createdTransaction.id,
            },
          },
        },
      });
      console.info(` - Revenue created: ${revenue.description}`);
    } else {
      console.info(` - Skipping revenue (already exists or transaction not found): ${revenue.description}`);
    }
  }
  console.log('\n');
}

export default { execute }