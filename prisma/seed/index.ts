import { OrganizationType, PrismaClient, UserRole } from "../src/prisma"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const products = async () => {
  await prisma.score.deleteMany()
  await prisma.material.deleteMany()
  await prisma.accessory.deleteMany()
  await prisma.uploadProduct.deleteMany()
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
      effectif: "41",
      naf: "87.90B",
      type: OrganizationType.Brand,
      brands: {
        createMany: {
          data: [
            { name: "Emmaus Solidarité", id: "26ed7820-ebca-4235-b1d3-dbeab02b1768" },
            { name: "Emmaus Connect", id: "175570b3-59e4-40b4-89be-08a185685f78" },
            { name: "Emmaus", default: true, id: "6abd8a2b-8fee-4c54-8d23-17e1f8c27b56" },
          ],
        },
      },
    },
  })
  const user = await prisma.user.create({
    data: {
      email: "ecopass-admin-dev@yopmail.com",
      role: UserRole.ADMIN,
      nom: "Ecopass",
      prenom: "Admin",
      organization: {
        connect: { siret: "31723624800017" },
      },
    },
  })

  await prisma.aPIKey.create({
    data: {
      key: "ce4a461a-ae00-49a9-8fbc-d342dc635da6",
      userId: user.id,
      name: "API Key for development",
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
