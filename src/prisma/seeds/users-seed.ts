import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/utils/passwordUtils"
import { Roles } from "@prisma/client"

export async function execute() {

  const adminData = {
    email: 'hey@danilloestrela.com',
    name: 'Master Admin',
    password: await hashPassword('mudeEssaSenha2025'),
    role: Roles.admin,
  }

  const master_admin = await prisma.users.upsert({
    where: { email: adminData.email },
    update: adminData,
    create: adminData,
  })
  console.info(` - Master Admin ${master_admin.created_at === master_admin.updated_at ? 'created' : 'updated'}: ${master_admin.email}`)
  console.log('\n');
}

export default { execute }