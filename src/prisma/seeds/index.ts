import { prisma } from "@/lib/prisma"
import CompaniesSeed from "./companies-seed"
import EmployeesSeed from "./employees-seed"
import PlatformsSeed from "./platforms-seed"
import RemunerationsSeed from "./remunerations-seed"
import RevenuesSeed from "./revenues-seed"
import SourcesSeed from "./sources-seed"
import UsersSeed from "./users-seed"

async function executeSeed(name: string, seed: { execute: () => Promise<void> }) {
  console.info(` ------------------------`)
  console.info(` :: Seeding ${name}`)
  await seed.execute()
  console.info(` :: ${name} seed finished `)
  console.info(` ------------------------ \n`)
}

async function main() {
  try {
    await executeSeed('Users', UsersSeed)
    await executeSeed('Sources', SourcesSeed)
    await executeSeed('Platforms', PlatformsSeed)
    await executeSeed('Companies', CompaniesSeed)
    await executeSeed('Employees', EmployeesSeed)
    await executeSeed('Revenues', RevenuesSeed)
    await executeSeed('Remunerations', RemunerationsSeed)
  } catch (error) {
    console.error(error)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
