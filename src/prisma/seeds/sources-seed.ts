import { prisma } from "@/lib/prisma";

export async function execute() {

  const sources = [
    {
        name: 'Iterate',
    },
    {
        name: 'Galactic Federation',
    },
    {
        name: 'Letterhead',
    },
    {
        name: 'Workana',
    },
    {
        name: 'Don\'t remember',
    }
  ]

  for (const source of sources) {
    const existing = await prisma.sources.findFirst({
      where: { name: source.name }
    });

    if (!existing) {
      await prisma.sources.create({
        data: source,
      });
      console.info(` - Source created: ${source.name}`);
    } else {
      console.info(` - Source already exists: ${source.name}`);
    }
  }
  console.log('\n');
}

export default { execute }