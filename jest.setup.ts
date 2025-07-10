import "dotenv/config"
import { PrismaClient } from "./prisma/src/prisma"

const prismaTest = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.CI === "true"
          ? process.env.DATABASE_URL
          : "postgresql://ecopass_test:ecopass_test@localhost:5433/ecopass_test",
    },
  },
})

export { prismaTest }
