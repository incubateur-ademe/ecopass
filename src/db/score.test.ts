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

    const version = await prismaTest.version.findFirst()
    if (!version) {
      throw new Error("No version found in the database")
    }
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
        versionId: version.id,
        type: "API",
        name: "test.csv",
        createdById: user.id,
        organizationId: testOrganizationId,
        createdAt: new Date(),
      },
    })

    baseProduct = {
      id: uuid(),
      gtins: ["1234567891001"],
      internalReference: "REF-124",
      brand: "TestBrand2",
      date: "2025-04-19",
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
      { productId: id1, score: 100, standardized: 10 },
      { productId: id2, score: 200, standardized: 20 },
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
    expect(found.find((score) => score.productId === id1)?.score).toBe(100)
    expect(found.find((score) => score.productId === id1)?.standardized).toBe(10)
    expect(found.find((score) => score.productId === id2)?.score).toBe(200)
    expect(found.find((score) => score.productId === id2)?.standardized).toBe(20)
  })

  it("createScore should create a score and product with upload", async () => {
    const score = 500
    const product = {
      gtins: ["1234567891000"],
      internalReference: "REF-123",
      brand: "TestBrand",
      date: new Date("2025-04-18"),
      product: ProductCategory.Pull,
      declaredScore: 2222.63,
      business: Business.Small,
      numberOfReferences: 9000,
      mass: 1,
      price: 100,
      materials: [{ id: MaterialType.Viscose, share: 0.9 }],
      trims: [{ id: AccessoryType.BoutonEnMétal, quantity: 1 }],
    }
    const result = await createScore(user, product, score)
    expect(result).toBeDefined()

    const createdScore = await prismaTest.score.findFirst({
      where: { score: 500 },
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
