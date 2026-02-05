import { OrganizationType, Status, UploadType, UserRole } from "@prisma/enums"
import { prismaClient } from "../../src/db/prismaClient"
import { signPassword } from "../../src/services/auth/user"
import { encryptProductFields } from "../../src/utils/encryption/encryption"
import { Business, Country, Impression, ProductCategory } from "../../src/types/Product"

const clean = async () => {
  await prismaClient.score.deleteMany()
  await prismaClient.material.deleteMany()
  await prismaClient.accessory.deleteMany()
  await prismaClient.uploadProduct.deleteMany()
  await prismaClient.product.deleteMany()
  await prismaClient.upload.deleteMany()
  await prismaClient.brand.deleteMany({})
  await prismaClient.authorizedOrganization.deleteMany({})
  await prismaClient.organization.deleteMany({})
  await prismaClient.aPIKey.deleteMany({})
  await prismaClient.export.deleteMany({})
  await prismaClient.user.deleteMany({})
}

const users = async () => {
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

const defaultProduct = async () => {
  const org = await prismaClient.organization.create({
    data: {
      name: "Textile Premium",
      displayName: "Textile Premium",
      type: OrganizationType.Consultancy,
      uniqueId: "350b9fc6-0d05-496b-b429-cc66064e98e8",
      brands: {
        createMany: {
          data: [{ name: "Premium Wear", id: "a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d", default: true }],
        },
      },
    },
  })

  const user = await prismaClient.user.create({
    data: {
      email: "textile@yopmail.com",
      nom: "Textile",
      prenom: "Admin",
      organization: {
        connect: { id: org.id },
      },
      accounts: {
        create: {
          provider: "credentials",
          providerAccountId: "textile@yopmail.com",
          type: "credentials",
          password: await signPassword("textilepassword"),
        },
      },
    },
  })

  const { product, materials, accessories } = encryptProductFields({
    product: ProductCategory.MaillotDeBain,
    airTransportRatio: 0,
    business: Business.Small,
    fading: true,
    mass: 150,
    numberOfReferences: 1,
    price: 45,
    countryDyeing: Country.France,
    countryFabric: Country.Chine,
    countryMaking: Country.Cambodge,
    countrySpinning: Country.Myanmar,
    printing: {
      kind: Impression.FixéLavé,
      ratio: 0.2,
    },
    upcycled: false,
    materials: [
      {
        id: "polyester",
        country: Country.France,
        share: 0.85,
      },
      {
        id: "elastane",
        country: Country.Maroc,
        share: 0.15,
      },
    ],
  })
  await prismaClient.product.create({
    data: {
      hash: "default-product-hash",
      gtins: ["0000000000000"],
      internalReference: "MAILLOT-001",
      brandName: "Premium Wear",
      brand: {
        connect: { id: "a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d" },
      },
      status: Status.Done,
      upload: {
        create: {
          type: UploadType.API,
          organization: { connect: { id: org.id } },
          createdBy: { connect: { id: user.id } },
          version: "7.0.0",
          status: Status.Done,
        },
      },
      informations: {
        create: {
          ...product,
          materials: { create: materials },
          accessories: { create: accessories },
          score: {
            create: {
              score: 200,
              standardized: 20,
              acd: 3.47,
              cch: 1834.6,
              etf: 24567.1,
              fru: 5892.3,
              fwe: 0.187,
              htc: 0.00000189,
              htn: 0.0000967,
              ior: 203.4,
              ldu: 67432.9,
              mru: 0.00567,
              ozd: 0.00389,
              pco: 2.156,
              pma: 0.0000678,
              swe: 0.634,
              tre: 7.823,
              wtu: 982.4,
              durability: 0.45,
              microfibers: 18.2,
              outOfEuropeEOL: 2.1,
            },
          },
        },
      },
      score: 200,
      standardized: 20,
    },
  })
}

const seeds = async () => {
  await clean()
  await users()
  await defaultProduct()
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
