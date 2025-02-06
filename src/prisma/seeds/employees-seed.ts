import { prisma } from "@/lib/prisma";
import { EmployeeType, Prisma } from "@prisma/client";

export async function execute() {

  const employees: Prisma.EmployeesCreateInput[] = [
    {
        name: 'Danillo Francisco da Silva Araújo Estrela Gadelha Maia',
        type: EmployeeType.business_associate,
        company: {
            connect: {
                id: 1
            }
        }
    },
  ]

  for (const employee of employees) {
    const existing = await prisma.employees.findFirst({
      where: { name: employee.name }
    });

    if (!existing) {
      await prisma.employees.create({
        data: employee,
      });
      console.info(` - Employee created: ${employee.name}`);
    } else {
      console.info(` - Employee already exists: ${employee.name}`);
    }
  }
  console.log('\n');
}

export default { execute }