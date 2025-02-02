import { prisma } from "@/lib/prisma";
import { Companies, TributationTypes } from "@prisma/client";

export async function execute() {

  const companies: Omit<Companies, 'id' | 'created_at' | 'updated_at'>[] = [
    {
        legal_name: 'WHALE SERVICOS DIGITAIS LTDA',
        brand_name: 'WHALE DIGITAL',
        company_legal_number: "41896274000198",
        address: 'Rua Bananeiras',
        neighborhood: 'Manaíra',
        address_number: "361",
        complement: 'SALA 2023 CXPST 194',
        city: 'João Pessoa',
        state: 'PB',
        zip_code: "58038170",
        country: 'Brasil',
        tributation_type: TributationTypes.simples_nacional,
    },
  ]

  for (const company of companies) {
    const existing = await prisma.companies.findFirst({
      where: { legal_name: company.legal_name }
    });

    if (!existing) {
      await prisma.companies.create({
        data: company,
      });
      console.info(` - Company created: ${company.legal_name}`);
    } else {
      console.info(` - Company already exists: ${company.legal_name}`);
    }
  }
  console.log('\n');
}

export default { execute }