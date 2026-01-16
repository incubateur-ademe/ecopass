import { v4 as uuid } from "uuid"
import { prismaTest } from "../../jest.setup"
import { Status } from "@prisma/enums"

jest.mock("./prismaClient", () => ({
  prismaClient: prismaTest,
}))

import { getAllBrandsWithStats, getBrandById, getBrandWithProducts } from "./brands"
import { cleanDB } from "./testUtils"
import { Business, ProductCategory } from "../types/Product"
import { encryptProductFields } from "../utils/encryption/encryption"

describe("Brands DB", () => {
  let orgId: string
  let brandA: { id: string; name: string }
  let brandB: { id: string; name: string }
  let testUserId: string
  let testUploadId: string

  beforeAll(async () => {
    await cleanDB()

    const org = await prismaTest.organization.create({
      data: { name: "Org", displayName: "Org", siret: "12345678901234" },
    })
    orgId = org.id

    const brands = await prismaTest.brand.createManyAndReturn({
      data: [
        { name: "Brand A", organizationId: orgId, active: true },
        { name: "Brand B", organizationId: orgId, active: false },
      ],
    })

    brandA = brands[0]
    brandB = brands[1]

    const user = await prismaTest.user.create({
      data: { email: "brands-test@example.com", organizationId: orgId },
    })
    testUserId = user.id

    const upload = await prismaTest.upload.create({
      data: {
        version: "test-version",
        type: "API",
        name: "brands-test.csv",
        createdById: testUserId,
        organizationId: orgId,
        createdAt: new Date(),
      },
    })
    testUploadId = upload.id
  })

  afterAll(async () => {
    await cleanDB()
  })

  beforeEach(async () => {
    await prismaTest.score.deleteMany()
    await prismaTest.productInformation.deleteMany()
    await prismaTest.uploadProduct.deleteMany()
    await prismaTest.product.deleteMany()
  })

  it("getAllBrandsWithStats groups by brand + internalReference and sorts by lastDeclarationDate", async () => {
    const now = new Date()
    const earlier = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const muchEarlier = new Date(now.getTime() - 48 * 60 * 60 * 1000)

    // Brand A: 3 products, but 2 have same internalReference -> count as 2
    // Brand B: 2 products, but 1 error -> count as 1
    await prismaTest.product.createMany({
      data: [
        {
          id: uuid(),
          status: Status.Done,
          hash: "h1",
          gtins: ["111"],
          internalReference: "REF-X",
          brandId: brandA.id,
          createdAt: now,
          uploadId: testUploadId,
        },
        {
          id: uuid(),
          status: Status.Done,
          hash: "h2",
          gtins: ["112"],
          internalReference: "REF-X",
          brandId: brandA.id,
          createdAt: earlier,
          uploadId: testUploadId,
        },
        {
          id: uuid(),
          status: Status.Done,
          hash: "h3",
          gtins: ["113"],
          internalReference: "REF-Y",
          brandId: brandA.id,
          createdAt: muchEarlier,
          uploadId: testUploadId,
        },
        {
          id: uuid(),
          status: Status.Done,
          hash: "h4",
          gtins: ["114"],
          internalReference: "REF-X",
          brandId: brandB.id,
          createdAt: earlier,
          uploadId: testUploadId,
        },
        {
          id: uuid(),
          status: Status.Pending,
          hash: "h5",
          gtins: ["115"],
          internalReference: "REF-Z",
          brandId: brandB.id,
          createdAt: now,
          uploadId: testUploadId,
        },
      ],
    })

    const stats = await getAllBrandsWithStats()

    const a = stats.find((s) => s.id === brandA.id)
    const b = stats.find((s) => s.id === brandB.id)

    expect(a?.productCount).toBe(2)
    expect(a?.lastDeclarationDate.getTime()).toBe(now.getTime())

    expect(b?.productCount).toBe(1)
    expect(b?.lastDeclarationDate.getTime()).toBe(earlier.getTime())

    expect(stats[0].id).toBe(brandA.id)
    expect(stats[1].id).toBe(brandB.id)
  })

  it("getBrandById returns brand info", async () => {
    const brand = await getBrandById(brandA.id)
    expect(brand).toEqual({ id: brandA.id, name: brandA.name })
  })

  it("getBrandWithProducts returns brand with total product count by category", async () => {
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
    })

    await Promise.all([
      prismaTest.product.create({
        data: {
          status: Status.Done,
          hash: "h-tshirt-1",
          gtins: ["TSH001"],
          internalReference: "TSHIRT-001",
          brandId: brandA.id,
          createdAt: new Date(),
          uploadId: testUploadId,
          informations: {
            create: [
              {
                ...encrypted.product,
                categorySlug: ProductCategory.TShirtPolo,
              },
            ],
          },
        },
      }),
      prismaTest.product.create({
        data: {
          status: Status.Done,
          hash: "h-tshirt-2",
          gtins: ["TSH002"],
          internalReference: "TSHIRT-001",
          brandId: brandA.id,
          createdAt: new Date(),
          uploadId: testUploadId,
          informations: {
            create: [
              {
                ...encrypted.product,
                categorySlug: ProductCategory.TShirtPolo,
              },
            ],
          },
        },
      }),
      prismaTest.product.create({
        data: {
          status: Status.Error,
          hash: "h-tshirt-3",
          gtins: ["TSH003"],
          internalReference: "TSHIRT-003",
          brandId: brandA.id,
          createdAt: new Date(),
          uploadId: testUploadId,
          informations: {
            create: [
              {
                ...encrypted.product,
                categorySlug: ProductCategory.TShirtPolo,
              },
            ],
          },
        },
      }),
      prismaTest.product.create({
        data: {
          status: Status.Done,
          hash: "h-jeans-1",
          gtins: ["JEANS001"],
          internalReference: "JEANS-001",
          brandId: brandA.id,
          createdAt: new Date(),
          uploadId: testUploadId,
          informations: {
            create: [
              {
                ...encrypted.product,
                categorySlug: ProductCategory.Jean,
              },
            ],
          },
        },
      }),
      prismaTest.product.create({
        data: {
          status: Status.Done,
          hash: "h-jeans-2",
          gtins: ["JEANS002"],
          internalReference: "JEANS-002",
          brandId: brandA.id,
          createdAt: new Date(),
          uploadId: testUploadId,
          informations: {
            create: [
              {
                ...encrypted.product,
                categorySlug: ProductCategory.Jean,
              },
            ],
          },
        },
      }),
      prismaTest.product.create({
        data: {
          status: Status.Done,
          hash: "h-jacket-1",
          gtins: ["JACKET001"],
          internalReference: "JACKET-001",
          brandId: brandA.id,
          createdAt: new Date(),
          uploadId: testUploadId,
          informations: {
            create: [
              {
                ...encrypted.product,
                categorySlug: ProductCategory.ManteauVeste,
              },
            ],
          },
        },
      }),
    ])

    const result = await getBrandWithProducts(brandA.id)

    expect(result).not.toBeNull()
    expect(result?.id).toEqual(brandA.id)
    expect(result?.name).toEqual(brandA.name)
    expect(result?.productsByCategory.reduce((acc, curr) => acc + curr.count, 0)).toBe(4)
    expect(result?.productsByCategory[0]).toEqual({
      slug: ProductCategory.Jean,
      count: 2,
    })
    expect(result?.productsByCategory[1]).toEqual({
      slug: ProductCategory.ManteauVeste,
      count: 1,
    })
    expect(result?.productsByCategory[2]).toEqual({
      slug: ProductCategory.TShirtPolo,
      count: 1,
    })
  })
})
