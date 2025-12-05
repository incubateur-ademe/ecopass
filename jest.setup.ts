import "dotenv/config"
import { PrismaClient } from "./prisma/src/prisma"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString:
    process.env.CI === "true"
      ? process.env.DATABASE_URL
      : "postgresql://ecopass_test:ecopass_test@localhost:5433/ecopass_test",
})
const prismaTest = new PrismaClient({ adapter })

export { prismaTest }
