import { v4 as uuid } from "uuid"
import { Prisma } from "@prisma/client"
import { Status, UploadType } from "@prisma/enums"
import { prismaTest } from "../../jest.setup"
jest.mock("./prismaClient", () => ({
  prismaClient: prismaTest,
}))

import { createScore, createScores } from "./score"
import { APIUser } from "../services/auth/auth"
import { AccessoryType, Business, MaterialType, ProductCategory } from "../types/Product"
import { cleanDB } from "./testUtils"
import { trim } from "zod"

describe("Score DB integration", () => {
  let user: NonNullable<APIUser>["user"]
  let testOrganizationId: string
  let baseProduct: Prisma.ProductCreateInput

  beforeAll(async () => {
    await cleanDB()

    const organization = await prismaTest.organization.create({
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
    user = await prismaTest.user.create({
      data: { email: "test@example.com", organizationId: testOrganizationId },
      select: {
        id: true,
        email: true,
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

    const upload = await prismaTest.upload.create({
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
    await prismaTest.score.deleteMany()
    await prismaTest.accessory.deleteMany()
    await prismaTest.material.deleteMany()
    await prismaTest.product.deleteMany()
  })

  it("createScores should insert multiple scores", async () => {
    const id1 = uuid()
    const id2 = uuid()
    const scores = [
      {
        productId: id1,
        score: 100,
        standardized: 10,
        acd: 1.25,
        cch: 742.3,
        etf: 9876.4,
        fru: 2134.8,
        fwe: 0.052,
        htc: 0.00000067,
        htn: 0.0000423,
        ior: 89.2,
        ldu: 28954.7,
        mru: 0.00198,
        ozd: 0.00142,
        pco: 0.784,
        pma: 0.0000234,
        swe: 0.247,
        tre: 2.892,
        wtu: 398.6,
        durability: 0.82,
        microfibers: 8.7,
        outOfEuropeEOL: 0.6,
        materials: 120,
        transport: 25,
        spinning: 8,
        fabric: 4,
        dyeing: 2,
        making: 0.5,
        usage: 0.3,
        endOfLife: 0.1,
        trims: 0.00012,
      },
      {
        productId: id2,
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
        materials: 150,
        transport: 30,
        spinning: 10,
        fabric: 5,
        dyeing: 3,
        making: 1,
        usage: 0.5,
        endOfLife: 0.2,
        trims: 0.00034,
      },
    ]

    await Promise.all([
      prismaTest.product.create({
        data: {
          ...baseProduct,
          id: "id-1",
          informations: {
            create: {
              ...(baseProduct.informations?.create as Prisma.ProductInformationCreateWithoutProductInput),
              id: id1,
            },
          },
        },
      }),
      prismaTest.product.create({
        data: {
          ...baseProduct,
          id: "id-2",
          informations: {
            create: {
              ...(baseProduct.informations?.create as Prisma.ProductInformationCreateWithoutProductInput),
              id: id2,
            },
          },
        },
      }),
    ])

    const result = await createScores(scores)

    expect(result.count).toBe(2)
    const found = await prismaTest.score.findMany()
    expect(found).toHaveLength(2)

    const score1 = found.find((score) => score.productId === id1)
    expect(score1?.score).toBe(100)
    expect(score1?.standardized).toBe(10)
    expect(score1?.acd).toBe(1.25)
    expect(score1?.cch).toBe(742.3)
    expect(score1?.durability).toBe(0.82)

    const score2 = found.find((score) => score.productId === id2)
    expect(score2?.score).toBe(200)
    expect(score2?.standardized).toBe(20)
    expect(score2?.acd).toBe(3.47)
    expect(score2?.cch).toBe(1834.6)
    expect(score2?.durability).toBe(0.45)
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
    await createScore(user, product, [informations], [score], "test-hash")

    const createdScore = await prismaTest.score.findFirst({
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
