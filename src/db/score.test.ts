import { v4 as uuid } from "uuid"
import { ConfidenceLevel, Prisma, UserType } from "@prisma/client"
import { Status, UploadType } from "@prisma/enums"
import { prismaTest as mockPrismaTest } from "../../jest.setup"
jest.mock("./prismaClient", () => ({
  prismaClient: mockPrismaTest,
}))

import { createScore } from "./score"
import { AccessoryType, Business, MaterialType, ProductCategory } from "../types/Product"
import { cleanDB } from "./testUtils"
import { FullUser } from "./user"

describe("Score DB integration", () => {
  let user: FullUser
  let testOrganizationId: string
  let baseProduct: Prisma.ProductCreateInput

  beforeAll(async () => {
    await cleanDB()

    const organization = await mockPrismaTest.organization.create({
      data: {
        name: "TestOrg",
        displayName: "TestOrg",
        siret: "12345678901234",
        brands: {
          createMany: {
            data: [
              { name: "TestOrg", id: "69147ca8-09c6-4ae6-b731-d5344f080491", default: true },
              { name: "TestBrand", id: "abf5acc4-fabc-4082-b49a-61b00b5cfcad" },
            ],
          },
        },
      },
    })
    testOrganizationId = organization.id
    user = await mockPrismaTest.user.create({
      data: { email: "test@example.com", organizationId: testOrganizationId, type: UserType.PROFESSIONNEL },
      select: {
        id: true,
        email: true,
        type: true,
        organizationRole: true,
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
            authorizedBy: {
              select: {
                from: { select: { id: true, name: true, siret: true, brands: { select: { id: true, name: true } } } },
              },
            },
            brands: { select: { name: true } },
          },
        },
      },
    })

    const upload = await mockPrismaTest.upload.create({
      data: {
        version: "test-version",
        type: "API",
        name: "test.csv",
        createdById: user.id,
        organizationId: testOrganizationId,
        createdAt: new Date(),
      },
    })

    baseProduct = {
      id: uuid(),
      hash: "test-hash",
      gtins: ["3234567891000"],
      internalReference: "REF-124",
      brand: { connect: { id: "abf5acc4-fabc-4082-b49a-61b00b5cfcad" } },
      declaredScore: 3000.5,
      upload: { connect: { id: upload.id } },
      status: Status.Done,
      confidenceLevel: ConfidenceLevel.High,
      informations: {
        create: {
          id: "info-1",
          category: "pull",
          business: "business",
          mass: "0.5",
          numberOfReferences: "1000",
          price: "50",
          countryDyeing: "France",
          countryFabric: "France",
          countryMaking: "France",
          countrySpinning: "France",
          airTransportRatio: "0.1",
          upcycled: "false",
          impression: "none",
          impressionPercentage: "0.0",
          fading: "true",
        },
      },
    }
  })

  afterAll(async () => {
    await cleanDB()
  })

  beforeEach(async () => {
    await mockPrismaTest.score.deleteMany()
    await mockPrismaTest.accessory.deleteMany()
    await mockPrismaTest.material.deleteMany()
    await mockPrismaTest.product.deleteMany()
  })

  it("createScore should create a score and product with upload", async () => {
    const score = {
      score: 85.5,
      standardized: 8.5,
      acd: 2.73,
      cch: 1589.45,
      etf: 20654.8,
      fru: 4289.7,
      fwe: 0.106,
      htc: 0.00000114,
      htn: 0.0000849,
      ior: 167.8,
      ldu: 51743.2,
      mru: 0.00423,
      ozd: 0.00268,
      pco: 1.548,
      pma: 0.0000423,
      swe: 0.459,
      tre: 5.207,
      wtu: 763.4,
      durability: 0.67,
      microfibers: 12.3,
      outOfEuropeEOL: 1.2,
      materials: 120,
      transport: 25,
      spinning: 8,
      fabric: 4,
      dyeing: 2,
      making: 0.5,
      usage: 0.3,
      endOfLife: 0.1,
      trims: 0.00012,
    }

    const product = {
      gtins: ["2234567891001"],
      internalReference: "REF-123",
      brandId: "abf5acc4-fabc-4082-b49a-61b00b5cfcad",
    }

    const informations = {
      product: ProductCategory.Pull,
      declaredScore: 2222.63,
      business: Business.Small,
      numberOfReferences: 9000,
      countryDyeing: "FR",
      countryFabric: "FR",
      countryMaking: "FR",
      mass: 1,
      price: 100,
      materials: [{ id: MaterialType.Viscose, share: 0.9 }],
      trims: [{ id: AccessoryType.BoutonEnMétal, quantity: 1 }],
    }
    await createScore(user, product, [informations], [score], "test-hash", UploadType.API, ConfidenceLevel.High)

    const createdScore = await mockPrismaTest.score.findFirst({
      where: { score: 85.5 },
      include: { product: { include: { product: { include: { upload: true } } } } },
    })
    expect(createdScore).toBeDefined()
    expect(createdScore?.product).toBeDefined()
    expect(createdScore?.product?.product?.upload).toBeDefined()
    expect(createdScore?.product?.product?.upload.type).toBe(UploadType.API)
    expect(createdScore?.product?.product?.status).toBe(Status.Done)
    expect(createdScore?.product?.product?.internalReference).toBe("REF-123")
  })
})
