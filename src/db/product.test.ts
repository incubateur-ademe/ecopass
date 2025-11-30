import { v4 as uuid } from "uuid"
import { Prisma, Status } from "../../prisma/src/prisma"
import { prismaTest } from "../../jest.setup"
jest.mock("./prismaClient", () => ({
  prismaClient: prismaTest,
}))

import {
  createProducts,
  failProducts,
  getOrganizationProductsCountByUserIdAndBrand,
  getProductsByUploadId,
  getProductWithScoreHistory,
  getProductWithScoreHistoryCount,
  getOldProductWithScore,
  getProductsToProcess,
} from "./product"
import { AccessoryType, Business, MaterialType, ProductCategory } from "../types/Product"
import { ProductInformationAPI } from "../services/validation/api"
import { cleanDB } from "./testUtils"
import { encryptProductFields } from "../utils/encryption/encryption"

describe("Product DB integration", () => {
  let testUserId: string
  let testOrganizationId: string
  let testUploadId: string
  let productId: string
  let baseProduct: Prisma.ProductCreateInput

  beforeAll(async () => {
    await cleanDB()

    const organization = await prismaTest.organization.create({
      data: {
        name: "TestOrg",
        siret: "12345678901234",
        brands: {
          createMany: {
            data: [
              { name: "TestOrg", id: "69147ca8-09c6-4ae6-b731-d5344f080491", default: true },
              { name: "TestBrand", id: "abf5acc4-fabc-4082-b49a-61b00b5cfcad" },
              { name: "TestBrand2", id: "656fcd2e-4a9c-4313-bc8b-71e6e4fe91df" },
              { name: "TestBrand3", id: "68cac5fc-a25e-4b37-96c6-bac1a421934b" },
            ],
          },
        },
      },
    })
    testOrganizationId = organization.id
    const user = await prismaTest.user.create({
      data: { email: "test@example.com", organizationId: testOrganizationId },
    })
    testUserId = user.id
    const upload = await prismaTest.upload.create({
      data: {
        version: "test-version",
        type: "API",
        name: "test.csv",
        createdById: testUserId,
        organizationId: testOrganizationId,
        createdAt: new Date(),
      },
    })
    testUploadId = upload.id

    const otherOrganisation = await prismaTest.organization.create({
      data: { name: "Other org", siret: "12345678901235" },
    })
    await prismaTest.authorizedOrganization.createMany({
      data: [
        { fromId: otherOrganisation.id, toId: organization.id, active: true, createdById: testUserId },
        { fromId: otherOrganisation.id, toId: organization.id, active: false, createdById: testUserId },
        { fromId: organization.id, toId: otherOrganisation.id, active: true, createdById: testUserId },
        { fromId: organization.id, toId: otherOrganisation.id, active: false, createdById: testUserId },
      ],
    })

    baseProduct = {
      id: uuid(),
      upload: { connect: { id: testUploadId } },
      status: Status.Done,
      hash: "test-hash",
      gtins: ["3234567891000"],
      internalReference: "REF-124",
      brand: { connect: { id: "656fcd2e-4a9c-4313-bc8b-71e6e4fe91df" } },
      declaredScore: 3000.5,
      informations: {
        create: {
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
    await prismaTest.accessory.deleteMany()
    await prismaTest.material.deleteMany()
    await prismaTest.score.deleteMany()
    await prismaTest.productInformation.deleteMany()
    await prismaTest.uploadProduct.deleteMany()
    await prismaTest.product.deleteMany()

    productId = uuid()
    const encrypted = encryptProductFields({
      product: ProductCategory.Pull,
      business: Business.Small,
      numberOfReferences: 9000,
      mass: 1,
      price: 100,
      materials: [{ id: MaterialType.Viscose, share: 0.9 }],
      trims: [{ id: AccessoryType.BoutonEnMétal, quantity: 1 }],
      countryDyeing: "FR",
      countryFabric: "FR",
      countryMaking: "FR",
    } satisfies ProductInformationAPI)

    await createProducts({
      products: [
        {
          error: null,
          hash: "test-hash",
          id: productId,
          createdAt: new Date(),
          uploadId: testUploadId,
          uploadOrder: 5,
          status: Status.Pending,
          gtins: ["2234567891001"],
          internalReference: "REF-123",
          brandName: null,
          brandId: "abf5acc4-fabc-4082-b49a-61b00b5cfcad",
          declaredScore: 2222.63,
          score: null,
          standardized: null,
        },
      ],
      informations: [
        {
          id: "info-1",
          productId,
          ...encrypted.product,
          emptyTrims: false,
        },
      ],
      materials: encrypted.materials.map((material) => ({
        ...material,
        id: uuid(),
        productId: "info-1",
      })),
      accessories: encrypted.accessories
        ? encrypted.accessories.map((accessory) => ({
            ...accessory,
            id: uuid(),
            productId: "info-1",
          }))
        : [],
    })
  })

  it("getProductsByUploadId", async () => {
    const found = await getProductsByUploadId(testUploadId)

    expect(found).toHaveLength(1)
    expect(found[0].informations).toHaveLength(1)
    expect(found[0].id).toBe(productId)
    expect(found[0].informations[0].materials).toHaveLength(1)
    expect(found[0].informations[0].accessories).toHaveLength(1)
    expect(found[0].upload.createdBy.organization?.authorizedBy).toHaveLength(1)
  })

  it("getProductsByUploadId and order them", async () => {
    const encrypted = encryptProductFields({
      product: ProductCategory.Pull,
      business: Business.Small,
      numberOfReferences: 9000,
      mass: 1,
      price: 100,
      materials: [],
      trims: [],
      countryDyeing: "FR",
      countryFabric: "FR",
      countryMaking: "FR",
    } satisfies ProductInformationAPI)

    let newId = uuid()
    await createProducts({
      products: [
        {
          error: null,
          hash: "new-hash",
          id: newId,
          createdAt: new Date(),
          uploadId: testUploadId,
          uploadOrder: 2,
          status: Status.Pending,
          gtins: ["2234567891001"],
          internalReference: "REF-123",
          brandName: null,
          brandId: "abf5acc4-fabc-4082-b49a-61b00b5cfcad",
          declaredScore: 2222.63,
          score: null,
          standardized: null,
        },
      ],
      informations: [
        {
          id: "info-1",
          productId,
          ...encrypted.product,
          emptyTrims: false,
        },
      ],
      materials: [],
      accessories: [],
    })
    const found = await getProductsByUploadId(testUploadId)

    expect(found).toHaveLength(2)
    expect(found[1].id).toBe(productId)
    expect(found[0].id).toBe(newId)
  })

  it("failProducts sets status to Error", async () => {
    await failProducts([{ productId, error: "Test error" }])

    const updated = await prismaTest.product.findUnique({ where: { id: productId } })
    expect(updated?.status).toBe(Status.Error)
    expect(updated?.error).toBe("Test error")
  })

  it("getOrganizationProductsCountByUserIdAndBrand returns correct count", async () => {
    await Promise.all([
      prismaTest.product.create({
        data: baseProduct,
      }),
      prismaTest.product.create({
        data: {
          ...baseProduct,
          id: uuid(),
          internalReference: "REF-125",
          status: Status.Pending,
        },
      }),
      prismaTest.product.create({
        data: {
          ...baseProduct,
          id: uuid(),
          brand: { connect: { id: "68cac5fc-a25e-4b37-96c6-bac1a421934b" } },
          internalReference: "REF-126",
        },
      }),
      prismaTest.product.create({
        data: {
          ...baseProduct,
          id: uuid(),
          status: Status.Pending,
        },
      }),
      prismaTest.product.create({
        data: {
          ...baseProduct,
          id: uuid(),
          status: Status.Done,
        },
      }),
    ])
    const countBrand2 = await getOrganizationProductsCountByUserIdAndBrand(
      testUserId,
      "656fcd2e-4a9c-4313-bc8b-71e6e4fe91df",
    )
    expect(countBrand2).toBe(1)

    const countAll = await getOrganizationProductsCountByUserIdAndBrand(testUserId)
    expect(countAll).toBe(2)
  })

  it("getProductWithScoreHistoryCount returns correct count", async () => {
    const gtin = "2234567891001"
    const productIds = []

    for (let i = 0; i < 3; i++) {
      const productId = uuid()
      productIds.push(productId)

      await prismaTest.product.create({
        data: {
          ...baseProduct,
          id: productId,
          gtins: [gtin],
          internalReference: `REF-${200 + i}`,
          status: Status.Done,
        },
      })
    }

    const count = await getProductWithScoreHistoryCount(gtin)
    expect(count).toBe(3)
  })

  it("getProductWithScoreHistory returns products with pagination", async () => {
    const gtin = "4234567891009"
    const productIds = []

    const encrypted = encryptProductFields({
      product: ProductCategory.Pull,
      business: Business.Small,
      numberOfReferences: 9000,
      mass: 1,
      price: 100,
      materials: [],
      trims: [],
      countryDyeing: "FR",
      countryFabric: "FR",
      countryMaking: "FR",
    } satisfies ProductInformationAPI)

    for (let i = 0; i < 5; i++) {
      const productId = uuid()
      productIds.push(productId)

      await prismaTest.product.create({
        data: {
          uploadId: testUploadId,
          id: productId,
          gtins: [gtin],
          internalReference: `REF-${300 + i}`,
          status: Status.Done,
          createdAt: new Date(Date.now() + i * 1000),
          hash: "test-hash",
          brandName: null,
          brandId: "abf5acc4-fabc-4082-b49a-61b00b5cfcad",
          informations: { create: { ...encrypted.product } },
        },
      })
    }

    const allProducts = await getProductWithScoreHistory(gtin, 0, 10)
    expect(allProducts).toHaveLength(5)

    const firstPage = await getProductWithScoreHistory(gtin, 0, 2)
    expect(firstPage).toHaveLength(2)
    expect(firstPage[0].internalReference).toBe("REF-304")
    expect(firstPage[1].internalReference).toBe("REF-303")

    const secondPage = await getProductWithScoreHistory(gtin, 1, 2)
    expect(secondPage).toHaveLength(2)
    expect(secondPage[0].internalReference).toBe("REF-302")
    expect(secondPage[1].internalReference).toBe("REF-301")

    const thirdPage = await getProductWithScoreHistory(gtin, 2, 2)
    expect(thirdPage).toHaveLength(1)
    expect(thirdPage[0].internalReference).toBe("REF-300")
  })

  it("getOldProductWithScore returns specific product version", async () => {
    const gtin = "6234567891007"

    const productId1 = uuid()
    const productId2 = uuid()

    const encrypted = encryptProductFields({
      product: ProductCategory.Pull,
      business: Business.Small,
      numberOfReferences: 9000,
      mass: 1,
      price: 100,
      materials: [],
      trims: [],
      countryDyeing: "FR",
      countryFabric: "FR",
      countryMaking: "FR",
    } satisfies ProductInformationAPI)

    await prismaTest.product.create({
      data: {
        uploadId: testUploadId,
        id: "productId1",
        gtins: [gtin],
        internalReference: "REF-500",
        status: Status.Done,
        createdAt: new Date(Date.now() - 1000),
        hash: "test-hash",
        brandName: null,
        brandId: "abf5acc4-fabc-4082-b49a-61b00b5cfcad",
        score: 100,
        informations: { create: { id: productId1, ...encrypted.product } },
      },
    })

    await prismaTest.product.create({
      data: {
        uploadId: testUploadId,
        id: "productId2",
        gtins: [gtin],
        internalReference: "REF-501",
        status: Status.Done,
        createdAt: new Date(),
        hash: "test-hash",
        brandName: null,
        brandId: "abf5acc4-fabc-4082-b49a-61b00b5cfcad",
        score: 200,
        informations: { create: { id: productId2, ...encrypted.product } },
      },
    })

    await prismaTest.score.create({
      data: {
        id: uuid(),
        productId: productId1,
        score: 100,
        standardized: 50,
        durability: 10,
        acd: 1,
        cch: 1,
        etf: 1,
        fru: 1,
        fwe: 1,
        htc: 1,
        htn: 1,
        ior: 1,
        ldu: 1,
        mru: 1,
        ozd: 1,
        pco: 1,
        pma: 1,
        swe: 1,
        tre: 1,
        wtu: 1,
        microfibers: 1,
        outOfEuropeEOL: 1,
      },
    })

    await prismaTest.score.create({
      data: {
        id: uuid(),
        productId: productId2,
        score: 200,
        standardized: 100,
        durability: 20,
        acd: 2,
        cch: 2,
        etf: 2,
        fru: 2,
        fwe: 2,
        htc: 2,
        htn: 2,
        ior: 2,
        ldu: 2,
        mru: 2,
        ozd: 2,
        pco: 2,
        pma: 2,
        swe: 2,
        tre: 2,
        wtu: 2,
        microfibers: 2,
        outOfEuropeEOL: 2,
      },
    })

    const oldProduct = await getOldProductWithScore(gtin, "productId1")
    expect(oldProduct).not.toBeNull()
    expect(oldProduct?.internalReference).toBe("REF-500")
    expect(oldProduct?.score).toBe(100)
    expect(oldProduct?.informations[0].score?.score).toBe(100)

    const newerProduct = await getOldProductWithScore(gtin, "productId2")
    expect(newerProduct).not.toBeNull()
    expect(newerProduct?.internalReference).toBe("REF-501")
    expect(newerProduct?.score).toBe(200)
    expect(newerProduct?.informations[0].score?.score).toBe(200)

    const nonExistent = await getOldProductWithScore(gtin, uuid())
    expect(nonExistent).toBeNull()
  })

  it("getOldProductWithScore only returns products with Done status", async () => {
    const gtin = "8234567891005"
    const productId = uuid()

    await prismaTest.product.create({
      data: {
        ...baseProduct,
        id: productId,
        gtins: [gtin],
        internalReference: "REF-700",
        status: Status.Pending, // Not Done
      },
    })

    const product = await getOldProductWithScore(gtin, productId)
    expect(product).toBeNull()
  })

  describe("createProducts", () => {
    it("creates products when no existing products with same hash", async () => {
      const newProductId = uuid()
      const encrypted = encryptProductFields({
        product: ProductCategory.TShirtPolo,
        business: Business.Small,
        numberOfReferences: 5000,
        mass: 0.3,
        price: 75,
        materials: [{ id: MaterialType.Coton, share: 1.0 }],
        trims: [{ id: AccessoryType.BoutonEnMétal, quantity: 2 }],
        countryDyeing: "FR",
        countryFabric: "FR",
        countryMaking: "FR",
      } satisfies ProductInformationAPI)

      const numberOfCreatedProducts = await createProducts({
        products: [
          {
            error: null,
            hash: "unique-hash-001",
            id: newProductId,
            createdAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 1,
            status: Status.Pending,
            gtins: ["9999999999999"],
            internalReference: "NEW-REF-001",
            brandName: null,
            brandId: "abf5acc4-fabc-4082-b49a-61b00b5cfcad",
            declaredScore: 1500.0,
            score: null,
            standardized: null,
          },
        ],
        informations: [
          {
            id: "info-2",
            productId: newProductId,
            ...encrypted.product,
            emptyTrims: false,
          },
        ],
        materials: encrypted.materials.map((material) => ({
          ...material,
          id: uuid(),
          productId: "info-2",
        })),
        accessories:
          encrypted.accessories?.map((accessory) => ({
            ...accessory,
            id: uuid(),
            productId: "info-2",
          })) || [],
      })

      expect(numberOfCreatedProducts).toBe(1)

      const createdProduct = await prismaTest.product.findUnique({
        where: { id: newProductId },
        include: { informations: { include: { materials: true, accessories: true } } },
      })

      expect(createdProduct).not.toBeNull()
      expect(createdProduct?.hash).toBe("unique-hash-001")
      expect(createdProduct?.informations).toHaveLength(1)
      expect(createdProduct?.informations[0].materials).toHaveLength(1)
      expect(createdProduct?.informations[0].accessories).toHaveLength(1)
    })

    it("creates uploadProduct relation when product with same hash exists", async () => {
      const existingGtin = "1111111111111"
      const existingHash = "duplicate-hash"

      const existingProductId = uuid()
      await prismaTest.product.create({
        data: {
          ...baseProduct,
          id: existingProductId,
          gtins: [existingGtin],
          hash: existingHash,
          internalReference: "EXISTING-REF",
        },
      })

      const newProductId = uuid()
      const encrypted = encryptProductFields({
        product: ProductCategory.Pull,
        business: Business.Small,
        numberOfReferences: 3000,
        mass: 0.4,
        price: 60,
        materials: [{ id: MaterialType.Viscose, share: 0.8 }],
        trims: [{ id: AccessoryType.BoutonEnMétal, quantity: 2 }],
        countryDyeing: "FR",
        countryFabric: "FR",
        countryMaking: "FR",
      } satisfies ProductInformationAPI)

      const numberOfCreatedProducts = await createProducts({
        products: [
          {
            error: null,
            hash: existingHash,
            id: newProductId,
            createdAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 1,
            status: Status.Pending,
            gtins: [existingGtin],
            internalReference: "NEW-REF-002",
            brandName: null,
            brandId: "abf5acc4-fabc-4082-b49a-61b00b5cfcad",
            declaredScore: 2000.0,
            score: null,
            standardized: null,
          },
        ],
        informations: [
          {
            id: "info-1",
            productId,
            ...encrypted.product,
            emptyTrims: false,
          },
        ],
        materials: encrypted.materials.map((material) => ({
          ...material,
          id: uuid(),
          productId: newProductId,
        })),
        accessories:
          encrypted.accessories?.map((accessory) => ({
            ...accessory,
            id: uuid(),
            productId: newProductId,
          })) || [],
      })

      expect(numberOfCreatedProducts).toBe(0)

      const newProduct = await prismaTest.product.findUnique({
        where: { id: newProductId },
      })
      expect(newProduct).toBeNull()

      const uploadProduct = await prismaTest.uploadProduct.findFirst({
        where: {
          uploadId: testUploadId,
          productId: existingProductId,
        },
      })
      expect(uploadProduct).not.toBeNull()
      expect(uploadProduct?.uploadOrder).toBe(1)
    })

    it("creates products with same GTIN but different hash", async () => {
      const sameGtin = "2222222222222"
      const existingHash = "original-hash"
      const newHash = "updated-hash"

      const existingProductId = uuid()
      await prismaTest.product.create({
        data: {
          ...baseProduct,
          id: existingProductId,
          gtins: [sameGtin],
          hash: existingHash,
          internalReference: "ORIGINAL-REF",
        },
      })

      const newProductId = uuid()
      const encrypted = encryptProductFields({
        product: ProductCategory.Pull,
        business: Business.Small,
        numberOfReferences: 4000,
        mass: 0.6,
        price: 80,
        materials: [{ id: MaterialType.Lin, share: 0.7 }],
        trims: [{ id: AccessoryType.BoutonEnMétal, quantity: 2 }],
        countryDyeing: "FR",
        countryFabric: "FR",
        countryMaking: "FR",
      } satisfies ProductInformationAPI)

      const numberOfCreatedProducts = await createProducts({
        products: [
          {
            error: null,
            hash: newHash,
            id: newProductId,
            createdAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 1,
            status: Status.Pending,
            gtins: [sameGtin],
            internalReference: "UPDATED-REF",
            brandName: null,
            brandId: "abf5acc4-fabc-4082-b49a-61b00b5cfcad",
            declaredScore: 2500.0,
            score: null,
            standardized: null,
          },
        ],
        informations: [
          {
            id: "info-2",
            productId: newProductId,
            ...encrypted.product,
            emptyTrims: false,
          },
        ],
        materials: encrypted.materials.map((material) => ({
          ...material,
          id: uuid(),
          productId: "info-2",
        })),
        accessories:
          encrypted.accessories?.map((accessory) => ({
            ...accessory,
            id: uuid(),
            productId: "info-2",
          })) || [],
      })

      expect(numberOfCreatedProducts).toBe(1)

      const newProduct = await prismaTest.product.findUnique({
        where: { id: newProductId },
        include: { informations: { include: { materials: true, accessories: true } } },
      })

      expect(newProduct).not.toBeNull()
      expect(newProduct?.hash).toBe(newHash)
      expect(newProduct?.informations).toHaveLength(1)
      expect(newProduct?.informations[0].materials).toHaveLength(1)
      expect(newProduct?.informations[0].accessories).toHaveLength(1)

      const uploadProducts = await prismaTest.uploadProduct.findMany({
        where: {
          uploadId: testUploadId,
        },
      })
      expect(uploadProducts).not.toBeNull()
      expect(uploadProducts).toHaveLength(0)
    })

    it("compares hash with the latest product version, not older ones", async () => {
      const gtin = "3333333333333"
      const oldHash = "old-version-hash"
      const latestHash = "latest-version-hash"

      const oldProductId = uuid()
      await prismaTest.product.create({
        data: {
          ...baseProduct,
          id: oldProductId,
          gtins: [gtin],
          hash: oldHash,
          internalReference: "OLD-VERSION",
          createdAt: new Date("2025-01-01"),
        },
      })

      const latestProductId = uuid()
      await prismaTest.product.create({
        data: {
          ...baseProduct,
          id: latestProductId,
          gtins: [gtin],
          hash: latestHash,
          internalReference: "LATEST-VERSION",
          createdAt: new Date("2025-03-01"),
        },
      })

      const newProductId = uuid()
      const encrypted = encryptProductFields({
        product: ProductCategory.Pull,
        business: Business.Small,
        numberOfReferences: 1200,
        mass: 0.7,
        price: 90,
        materials: [{ id: MaterialType.Coton, share: 0.5 }],
        trims: [{ id: AccessoryType.BoutonEnMétal, quantity: 1 }],
        countryDyeing: "FR",
        countryFabric: "FR",
        countryMaking: "FR",
      } satisfies ProductInformationAPI)

      const numberOfCreatedProducts = await createProducts({
        products: [
          {
            error: null,
            hash: oldHash,
            id: newProductId,
            createdAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 1,
            status: Status.Pending,
            gtins: [gtin],
            internalReference: "NEW-WITH-OLD-HASH",
            brandName: null,
            brandId: "abf5acc4-fabc-4082-b49a-61b00b5cfcad",
            declaredScore: 2800.0,
            score: null,
            standardized: null,
          },
        ],
        informations: [
          {
            id: "info-1",
            productId,
            ...encrypted.product,
            emptyTrims: false,
          },
        ],
        materials: encrypted.materials.map((material) => ({
          ...material,
          id: uuid(),
          productId: newProductId,
        })),
        accessories:
          encrypted.accessories?.map((accessory) => ({
            ...accessory,
            id: uuid(),
            productId: newProductId,
          })) || [],
      })

      expect(numberOfCreatedProducts).toBe(1)

      const newProduct = await prismaTest.product.findUnique({
        where: { id: newProductId },
      })
      expect(newProduct).not.toBeNull()
      expect(newProduct?.hash).toBe(oldHash)
    })
  })
})
