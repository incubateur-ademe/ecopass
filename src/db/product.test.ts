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
} from "./product"
import { AccessoryType, Business, MaterialType, ProductCategory } from "../types/Product"
import { ProductAPIValidation } from "../services/validation/api"
import { cleanDB } from "./testUtils"
import { encryptProductFields } from "../utils/encryption/encryption"

describe("Product DB integration", () => {
  let testUserId: string
  let testOrganizationId: string
  let testUploadId: string
  let productId: string
  let baseProduct: Prisma.ProductCreateManyInput

  beforeAll(async () => {
    await cleanDB()

    const organization = await prismaTest.organization.create({
      data: { name: "TestOrg", siret: "12345678901234" },
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
      hash: "test-hash",
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
      uploadId: testUploadId,
      status: Status.Done,
    }
  })

  afterAll(async () => {
    await cleanDB()
  })

  beforeEach(async () => {
    await prismaTest.accessory.deleteMany()
    await prismaTest.material.deleteMany()
    await prismaTest.score.deleteMany()
    await prismaTest.uploadProduct.deleteMany()
    await prismaTest.product.deleteMany()

    productId = uuid()
    const encrypted = encryptProductFields({
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
    } satisfies ProductAPIValidation)

    await createProducts({
      products: [
        {
          ...encrypted.product,
          error: null,
          hash: "test-hash",
          id: productId,
          createdAt: new Date(),
          updatedAt: new Date(),
          uploadId: testUploadId,
          uploadOrder: 5,
          status: Status.Pending,
        },
      ],
      materials: encrypted.materials.map((material) => ({
        ...material,
        id: uuid(),
        productId,
      })),
      accessories: encrypted.accessories
        ? encrypted.accessories.map((accessory) => ({
            ...accessory,
            id: uuid(),
            productId,
          }))
        : [],
    })
  })

  it("getProductsByUploadId", async () => {
    const found = await getProductsByUploadId(testUploadId)

    expect(found).toHaveLength(1)
    expect(found[0].id).toBe(productId)
    expect(found[0].materials).toHaveLength(1)
    expect(found[0].accessories).toHaveLength(1)
    expect(found[0].upload.createdBy.organization?.authorizedBy).toHaveLength(1)
  })

  it("getProductsByUploadId and order them", async () => {
    const encrypted = encryptProductFields({
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
      materials: [],
      trims: [],
    } satisfies ProductAPIValidation)

    let newId = uuid()
    await createProducts({
      products: [
        {
          ...encrypted.product,
          error: null,
          hash: "new-hash",
          id: newId,
          createdAt: new Date(),
          updatedAt: new Date(),
          uploadId: testUploadId,
          uploadOrder: 2,
          status: Status.Pending,
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
    await failProducts([{ id: productId, error: "Test error" }])

    const updated = await prismaTest.product.findUnique({ where: { id: productId } })
    expect(updated?.status).toBe(Status.Error)
    expect(updated?.error).toBe("Test error")
  })

  it("getOrganizationProductsCountByUserIdAndBrand returns correct count", async () => {
    await prismaTest.product.createMany({
      data: [
        baseProduct,
        {
          ...baseProduct,
          id: uuid(),
          internalReference: "REF-125",
          status: Status.Pending,
        },
        {
          ...baseProduct,
          id: uuid(),
          brand: "TestBrand3",
          internalReference: "REF-126",
        },
        {
          ...baseProduct,
          id: uuid(),
          status: Status.Pending,
        },
        {
          ...baseProduct,
          id: uuid(),
          status: Status.Done,
        },
      ],
    })
    const countBrand2 = await getOrganizationProductsCountByUserIdAndBrand(testUserId, "TestBrand2")
    expect(countBrand2).toBe(1)

    const countAll = await getOrganizationProductsCountByUserIdAndBrand(testUserId)
    expect(countAll).toBe(2)
  })

  it("getProductWithScoreHistoryCount returns correct count", async () => {
    const gtin = "1234567891002"
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
    const gtin = "1234567891003"
    const productIds = []

    const encrypted = encryptProductFields({
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
      materials: [],
      trims: [],
    } satisfies ProductAPIValidation)

    for (let i = 0; i < 5; i++) {
      const productId = uuid()
      productIds.push(productId)

      await prismaTest.product.create({
        data: {
          ...encrypted.product,
          uploadId: testUploadId,
          id: productId,
          gtins: [gtin],
          internalReference: `REF-${300 + i}`,
          status: Status.Done,
          createdAt: new Date(Date.now() + i * 1000),
          hash: "test-hash",
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
    const gtin = "1234567891005"

    const productId1 = uuid()
    const productId2 = uuid()

    const encrypted = encryptProductFields({
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
      materials: [],
      trims: [],
    } satisfies ProductAPIValidation)

    await prismaTest.product.create({
      data: {
        ...encrypted.product,
        uploadId: testUploadId,
        id: productId1,
        gtins: [gtin],
        internalReference: "REF-500",
        status: Status.Done,
        createdAt: new Date(Date.now() - 1000),
        hash: "test-hash",
      },
    })

    await prismaTest.product.create({
      data: {
        ...encrypted.product,
        uploadId: testUploadId,
        id: productId2,
        gtins: [gtin],
        internalReference: "REF-501",
        status: Status.Done,
        createdAt: new Date(),
        hash: "test-hash",
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

    const oldProduct = await getOldProductWithScore(gtin, productId1)
    expect(oldProduct).not.toBeNull()
    expect(oldProduct?.internalReference).toBe("REF-500")
    expect(oldProduct?.score?.score).toBe(100)

    const newerProduct = await getOldProductWithScore(gtin, productId2)
    expect(newerProduct).not.toBeNull()
    expect(newerProduct?.internalReference).toBe("REF-501")
    expect(newerProduct?.score?.score).toBe(200)

    const nonExistent = await getOldProductWithScore(gtin, uuid())
    expect(nonExistent).toBeNull()
  })

  it("getOldProductWithScore only returns products with Done status", async () => {
    const gtin = "1234567891007"
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
        gtins: ["9999999999999"],
        internalReference: "NEW-REF-001",
        brand: "NewBrand",
        date: new Date("2025-04-20"),
        product: ProductCategory.TShirtPolo,
        declaredScore: 1500.0,
        business: Business.Small,
        numberOfReferences: 5000,
        mass: 0.3,
        price: 75,
        materials: [{ id: MaterialType.Coton, share: 1.0 }],
        trims: [{ id: AccessoryType.BoutonEnMétal, quantity: 2 }],
      } satisfies ProductAPIValidation)

      const numberOfCreatedProducts = await createProducts({
        products: [
          {
            ...encrypted.product,
            error: null,
            hash: "unique-hash-001",
            id: newProductId,
            createdAt: new Date(),
            updatedAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 1,
            status: Status.Pending,
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

      const createdProduct = await prismaTest.product.findUnique({
        where: { id: newProductId },
        include: { materials: true, accessories: true },
      })

      expect(createdProduct).not.toBeNull()
      expect(createdProduct?.hash).toBe("unique-hash-001")
      expect(createdProduct?.materials).toHaveLength(1)
      expect(createdProduct?.accessories).toHaveLength(1)
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
        gtins: [existingGtin],
        internalReference: "NEW-REF-002",
        brand: "TestBrand",
        date: new Date("2025-04-21"),
        product: ProductCategory.Pull,
        declaredScore: 2000.0,
        business: Business.Small,
        numberOfReferences: 3000,
        mass: 0.4,
        price: 60,
        materials: [{ id: MaterialType.Viscose, share: 0.8 }],
        trims: [{ id: AccessoryType.BoutonEnMétal, quantity: 2 }],
      } satisfies ProductAPIValidation)

      const numberOfCreatedProducts = await createProducts({
        products: [
          {
            ...encrypted.product,
            error: null,
            hash: existingHash,
            id: newProductId,
            createdAt: new Date(),
            updatedAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 1,
            status: Status.Pending,
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
        gtins: [sameGtin],
        internalReference: "UPDATED-REF",
        brand: "TestBrand",
        date: new Date("2025-04-22"),
        product: ProductCategory.Pull,
        declaredScore: 2500.0,
        business: Business.Small,
        numberOfReferences: 4000,
        mass: 0.6,
        price: 80,
        materials: [{ id: MaterialType.Lin, share: 0.7 }],
        trims: [{ id: AccessoryType.BoutonEnMétal, quantity: 2 }],
      } satisfies ProductAPIValidation)

      const numberOfCreatedProducts = await createProducts({
        products: [
          {
            ...encrypted.product,
            error: null,
            hash: newHash,
            id: newProductId,
            createdAt: new Date(),
            updatedAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 1,
            status: Status.Pending,
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
        include: { materials: true, accessories: true },
      })
      expect(newProduct).not.toBeNull()
      expect(newProduct?.hash).toBe(newHash)
      expect(newProduct?.materials).toHaveLength(1)
      expect(newProduct?.accessories).toHaveLength(1)

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
        gtins: [gtin],
        internalReference: "NEW-WITH-OLD-HASH",
        brand: "TestBrand",
        date: new Date("2025-04-25"),
        product: ProductCategory.Pull,
        declaredScore: 2800.0,
        business: Business.Small,
        numberOfReferences: 1200,
        mass: 0.7,
        price: 90,
        materials: [{ id: MaterialType.Coton, share: 0.5 }],
        trims: [{ id: AccessoryType.BoutonEnMétal, quantity: 1 }],
      } satisfies ProductAPIValidation)

      const numberOfCreatedProducts = await createProducts({
        products: [
          {
            ...encrypted.product,
            error: null,
            hash: oldHash,
            id: newProductId,
            createdAt: new Date(),
            updatedAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 1,
            status: Status.Pending,
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
