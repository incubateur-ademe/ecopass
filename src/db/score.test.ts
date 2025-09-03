import { v4 as uuid } from "uuid"
import { Prisma, Status, UploadType } from "../../prisma/src/prisma"
import { prismaTest } from "../../jest.setup"
jest.mock("./prismaClient", () => ({
  prismaClient: prismaTest,
}))

import { createScore, createScores } from "./score"
import { APIUser } from "../services/auth/auth"
import { AccessoryType, Business, MaterialType, ProductCategory } from "../types/Product"
import { cleanDB } from "./testUtils"

describe("Score DB integration", () => {
  let user: NonNullable<APIUser>["user"]
  let testOrganizationId: string
  let baseProduct: Prisma.ProductCreateManyInput

  beforeAll(async () => {
    await cleanDB()

    const organization = await prismaTest.organization.create({
      data: { name: "TestOrg", siret: "12345678901234" },
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
      gtins: ["1234567891001"],
      internalReference: "REF-124",
      brand: "TestBrand2",
      category: "pull",
      declaredScore: 3000.5,
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
      uploadId: upload.id,
      status: Status.Done,
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
      },
    ]

    await prismaTest.product.createMany({
      data: [
        { ...baseProduct, id: id1 },
        { ...baseProduct, id: id2 },
      ],
    })

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
    }
    const product = {
      gtins: ["1234567891000"],
      internalReference: "REF-123",
      brand: "TestBrand",
      product: ProductCategory.Pull,
      declaredScore: 2222.63,
      business: Business.Small,
      numberOfReferences: 9000,
      mass: 1,
      price: 100,
      materials: [{ id: MaterialType.Viscose, share: 0.9 }],
      trims: [{ id: AccessoryType.BoutonEnMétal, quantity: 1 }],
    }
    const result = await createScore(user, product, score, "test-hash")
    expect(result).toBeDefined()

    const createdScore = await prismaTest.score.findFirst({
      where: { score: 85.5 },
      include: { product: { include: { upload: true } } },
    })
    expect(createdScore).toBeDefined()
    expect(createdScore?.product).toBeDefined()
    expect(createdScore?.product.upload).toBeDefined()
    expect(createdScore?.product.upload.type).toBe(UploadType.API)
    expect(createdScore?.product.status).toBe(Status.Done)
    expect(createdScore?.product.internalReference).toBe("REF-123")
  })
})
