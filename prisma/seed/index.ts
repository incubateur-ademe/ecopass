import { signPassword } from "../../src/services/auth/user"
import { PrismaClient } from "../src/prisma"
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient()

const products = async () => {
  await prisma.score.deleteMany()
  await prisma.product.deleteMany()
  await prisma.upload.deleteMany()
  await prisma.version.deleteMany()

  await prisma.version.create({
    data: {
      version: "5.0.1",
      link: "https://ecobalyse.beta.gouv.fr/versions/v5.0.1/api",
    },
  })
}

const users = async () => {
  await prisma.brand.deleteMany({})
  await prisma.aPIKey.deleteMany({})
  await prisma.user.deleteMany({})

  const brands = await prisma.brand.createManyAndReturn({
    data: Array.from({ length: 5 }).map(() => ({
      name: faker.company.name(),
      siret: faker.string.numeric(14),
    })),
  })

  const password = await signPassword("password")
  const aalAccounts = await Promise.all(
    brands.flatMap((brand, i) =>
      Array.from({ length: 5 }).map((_, j) =>
        prisma.account.create({
          data: {
            provider: "credentials",
            providerAccountId: `user-${i}-${j}@test.fr`,
            password: password,
            type: "credentials",
            user: {
              create: {
                email: `user-${i}-${j}@test.fr`,
                brandId: brand.id,
              },
            },
          },
        }),
      ),
    ),
  )

  await prisma.aPIKey.createMany({
    data: aalAccounts.flatMap((account) =>
      Array.from({ length: faker.number.int({ min: 0, max: 3 }) }).map(() => ({
        userId: account.userId,
        name: faker.lorem.words(faker.number.int({ min: 1, max: 3 })),
      })),
    ),
  })
}

const seeds = async () => {
  await products()
  await users()
}

seeds()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
