import { v4 as uuid } from "uuid"
import { prismaTest } from "../../jest.setup"
import { Status } from "@prisma/enums"
import * as productDb from "./product"

jest.mock("./prismaClient", () => ({
  prismaClient: prismaTest,
}))

import { getAllBrandsWithStats, getBrandById, getBrandWithProducts } from "./brands"
import { cleanDB } from "./testUtils"

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

  it("getBrandWithProducts calls getPublicProductsByBrandId with brand id", async () => {
    const mockedProducts = [
      { id: "p1", internalReference: "B-REF-1" },
      { id: "p2", internalReference: "B-REF-2" },
    ]

    const spy = jest.spyOn(productDb, "getPublicProductsByBrandId").mockResolvedValue(mockedProducts as any)

    const result = await getBrandWithProducts(brandA.id)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(brandA.id)
    expect(result).not.toBeNull()
    expect(result?.brand).toEqual({ id: brandA.id, name: brandA.name })
    expect(result?.products).toEqual(mockedProducts)
  })
})
