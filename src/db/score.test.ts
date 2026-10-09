import { ConfidenceLevel, UserType } from "@prisma/client"
import { Status, UploadType } from "@prisma/enums"
import { prismaTest as mockPrismaTest } from "../../jest.setup"

jest.mock("./prismaClient", () => ({
  prismaClient: mockPrismaTest,
}))

import { createScore, getMeanScores } from "./score"
import { AccessoryType, Business, MaterialType, ProductCategory } from "../types/Product"
import { cleanDB } from "./testUtils"
import { FullUser } from "./user"
import { encryptProductFields } from "../utils/encryption/encryption"
import { ProductWithScoreBase } from "./product"
import { ProductInformationAPI } from "../services/validation/api"

describe("Score DB integration", () => {
  let user: FullUser
  let testOrganizationId: string
  let testUploadId: string

  const BASE_PRODUCT = {
    product: ProductCategory.Pull,
    business: Business.Small,
    numberOfReferences: 1000,
    mass: 1,
    price: 50,
    materials: [],
    trims: [],
    countryDyeing: "FR",
    countryFabric: "FR",
    countryMaking: "FR",
  } satisfies ProductInformationAPI

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
        nom: true,
        prenom: true,
        email: true,
        type: true,
        role: true,
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
    testUploadId = upload.id
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

  describe("getMeanScores", () => {
    it("returns batch score when confidence level is High", async () => {
      const product = {
        id: "product-1",
        internalReference: "REF-1",
        confidenceLevel: ConfidenceLevel.High,
        score: 120,
        meanScore: 120,
        standardized: 90,
        meanStandardized: 90,
        gtins: ["GTIN-001"],
        createdAt: new Date(),
        informations: [
          {
            categorySlug: "tshirt",
            mainComponent: true,
            score: {
              acd: 0.05,
              cch: 0.06,
              etf: 0.07,
              fru: 0.08,
              fwe: 0.09,
              ior: 0.1,
              ldu: 0.11,
              microfibers: 0.12,
              mru: 0.13,
              outOfEuropeEOL: 0.14,
              ozd: 0.15,
              pco: 0.16,
              pma: 0.17,
              swe: 0.18,
              tre: 0.19,
              wtu: 0.2,
              materials: 0.21,
              spinning: 0.22,
              fabric: 0.23,
              dyeing: 0.24,
              making: 0.25,
              usage: 0.26,
              endOfLife: 0.27,
              transport: 0.28,
              trims: 0.29,
              htc: 0.3,
              htn: 0.31,
              durability: 0.25,
              score: 120,
              standardized: 90,
            },
          },
        ],
        brand: null,
        upload: { version: "test", createdBy: { id: "user-1", type: UserType.CITOYEN, organization: null } },
      } satisfies ProductWithScoreBase

      const result = await getMeanScores(product)

      expect(result.score).toBe(product.score)
      expect(result.standardized).toBe(product.standardized)
      expect(result.durability).toBe(0.25)

      expect(Object.keys(result).length).toBe(Object.keys(product.informations[0].score).length + 1)
      Object.entries(product.informations[0].score).forEach(([key, value]) => {
        expect(value).toBe((result as Record<string, number>)[key])
      })
    })

    it("computes mean of scores from older products", async () => {
      const product: ProductWithScoreBase = {
        id: "product-1",
        internalReference: "REF-1",
        confidenceLevel: ConfidenceLevel.Low,
        score: 100,
        meanScore: 100,
        standardized: 80,
        meanStandardized: 80,
        gtins: ["GTIN-001"],
        createdAt: new Date(),
        informations: [
          {
            categorySlug: "tshirt",
            mainComponent: true,
            score: {
              acd: 0.05,
              cch: 0.06,
              etf: 0.07,
              fru: 0.08,
              fwe: 0.09,
              ior: 0.1,
              ldu: 0.11,
              microfibers: 0.12,
              mru: 0.13,
              outOfEuropeEOL: 0.14,
              ozd: 0.15,
              pco: 0.16,
              pma: 0.17,
              swe: 0.18,
              tre: 0.19,
              wtu: 0.2,
              materials: 0.21,
              spinning: 0.22,
              fabric: 0.23,
              dyeing: 0.24,
              making: 0.25,
              usage: 0.26,
              endOfLife: 0.27,
              transport: 0.28,
              trims: 0.29,
              htc: 0.3,
              htn: 0.31,
              durability: 0.25,
              score: 100,
              standardized: 80,
            },
          },
        ],
        brand: null,
        upload: { version: "test", createdBy: { id: "user-1", type: UserType.CITOYEN, organization: null } },
      }

      await mockPrismaTest.product.create({
        data: {
          id: "product-2",
          internalReference: "REF-1",
          confidenceLevel: ConfidenceLevel.Low,
          status: Status.Done,
          score: 200,
          meanScore: 200,
          standardized: 90,
          meanStandardized: 90,
          gtins: ["GTIN-001"],
          createdAt: new Date("2023-01-01T00:00:00Z"),
          informations: { create: { ...encryptProductFields(BASE_PRODUCT).product, id: "information-1" } },
          hash: "hash",
          uploadId: testUploadId,
        },
      })
      await mockPrismaTest.product.create({
        data: {
          id: "product-3",
          internalReference: "REF-1",
          confidenceLevel: ConfidenceLevel.Medium,
          status: Status.Done,
          score: 200,
          meanScore: 200,
          standardized: 90,
          meanStandardized: 90,
          gtins: ["GTIN-001"],
          createdAt: new Date("2023-01-01T00:00:00Z"),
          informations: { create: { ...encryptProductFields(BASE_PRODUCT).product, id: "information-2" } },
          hash: "hash",
          uploadId: testUploadId,
        },
      })
      await mockPrismaTest.product.create({
        data: {
          id: "product-4",
          internalReference: "REF-1",
          confidenceLevel: ConfidenceLevel.Low,
          status: Status.Error,
          score: 200,
          meanScore: 200,
          standardized: 90,
          meanStandardized: 90,
          gtins: ["GTIN-001"],
          createdAt: new Date("2023-01-01T00:00:00Z"),
          informations: { create: { ...encryptProductFields(BASE_PRODUCT).product, id: "information-3" } },
          hash: "hash",
          uploadId: testUploadId,
        },
      })
      await mockPrismaTest.product.create({
        data: {
          id: "product-5",
          internalReference: "REF-1",
          confidenceLevel: ConfidenceLevel.Low,
          status: Status.Done,
          score: 200,
          meanScore: 200,
          standardized: 90,
          meanStandardized: 90,
          gtins: ["GTIN-001"],
          createdAt: new Date("2099-01-01T00:00:00Z"),
          informations: { create: { ...encryptProductFields(BASE_PRODUCT).product, id: "information-4" } },
          hash: "hash",
          uploadId: testUploadId,
        },
      })

      const scores = {
        acd: 0.1,
        cch: 0.2,
        etf: 0.3,
        fru: 0.4,
        fwe: 0.5,
        ior: 0.6,
        ldu: 0.7,
        microfibers: 0.8,
        mru: 0.9,
        outOfEuropeEOL: 1.0,
        ozd: 1.1,
        pco: 1.2,
        pma: 1.3,
        swe: 1.4,
        tre: 1.5,
        wtu: 1.6,
        materials: 1.7,
        spinning: 1.8,
        fabric: 1.9,
        dyeing: 2.0,
        making: 2.1,
        usage: 2.2,
        endOfLife: 2.3,
        transport: 2.4,
        trims: 2.5,
        htc: 2.6,
        htn: 2.7,
        durability: 0.5,
        score: 200,
        standardized: 90,
      }

      await mockPrismaTest.score.createMany({
        data: [
          {
            productId: "information-1",
            ...scores,
          },
          {
            productId: "information-2",
            ...scores,
          },
          {
            productId: "information-3",
            ...scores,
          },
          {
            productId: "information-4",
            ...scores,
          },
        ],
      })
      const result = await getMeanScores(product)

      expect(result).toStrictEqual({
        acd: 0.07500000000000001,
        cch: 0.13,
        durability: 0.375,
        dyeing: 1.12,
        endOfLife: 1.285,
        etf: 0.185,
        fabric: 1.065,
        fru: 0.24000000000000002,
        fwe: 0.295,
        htc: 1.45,
        htn: 1.5050000000000001,
        ior: 0.35,
        ldu: 0.40499999999999997,
        making: 1.175,
        materials: 0.955,
        microfibers: 0.46,
        mru: 0.515,
        outOfEuropeEOL: 0.5700000000000001,
        ozd: 0.625,
        pco: 0.6799999999999999,
        pma: 0.735,
        score: 150,
        spinning: 1.01,
        standardized: 85,
        swe: 0.7899999999999999,
        transport: 1.3399999999999999,
        tre: 0.845,
        trims: 1.395,
        usage: 1.23,
        wtu: 0.9,
      })
    })
  })
})
