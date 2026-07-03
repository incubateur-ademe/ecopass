import { config } from "dotenv"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "./prisma/generated/prisma/client"

// Suppress dotenv console logs
const originalLog = console.log
console.log = () => {}
config()
console.log = originalLog

const adapter = new PrismaPg({
  connectionString:
    process.env.CI === "true"
      ? process.env.DATABASE_URL
      : "postgresql://ecopass_test:ecopass_test@localhost:5433/ecopass_test",
})

const prismaTest = new PrismaClient({
  adapter,
})

export { prismaTest }
