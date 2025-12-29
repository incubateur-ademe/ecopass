import { OrganizationType, UserRole } from "@prisma/enums"
import { prismaClient } from "../../src/db/prismaClient"
import { signPassword } from "../../src/services/auth/user"

const products = async () => {
  await prismaClient.score.deleteMany()
  await prismaClient.material.deleteMany()
  await prismaClient.accessory.deleteMany()
  await prismaClient.uploadProduct.deleteMany()
  await prismaClient.product.deleteMany()
  await prismaClient.upload.deleteMany()
}

const users = async () => {
  await prismaClient.brand.deleteMany({})
  await prismaClient.authorizedOrganization.deleteMany({})
  await prismaClient.organization.deleteMany({})
  await prismaClient.aPIKey.deleteMany({})
  await prismaClient.export.deleteMany({})
  await prismaClient.user.deleteMany({})

  await prismaClient.organization.create({
    data: {
      siret: "31723624800017",
      name: "EMMAUS",
      displayName: "Emmaus",
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

  await prismaClient.user.create({
    data: {
      email: "ecopass-password@yopmail.com",
      nom: "Ecopass",
      prenom: "Password",
      organization: {
        connect: { siret: "31723624800017" },
      },
      accounts: {
        create: {
          provider: "credentials",
          providerAccountId: "ecopass-password@yopmail.com",
          type: "credentials",
          password: await signPassword("ecopasscestsupercool"),
        },
      },
    },
  })

  const user = await prismaClient.user.create({
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

  await prismaClient.aPIKey.create({
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
    await prismaClient.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prismaClient.$disconnect()
    process.exit(1)
  })
