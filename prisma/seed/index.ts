import { PrismaClient } from "../src/prisma"

const prisma = new PrismaClient()

const products = async () => {
  await prisma.score.deleteMany()
  await prisma.material.deleteMany()
  await prisma.accessory.deleteMany()
  await prisma.product.deleteMany()
  await prisma.upload.deleteMany()
}

const users = async () => {
  await prisma.brand.deleteMany({})
  await prisma.authorizedOrganization.deleteMany({})
  await prisma.organization.deleteMany({})
  await prisma.aPIKey.deleteMany({})
  await prisma.export.deleteMany({})
  await prisma.user.deleteMany({})

  await prisma.organization.create({
    data: {
      siret: "31723624800017",
      name: "Emmaus",
      brands: {
        createMany: {
          data: [{ name: "Emmaus Solidarité" }, { name: "Emmaus Connect" }],
        },
      },
    },
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
