import { v4 as uuid } from "uuid"
import { Prisma, Status } from "../../prisma/src/prisma"
import { prismaTest } from "../../jest.setup"
jest.mock("./prismaClient", () => ({
  prismaClient: prismaTest,
}))

import { encryptProductFields } from "./encryption"
import {
  createProducts,
  failProducts,
  getOrganizationProductsCountByUserIdAndBrand,
  getProductsByUploadId,
} from "./product"
import { AccessoryType, Business, MaterialType, ProductCategory } from "../types/Product"
import { ProductAPIValidation } from "../services/validation/api"
import { cleanDB } from "./testUtils"

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
})
