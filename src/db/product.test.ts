import { v4 as uuid } from "uuid"
import { Prisma } from "@prisma/client"
import { Status } from "@prisma/enums"
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
  countPublicProductsByBrandId,
  getPublicProductsByBrandId,
  getLatestProductsByBrandIdForExport,
} from "./product"
import { AccessoryType, Business, MaterialType, ProductCategory } from "../types/Product"
import { ProductInformationAPI } from "../services/validation/api"
import { cleanDB } from "./testUtils"
import { encryptProductFields } from "../utils/encryption/encryption"

describe("Product DB integration", () => {
  const DEFAULT_BRAND_ID = "69147ca8-09c6-4ae6-b731-d5344f080491"
  const BRAND_ID_1 = "16ddd839-fec9-4e4c-a4ae-57f71ce72c88"
  const BRAND_ID_2 = "88c3e2c3-2d64-4ac7-98f9-3d7a356cfacf"
  const BRAND_ID_3 = "6c381375-62b8-43b6-bf91-06e29dfaa159"
  const OTHER_ORG_ID = "16c0777c-bf90-4adf-ac3d-81770680b2cd"

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
        displayName: "TestOrg",
        siret: "12345678901234",
        brands: {
          createMany: {
            data: [
              { name: "TestOrg", id: DEFAULT_BRAND_ID, default: true },
              { name: "TestBrand", id: BRAND_ID_1 },
              { name: "TestBrand2", id: BRAND_ID_2 },
              { name: "TestBrand3", id: BRAND_ID_3 },
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
      data: {
        id: OTHER_ORG_ID,
        name: "Other org",
        displayName: "Orther org",
        siret: "12345678901235",
      },
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
      brand: { connect: { id: BRAND_ID_2 } },
      declaredScore: 3000.5,
      informations: {
        create: encryptProductFields(BASE_PRODUCT).product,
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
          brandId: BRAND_ID_1,
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
          brandId: BRAND_ID_1,
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
          brand: { connect: { id: BRAND_ID_3 } },
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
    const countBrand2 = await getOrganizationProductsCountByUserIdAndBrand(testUserId, BRAND_ID_2)
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
          brandId: BRAND_ID_1,
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
        brandId: BRAND_ID_1,
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
        brandId: BRAND_ID_1,
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
        materials: 1,
        transport: 1,
        spinning: 1,
        fabric: 1,
        dyeing: 1,
        making: 1,
        usage: 1,
        endOfLife: 1,
        trims: 1,
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
        materials: 2,
        transport: 2,
        spinning: 2,
        fabric: 2,
        dyeing: 2,
        making: 2,
        usage: 2,
        endOfLife: 2,
        trims: 2,
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
        status: Status.Pending,
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
            brandId: BRAND_ID_1,
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
          createdAt: new Date("2024-01-01"),
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
            brandId: BRAND_ID_1,
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
          createdAt: new Date("2024-01-01"),
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
            brandId: BRAND_ID_1,
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

    it("creates products in error if modification is too recent", async () => {
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)

      await prismaTest.product.create({
        data: {
          ...baseProduct,
          id: uuid(),
          gtins: ["1111111111111"],
          hash: "hash-1",
          internalReference: "ORIGINAL-REF",
          createdAt: lastMonth,
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
            hash: "new-hash",
            id: newProductId,
            createdAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 1,
            status: Status.Pending,
            gtins: ["1111111111111"],
            internalReference: "UPDATED-REF",
            brandName: null,
            brandId: BRAND_ID_1,
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

      expect(numberOfCreatedProducts).toBe(0)

      const newProduct = await prismaTest.product.findUnique({
        where: { id: newProductId },
        include: { informations: { include: { materials: true, accessories: true } } },
      })

      expect(newProduct).not.toBeNull()
      expect(newProduct?.status).toBe(Status.Error)
      expect(newProduct?.error).toBe("Un produit avec le même GTIN a été déclaré trop récemment")
    })

    it("creates products if modification is too recent but in error", async () => {
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)

      await prismaTest.product.create({
        data: {
          ...baseProduct,
          id: uuid(),
          gtins: ["1111111111111"],
          hash: "hash-1",
          internalReference: "ORIGINAL-REF",
          createdAt: lastMonth,
          status: Status.Error,
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
            hash: "new-hash",
            id: newProductId,
            createdAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 1,
            status: Status.Pending,
            gtins: ["1111111111111"],
            internalReference: "UPDATED-REF",
            brandName: null,
            brandId: BRAND_ID_1,
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
      expect(newProduct?.status).toBe(Status.Pending)
      expect(newProduct?.error).toBeNull()
    })

    it("creates products in error if modification is too recent but in error and done", async () => {
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)

      const twoMonths = new Date()
      twoMonths.setMonth(twoMonths.getMonth() - 2)

      await prismaTest.product.create({
        data: {
          ...baseProduct,
          id: uuid(),
          gtins: ["1111111111111"],
          hash: "hash-1",
          internalReference: "ORIGINAL-REF",
          createdAt: lastMonth,
          status: Status.Error,
        },
      })
      await prismaTest.product.create({
        data: {
          ...baseProduct,
          id: uuid(),
          gtins: ["1111111111111"],
          hash: "hash-2",
          internalReference: "ORIGINAL-REF",
          createdAt: twoMonths,
          status: Status.Done,
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
            hash: "new-hash",
            id: newProductId,
            createdAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 1,
            status: Status.Pending,
            gtins: ["1111111111111"],
            internalReference: "UPDATED-REF",
            brandName: null,
            brandId: BRAND_ID_1,
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

      expect(numberOfCreatedProducts).toBe(0)

      const newProduct = await prismaTest.product.findUnique({
        where: { id: newProductId },
        include: { informations: { include: { materials: true, accessories: true } } },
      })

      expect(newProduct).not.toBeNull()
      expect(newProduct?.status).toBe(Status.Error)
      expect(newProduct?.error).toBe("Un produit avec le même GTIN a été déclaré trop récemment")
    })

    it("creates products in error if modification one gtin is too recent", async () => {
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)

      const fiveMonths = new Date()
      fiveMonths.setMonth(fiveMonths.getMonth() - 5)

      await prismaTest.product.create({
        data: {
          ...baseProduct,
          id: uuid(),
          gtins: ["1111111111111"],
          hash: "hash-1",
          internalReference: "ORIGINAL-REF",
          createdAt: lastMonth,
        },
      })
      await prismaTest.product.create({
        data: {
          ...baseProduct,
          id: uuid(),
          gtins: ["2222222222222"],
          hash: "hash-2",
          internalReference: "ORIGINAL-REF",
          createdAt: fiveMonths,
          status: Status.Done,
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
            hash: "new-hash",
            id: newProductId,
            createdAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 1,
            status: Status.Pending,
            gtins: ["2222222222222", "1111111111111"],
            internalReference: "UPDATED-REF",
            brandName: null,
            brandId: BRAND_ID_1,
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

      expect(numberOfCreatedProducts).toBe(0)

      const newProduct = await prismaTest.product.findUnique({
        where: { id: newProductId },
        include: { informations: { include: { materials: true, accessories: true } } },
      })

      expect(newProduct).not.toBeNull()
      expect(newProduct?.status).toBe(Status.Error)
      expect(newProduct?.error).toBe("Un produit avec le même GTIN a été déclaré trop récemment")
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
            brandId: BRAND_ID_1,
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

    it("compares hash with the latest done product version", async () => {
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
          internalReference: "OLD-DONE-VERSION",
          createdAt: new Date("2025-01-01"),
          status: Status.Done,
        },
      })

      const latestProductId = uuid()
      await prismaTest.product.create({
        data: {
          ...baseProduct,
          id: latestProductId,
          gtins: [gtin],
          hash: latestHash,
          internalReference: "LATEST-ERROR-VERSION",
          createdAt: new Date("2025-03-01"),
          status: Status.Error,
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
            brandId: BRAND_ID_1,
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

      expect(numberOfCreatedProducts).toBe(0)

      const newProduct = await prismaTest.product.findUnique({
        where: { id: newProductId },
      })
      expect(newProduct).toBeNull()

      const uploadProduct = await prismaTest.uploadProduct.findFirst({
        where: {
          uploadId: testUploadId,
          productId: oldProductId,
        },
      })
      expect(uploadProduct).not.toBeNull()
      expect(uploadProduct?.uploadOrder).toBe(1)
    })

    it("sets all products with any duplicated GTINs in batch to error", async () => {
      const gtinA = "5555555555555"
      const gtinB = "6666666666666"
      const gtinC = "7777777777777"
      const gtinD = "8888888888888"
      const productId1 = uuid()
      const productId2 = uuid()
      const productId3 = uuid()
      const productId4 = uuid()
      const encrypted = encryptProductFields({
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
      } satisfies ProductInformationAPI)

      await createProducts({
        products: [
          {
            error: null,
            hash: "hash-1",
            id: productId1,
            createdAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 1,
            status: Status.Pending,
            gtins: [gtinA, gtinB],
            internalReference: "DUP-REF-1",
            brandName: null,
            brandId: BRAND_ID_1,
            declaredScore: 1000.0,
            score: null,
            standardized: null,
          },
          {
            error: null,
            hash: "hash-2",
            id: productId2,
            createdAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 2,
            status: Status.Pending,
            gtins: [gtinB, gtinC],
            internalReference: "DUP-REF-2",
            brandName: null,
            brandId: BRAND_ID_1,
            declaredScore: 1000.0,
            score: null,
            standardized: null,
          },
          {
            error: null,
            hash: "hash-3",
            id: productId3,
            createdAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 3,
            status: Status.Pending,
            gtins: [gtinD],
            internalReference: "UNIQ-REF-3",
            brandName: null,
            brandId: BRAND_ID_1,
            declaredScore: 1000.0,
            score: null,
            standardized: null,
          },
          {
            error: null,
            hash: "hash-4",
            id: productId4,
            createdAt: new Date(),
            uploadId: testUploadId,
            uploadOrder: 4,
            status: Status.Pending,
            gtins: [gtinC],
            internalReference: "DUP-REF-4",
            brandName: null,
            brandId: BRAND_ID_1,
            declaredScore: 1000.0,
            score: null,
            standardized: null,
          },
        ],
        informations: [
          { id: "info-1", productId: productId1, ...encrypted.product, emptyTrims: false },
          { id: "info-2", productId: productId2, ...encrypted.product, emptyTrims: false },
          { id: "info-3", productId: productId3, ...encrypted.product, emptyTrims: false },
          { id: "info-4", productId: productId4, ...encrypted.product, emptyTrims: false },
        ],
        materials: [],
        accessories: [],
      })

      const prod1 = await prismaTest.product.findUnique({ where: { id: productId1 } })
      expect(prod1?.status).toBe(Status.Error)
      expect(prod1?.error).toBe("GTIN dupliqué dans le fichier")

      const prod2 = await prismaTest.product.findUnique({ where: { id: productId2 } })
      expect(prod2?.status).toBe(Status.Error)
      expect(prod2?.error).toBe("GTIN dupliqué dans le fichier")

      const prod3 = await prismaTest.product.findUnique({ where: { id: productId3 } })
      expect(prod3?.status).toBe(Status.Pending)
      expect(prod3?.error).toBe(null)

      const prod4 = await prismaTest.product.findUnique({ where: { id: productId4 } })
      expect(prod4?.status).toBe(Status.Error)
      expect(prod4?.error).toBe("GTIN dupliqué dans le fichier")
    })
  })

  describe("countPublicProductsByBrandId", () => {
    it("counts all products for a brand", async () => {
      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["1001"],
            internalReference: "REF-001",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now()),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["1002"],
            internalReference: "REF-002",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now() + 1000),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-3",
            gtins: ["1003"],
            internalReference: "REF-003",
            brandId: BRAND_ID_2,
            createdAt: new Date(Date.now() + 2000),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const count = await countPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, undefined)
      expect(count).toBe(2)
    })

    it("counts products filtered by category", async () => {
      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["2001"],
            internalReference: "REF-201",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["2002"],
            internalReference: "REF-202",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: {
              create: encryptProductFields({ ...BASE_PRODUCT, product: ProductCategory.TShirtPolo }).product,
            },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-3",
            gtins: ["2003"],
            internalReference: "REF-203",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const pullCount = await countPublicProductsByBrandId(
        BRAND_ID_1,
        ProductCategory.Pull,
        undefined,
        undefined,
        undefined,
      )
      expect(pullCount).toBe(2)

      const tShirtCount = await countPublicProductsByBrandId(
        BRAND_ID_1,
        ProductCategory.TShirtPolo,
        undefined,
        undefined,
        undefined,
      )
      expect(tShirtCount).toBe(1)
    })

    it("counts products filtered by organization", async () => {
      const otherUpload = await prismaTest.upload.create({
        data: {
          version: "test-version-2",
          type: "API",
          name: "test2.csv",
          createdById: testUserId,
          organizationId: OTHER_ORG_ID,
          createdAt: new Date(),
        },
      })

      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["3001"],
            internalReference: "REF-301",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: otherUpload.id,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["3002"],
            internalReference: "REF-302",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const countAllOrgs = await countPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, undefined)
      expect(countAllOrgs).toBe(2)

      const countTestOrg = await countPublicProductsByBrandId(
        BRAND_ID_1,
        undefined,
        testOrganizationId,
        undefined,
        undefined,
      )
      expect(countTestOrg).toBe(1)

      const countOtherOrg = await countPublicProductsByBrandId(
        BRAND_ID_1,
        undefined,
        OTHER_ORG_ID,
        undefined,
        undefined,
      )
      expect(countOtherOrg).toBe(1)
    })

    it("counts products filtered by dates", async () => {
      const date1 = new Date("2025-01-01")
      const date2 = new Date("2025-02-01")
      const date3 = new Date("2025-03-01")

      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["4001"],
            internalReference: "REF-401",
            brandId: BRAND_ID_1,
            createdAt: date1,
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["4002"],
            internalReference: "REF-402",
            brandId: BRAND_ID_1,
            createdAt: date2,
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-3",
            gtins: ["4003"],
            internalReference: "REF-403",
            brandId: BRAND_ID_1,
            createdAt: date3,
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const countAll = await countPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, undefined)
      expect(countAll).toBe(3)

      const countBefore = await countPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, date2)
      expect(countBefore).toBe(2)

      const countAfter = await countPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, date2, undefined)
      expect(countAfter).toBe(2)

      const countBetween = await countPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, date1, date3)
      expect(countBetween).toBe(3)
    })

    it("counts only Done status products", async () => {
      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["5001"],
            internalReference: "REF-501",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Pending,
            hash: "hash-2",
            gtins: ["5002"],
            internalReference: "REF-502",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Error,
            hash: "hash-3",
            gtins: ["5003"],
            internalReference: "REF-503",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const count = await countPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, undefined)
      expect(count).toBe(1)
    })

    it("counts distinct internal references", async () => {
      const ref1 = "REF-601"
      const ref2 = "REF-602"

      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["6001"],
            internalReference: ref1,
            brandId: BRAND_ID_1,
            createdAt: new Date("2025-01-01"),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["6002"],
            internalReference: ref1,
            brandId: BRAND_ID_1,
            createdAt: new Date("2025-02-01"),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-3",
            gtins: ["6003"],
            internalReference: ref2,
            brandId: BRAND_ID_1,
            createdAt: new Date("2025-03-01"),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const count = await countPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, undefined)
      expect(count).toBe(2)
    })

    it("returns 0 when no products found", async () => {
      const count = await countPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, undefined)
      expect(count).toBe(0)
    })

    it("returns 0 for non-existent brand", async () => {
      await prismaTest.product.create({
        data: {
          id: uuid(),
          uploadId: testUploadId,
          status: Status.Done,
          hash: "hash-1",
          gtins: ["7001"],
          internalReference: "REF-701",
          brandId: BRAND_ID_1,
          createdAt: new Date(),
          informations: { create: encryptProductFields(BASE_PRODUCT).product },
        },
      })

      const count = await countPublicProductsByBrandId(uuid(), undefined, undefined, undefined, undefined)
      expect(count).toBe(0)
    })

    it("combines multiple filters correctly", async () => {
      const date1 = new Date("2025-01-01")
      const date2 = new Date("2025-02-01")
      const date3 = new Date("2025-03-01")

      const otherUpload = await prismaTest.upload.create({
        data: {
          version: "test-version-3",
          type: "API",
          name: "test3.csv",
          createdById: testUserId,
          organizationId: OTHER_ORG_ID,
          createdAt: new Date(),
        },
      })

      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["8001"],
            internalReference: "REF-801",
            brandId: BRAND_ID_1,
            createdAt: date2,
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),

        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["8002"],
            internalReference: "REF-802",
            brandId: BRAND_ID_1,
            createdAt: date2,
            informations: {
              create: encryptProductFields({ ...BASE_PRODUCT, product: ProductCategory.TShirtPolo }).product,
            },
          },
        }),

        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: otherUpload.id,
            status: Status.Done,
            hash: "hash-3",
            gtins: ["8003"],
            internalReference: "REF-803",
            brandId: BRAND_ID_1,
            createdAt: date2,
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),

        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-4",
            gtins: ["8004"],
            internalReference: "REF-804",
            brandId: BRAND_ID_1,
            createdAt: date3,
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const count = await countPublicProductsByBrandId(
        BRAND_ID_1,
        ProductCategory.Pull,
        testOrganizationId,
        date1,
        date2,
      )
      expect(count).toBe(1)
    })
  })

  describe("getPublicProductsByBrandId", () => {
    it("returns products for a brand with pagination", async () => {
      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["1001"],
            internalReference: "REF-001",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now()),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["1002"],
            internalReference: "REF-002",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now() + 1000),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-3",
            gtins: ["1003"],
            internalReference: "REF-003",
            brandId: BRAND_ID_2,
            createdAt: new Date(Date.now() + 2000),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const products = await getPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, undefined, 1)
      expect(products).toHaveLength(2)
      expect(products[0].internalReference).toBe("REF-002")
      expect(products[1].internalReference).toBe("REF-001")
    })

    it("returns products filtered by category", async () => {
      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["2001"],
            internalReference: "REF-201",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["2002"],
            internalReference: "REF-202",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: {
              create: encryptProductFields({ ...BASE_PRODUCT, product: ProductCategory.TShirtPolo }).product,
            },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-3",
            gtins: ["2003"],
            internalReference: "REF-203",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const pullProducts = await getPublicProductsByBrandId(
        BRAND_ID_1,
        ProductCategory.Pull,
        undefined,
        undefined,
        undefined,
        1,
      )
      expect(pullProducts).toHaveLength(2)
      expect(pullProducts.every((p) => p.informations[0].categorySlug === ProductCategory.Pull)).toBe(true)

      const tShirtProducts = await getPublicProductsByBrandId(
        BRAND_ID_1,
        ProductCategory.TShirtPolo,
        undefined,
        undefined,
        undefined,
        1,
      )
      expect(tShirtProducts).toHaveLength(1)
      expect(tShirtProducts[0].internalReference).toBe("REF-202")
    })

    it("returns products filtered by organization", async () => {
      const otherUpload = await prismaTest.upload.create({
        data: {
          version: "test-version-2",
          type: "API",
          name: "test2.csv",
          createdById: testUserId,
          organizationId: OTHER_ORG_ID,
          createdAt: new Date(),
        },
      })

      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["3001"],
            internalReference: "REF-301",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: otherUpload.id,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["3002"],
            internalReference: "REF-302",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const productsTestOrg = await getPublicProductsByBrandId(
        BRAND_ID_1,
        undefined,
        testOrganizationId,
        undefined,
        undefined,
        1,
      )
      expect(productsTestOrg).toHaveLength(1)
      expect(productsTestOrg[0].internalReference).toBe("REF-301")

      const productsOtherOrg = await getPublicProductsByBrandId(
        BRAND_ID_1,
        undefined,
        OTHER_ORG_ID,
        undefined,
        undefined,
        1,
      )
      expect(productsOtherOrg).toHaveLength(1)
      expect(productsOtherOrg[0].internalReference).toBe("REF-302")
    })

    it("returns products filtered by dates", async () => {
      const date1 = new Date("2025-01-01")
      const date2 = new Date("2025-02-01")
      const date3 = new Date("2025-03-01")

      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["4001"],
            internalReference: "REF-401",
            brandId: BRAND_ID_1,
            createdAt: date1,
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["4002"],
            internalReference: "REF-402",
            brandId: BRAND_ID_1,
            createdAt: date2,
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-3",
            gtins: ["4003"],
            internalReference: "REF-403",
            brandId: BRAND_ID_1,
            createdAt: date3,
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const allProducts = await getPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, undefined, 1)
      expect(allProducts).toHaveLength(3)

      const productsBefore = await getPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, date2, 1)
      expect(productsBefore).toHaveLength(2)

      const productsAfter = await getPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, date2, undefined, 1)
      expect(productsAfter).toHaveLength(2)

      const productsBetween = await getPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, date1, date3, 1)
      expect(productsBetween).toHaveLength(3)
    })

    it("returns only Done status products", async () => {
      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["5001"],
            internalReference: "REF-501",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Pending,
            hash: "hash-2",
            gtins: ["5002"],
            internalReference: "REF-502",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Error,
            hash: "hash-3",
            gtins: ["5003"],
            internalReference: "REF-503",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const products = await getPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, undefined, 1)
      expect(products).toHaveLength(1)
      expect(products[0].internalReference).toBe("REF-501")
    })

    it("returns distinct internal references", async () => {
      const ref1 = "REF-601"
      const ref2 = "REF-602"

      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["6001"],
            internalReference: ref1,
            brandId: BRAND_ID_1,
            createdAt: new Date("2025-01-01"),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["6002"],
            internalReference: ref1,
            brandId: BRAND_ID_1,
            createdAt: new Date("2025-02-01"),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-3",
            gtins: ["6003"],
            internalReference: ref2,
            brandId: BRAND_ID_1,
            createdAt: new Date("2025-03-01"),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const products = await getPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, undefined, 1)
      expect(products).toHaveLength(2)
      expect(products[0].internalReference).toBe(ref2)
      expect(products[1].internalReference).toBe(ref1)
    })

    it("returns empty array when no products found", async () => {
      const products = await getPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, undefined, 1)
      expect(products).toEqual([])
    })

    it("returns empty array for non-existent brand", async () => {
      await prismaTest.product.create({
        data: {
          id: uuid(),
          uploadId: testUploadId,
          status: Status.Done,
          hash: "hash-1",
          gtins: ["7001"],
          internalReference: "REF-701",
          brandId: BRAND_ID_1,
          createdAt: new Date(),
          informations: { create: encryptProductFields(BASE_PRODUCT).product },
        },
      })

      const products = await getPublicProductsByBrandId(uuid(), undefined, undefined, undefined, undefined, 1)
      expect(products).toEqual([])
    })

    it("handles pagination correctly", async () => {
      const productIds = Array.from({ length: 15 }, (_, i) => {
        const refNum = 800 + i
        return {
          id: uuid(),
          internalReference: `REF-${refNum}`,
          gtins: [`${8000 + i}`],
          hash: `hash-${i}`,
          createdAt: new Date(Date.now() + i * 1000),
        }
      })

      await Promise.all(
        productIds.map((p) =>
          prismaTest.product.create({
            data: {
              id: p.id,
              uploadId: testUploadId,
              status: Status.Done,
              hash: p.hash,
              gtins: p.gtins,
              internalReference: p.internalReference,
              brandId: BRAND_ID_1,
              createdAt: p.createdAt,
              informations: { create: encryptProductFields(BASE_PRODUCT).product },
            },
          }),
        ),
      )

      const page1 = await getPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, undefined, 1)
      expect(page1).toHaveLength(10)
      expect(page1[0].internalReference).toBe("REF-814")

      const page2 = await getPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, undefined, 2)
      expect(page2).toHaveLength(5)
      expect(page2[0].internalReference).toBe("REF-804")

      const page3 = await getPublicProductsByBrandId(BRAND_ID_1, undefined, undefined, undefined, undefined, 3)
      expect(page3).toEqual([])
    })

    it("combines multiple filters correctly", async () => {
      const date1 = new Date("2025-01-01")
      const date2 = new Date("2025-02-01")
      const date3 = new Date("2025-03-01")

      const otherUpload = await prismaTest.upload.create({
        data: {
          version: "test-version-3",
          type: "API",
          name: "test3.csv",
          createdById: testUserId,
          organizationId: OTHER_ORG_ID,
          createdAt: new Date(),
        },
      })

      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["8001"],
            internalReference: "REF-801",
            brandId: BRAND_ID_1,
            createdAt: date2,
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),

        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["8002"],
            internalReference: "REF-802",
            brandId: BRAND_ID_1,
            createdAt: date2,
            informations: {
              create: encryptProductFields({ ...BASE_PRODUCT, product: ProductCategory.TShirtPolo }).product,
            },
          },
        }),

        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: otherUpload.id,
            status: Status.Done,
            hash: "hash-3",
            gtins: ["8003"],
            internalReference: "REF-803",
            brandId: BRAND_ID_1,
            createdAt: date2,
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),

        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-4",
            gtins: ["8004"],
            internalReference: "REF-804",
            brandId: BRAND_ID_1,
            createdAt: date3,
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const products = await getPublicProductsByBrandId(
        BRAND_ID_1,
        ProductCategory.Pull,
        testOrganizationId,
        date1,
        date2,
        1,
      )
      expect(products).toHaveLength(1)
      expect(products[0].internalReference).toBe("REF-801")
    })
  })

  describe("getLatestProductsByBrandIdForExport", () => {
    it("returns latest products for a brand", async () => {
      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["1001"],
            internalReference: "REF-001",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now()),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["1002"],
            internalReference: "REF-002",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now() + 1000),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-3",
            gtins: ["1003"],
            internalReference: "REF-003",
            brandId: BRAND_ID_2,
            createdAt: new Date(Date.now() + 2000),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const products = await getLatestProductsByBrandIdForExport(BRAND_ID_1, undefined, undefined)
      expect(products).toHaveLength(2)
      expect(products[0].internalReference).toBe("REF-001")
      expect(products[1].internalReference).toBe("REF-002")
    })

    it("returns products filtered by category", async () => {
      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["2001"],
            internalReference: "REF-201",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now()),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["2002"],
            internalReference: "REF-202",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now() + 1000),
            informations: {
              create: encryptProductFields({ ...BASE_PRODUCT, product: ProductCategory.TShirtPolo }).product,
            },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-3",
            gtins: ["2003"],
            internalReference: "REF-203",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now() + 2000),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const pullProducts = await getLatestProductsByBrandIdForExport(BRAND_ID_1, "pull", undefined)
      expect(pullProducts).toHaveLength(2)
      expect(pullProducts.every((p) => p.informations[0].categorySlug === ProductCategory.Pull)).toBe(true)

      const tShirtProducts = await getLatestProductsByBrandIdForExport(BRAND_ID_1, "tshirtpolo", undefined)
      expect(tShirtProducts).toHaveLength(1)
      expect(tShirtProducts[0].internalReference).toBe("REF-202")
    })

    it("returns products filtered by organization", async () => {
      const otherUpload = await prismaTest.upload.create({
        data: {
          version: "test-version-2",
          type: "API",
          name: "test2.csv",
          createdById: testUserId,
          organizationId: OTHER_ORG_ID,
          createdAt: new Date(),
        },
      })

      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["3001"],
            internalReference: "REF-301",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now()),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: otherUpload.id,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["3002"],
            internalReference: "REF-302",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now() + 1000),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const productsTestOrg = await getLatestProductsByBrandIdForExport(BRAND_ID_1, undefined, testOrganizationId)
      expect(productsTestOrg).toHaveLength(1)
      expect(productsTestOrg[0].internalReference).toBe("REF-301")

      const productsOtherOrg = await getLatestProductsByBrandIdForExport(BRAND_ID_1, undefined, OTHER_ORG_ID)
      expect(productsOtherOrg).toHaveLength(1)
      expect(productsOtherOrg[0].internalReference).toBe("REF-302")
    })

    it("returns only latest version for each internal reference", async () => {
      const ref = "REF-601"

      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["6001"],
            internalReference: ref,
            brandId: BRAND_ID_1,
            createdAt: new Date("2025-01-01"),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["6002"],
            internalReference: ref,
            brandId: BRAND_ID_1,
            createdAt: new Date("2025-02-01"),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-3",
            gtins: ["6003"],
            internalReference: ref,
            brandId: BRAND_ID_1,
            createdAt: new Date("2025-03-01"),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const products = await getLatestProductsByBrandIdForExport(BRAND_ID_1, undefined, undefined)
      expect(products).toHaveLength(1)
      expect(products[0].internalReference).toBe(ref)
      expect(products[0].gtins).toContain("6003")
    })

    it("returns empty array when no products found", async () => {
      const products = await getLatestProductsByBrandIdForExport(BRAND_ID_1, undefined, undefined)
      expect(products).toEqual([])
    })

    it("returns empty array for non-existent brand", async () => {
      await prismaTest.product.create({
        data: {
          id: uuid(),
          uploadId: testUploadId,
          status: Status.Done,
          hash: "hash-1",
          gtins: ["7001"],
          internalReference: "REF-701",
          brandId: BRAND_ID_1,
          createdAt: new Date(),
          informations: { create: encryptProductFields(BASE_PRODUCT).product },
        },
      })

      const products = await getLatestProductsByBrandIdForExport(uuid(), undefined, undefined)
      expect(products).toEqual([])
    })

    it("returns empty array for non-existent category", async () => {
      await prismaTest.product.create({
        data: {
          id: uuid(),
          uploadId: testUploadId,
          status: Status.Done,
          hash: "hash-1",
          gtins: ["2001"],
          internalReference: "REF-201",
          brandId: BRAND_ID_1,
          createdAt: new Date(),
          informations: { create: encryptProductFields(BASE_PRODUCT).product },
        },
      })

      const products = await getLatestProductsByBrandIdForExport(BRAND_ID_1, "tshirtpolo", undefined)
      expect(products).toEqual([])
    })

    it("returns only Done status products", async () => {
      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["5001"],
            internalReference: "REF-501",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Pending,
            hash: "hash-2",
            gtins: ["5002"],
            internalReference: "REF-502",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now() + 1000),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Error,
            hash: "hash-3",
            gtins: ["5003"],
            internalReference: "REF-503",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now() + 2000),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const products = await getLatestProductsByBrandIdForExport(BRAND_ID_1, undefined, undefined)
      expect(products).toHaveLength(1)
      expect(products[0].internalReference).toBe("REF-501")
    })

    it("combines multiple filters correctly", async () => {
      const otherUpload = await prismaTest.upload.create({
        data: {
          version: "test-version-3",
          type: "API",
          name: "test3.csv",
          createdById: testUserId,
          organizationId: OTHER_ORG_ID,
          createdAt: new Date(),
        },
      })

      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-1",
            gtins: ["8001"],
            internalReference: "REF-801",
            brandId: BRAND_ID_1,
            createdAt: new Date(),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),

        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-2",
            gtins: ["8002"],
            internalReference: "REF-802",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now() + 1000),
            informations: {
              create: encryptProductFields({ ...BASE_PRODUCT, product: ProductCategory.TShirtPolo }).product,
            },
          },
        }),

        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: otherUpload.id,
            status: Status.Done,
            hash: "hash-3",
            gtins: ["8003"],
            internalReference: "REF-803",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now() + 2000),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),

        prismaTest.product.create({
          data: {
            id: uuid(),
            uploadId: testUploadId,
            status: Status.Done,
            hash: "hash-4",
            gtins: ["8004"],
            internalReference: "REF-804",
            brandId: BRAND_ID_1,
            createdAt: new Date(Date.now() + 3000),
            informations: { create: encryptProductFields(BASE_PRODUCT).product },
          },
        }),
      ])

      const products = await getLatestProductsByBrandIdForExport(BRAND_ID_1, "pull", testOrganizationId)

      expect(products).toHaveLength(2)
      expect(products[0].internalReference).toBe("REF-801")
      expect(products[1].internalReference).toBe("REF-804")
    })
  })
})
