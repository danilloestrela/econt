import { prisma } from "@/lib/prisma";

export async function execute() {

  const platforms = [
    {
        name: 'Payoneer',
    },
    {
        name: 'Deel',
    },
    {
        name: 'Binance',
    },
    {
        name: 'Nomad',
    },
    {
        name: 'Wise',
    },
    {
        name: 'Paypal',
    },
    {
        name: 'Remessa Online',
    },
    {
        name: 'Transferwise',
    },
    {
        name: 'Mercado Pago',
    }
  ]

  for (const platform of platforms) {
    const existing = await prisma.platforms.findFirst({
      where: { name: platform.name }
    });

    if (!existing) {
      await prisma.platforms.create({
        data: platform,
      });
      console.info(` - Platform created: ${platform.name}`);
    } else {
      console.info(` - Platform already exists: ${platform.name}`);
    }
  }
  console.log('\n');
}

export default { execute }