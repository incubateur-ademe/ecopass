import { PrismaClient } from "../../prisma/src/prisma"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

export const prismaClient =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient
}
