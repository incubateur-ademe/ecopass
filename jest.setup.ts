import { config } from "dotenv"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "./prisma/generated/prisma/client"
import { Pool } from "pg"

// Suppress dotenv console logs
const originalLog = console.log
console.log = () => {}
config()
console.log = originalLog

const pool = new Pool({
  connectionString:
    process.env.CI === "true"
      ? process.env.DATABASE_URL
      : "postgresql://ecopass_test:ecopass_test@localhost:5433/ecopass_test",
})
const adapter = new PrismaPg(pool)

const prismaTest = new PrismaClient({
  adapter,
})

export { prismaTest, pool }
