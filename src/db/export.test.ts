import { Status } from "../../prisma/src/prisma"
import { prismaTest } from "../../jest.setup"
jest.mock("./prismaClient", () => ({
  prismaClient: prismaTest,
}))

import { createExport, getExportsByUserIdAndBrand, getFirstExport, completeExport, getExportByName } from "./export"
import { cleanDB } from "./testUtils"

describe("Export DB", () => {
  let testUserId: string
  let testOrganizationId: string

  beforeAll(async () => {
    await cleanDB()
    const organization = await prismaTest.organization.create({
      data: {
        name: "Test Organization",
        siret: "12345678901234",
      },
    })
    testOrganizationId = organization.id

    const user = await prismaTest.user.create({
      data: {
        email: "test@example.com",
        organizationId: testOrganizationId,
      },
    })
    testUserId = user.id
  })

  afterAll(async () => {
    await cleanDB()
  })

  beforeEach(async () => {
    await prismaTest.export.deleteMany()
  })

  describe("createExport", () => {
    it("should create an export without brand", async () => {
      const result = await createExport(testUserId)

      expect(result).toBeDefined()
      expect(result.userId).toBe(testUserId)
      expect(result.status).toBe(Status.Pending)
      expect(result.brand).toBeNull()
      expect(result.name).toMatch(/^affichage-environnemental-\d{4}-\d{2}-\d{2}T/)
      expect(result.createdAt).toBeInstanceOf(Date)
    })

    it("should create an export with brand", async () => {
      const brand = "Test Brand"
      const result = await createExport(testUserId, brand)

      expect(result).toBeDefined()
      expect(result.userId).toBe(testUserId)
      expect(result.status).toBe(Status.Pending)
      expect(result.brand).toBe(brand)
      expect(result.name).toMatch(/^affichage-environnemental-\d{4}-\d{2}-\d{2}T/)
    })
  })

  describe("getExportsByUserIdAndBrand", () => {
    it("should return exports from the last 30 days without brand filter", async () => {
      const export1 = await createExport(testUserId)
      const export2 = await createExport(testUserId)

      const oldDate = new Date()
      oldDate.setDate(oldDate.getDate() - 35)
      await prismaTest.export.create({
        data: {
          userId: testUserId,
          name: "old-export",
          status: Status.Pending,
          createdAt: oldDate,
        },
      })

      const result = await getExportsByUserIdAndBrand(testUserId)

      expect(result).toHaveLength(2)
      expect(result.map((e) => e.id)).toContain(export1.id)
      expect(result.map((e) => e.id)).toContain(export2.id)
    })

    it("should return exports filtered by brand", async () => {
      const brand1 = "Brand 1"
      const brand2 = "Brand 2"

      const export1 = await createExport(testUserId, brand1)
      await createExport(testUserId, brand2)
      const export3 = await createExport(testUserId, brand1)

      const result = await getExportsByUserIdAndBrand(testUserId, brand1)

      expect(result).toHaveLength(2)
      expect(result.map((e) => e.id)).toContain(export1.id)
      expect(result.map((e) => e.id)).toContain(export3.id)
    })

    it("should return empty array when no exports found", async () => {
      const result = await getExportsByUserIdAndBrand("non-existent-user")

      expect(result).toHaveLength(0)
    })

    it("should return exports without brand when brand filter is null", async () => {
      await createExport(testUserId)
      await createExport(testUserId, "Some Brand")

      const result = await getExportsByUserIdAndBrand(testUserId)

      expect(result).toHaveLength(1)
      expect(result[0].brand).toBeNull()
    })
  })

  describe("getFirstExport", () => {
    it("should return the oldest pending export with user organization", async () => {
      const export1 = await createExport(testUserId)
      await new Promise((resolve) => setTimeout(resolve, 10))
      const export2 = await createExport(testUserId)

      await prismaTest.export.update({
        where: { id: export2.id },
        data: { status: Status.Done },
      })

      const result = await getFirstExport()

      expect(result).toBeDefined()
      expect(result?.id).toBe(export1.id)
      expect(result?.status).toBe(Status.Pending)
      expect(result?.user).toBeDefined()
      expect(result?.user.organizationId).toBe(testOrganizationId)
    })

    it("should return null when no pending exports exist", async () => {
      const export1 = await createExport(testUserId)

      await prismaTest.export.update({
        where: { id: export1.id },
        data: { status: Status.Done },
      })

      const result = await getFirstExport()

      expect(result).toBeNull()
    })

    it("should return null when no exports exist", async () => {
      const result = await getFirstExport()

      expect(result).toBeNull()
    })
  })

  describe("completeExport", () => {
    it("should update export status to Done", async () => {
      const export1 = await createExport(testUserId)
      expect(export1.status).toBe(Status.Pending)

      await completeExport(export1.id)

      const exportUpdated = await prismaTest.export.findUnique({
        where: { id: export1.id },
      })

      expect(exportUpdated?.status).toBe(Status.Done)
      expect(exportUpdated?.id).toBe(export1.id)
    })

    it("should throw error when export doesn't exist", async () => {
      await expect(completeExport("non-existent-id")).rejects.toThrow()
    })
  })

  describe("getExportByName", () => {
    it("should return export by userId and name", async () => {
      const exportName = "test-export-name"
      await prismaTest.export.create({
        data: {
          userId: testUserId,
          name: exportName,
          status: Status.Pending,
        },
      })

      const result = await getExportByName(testUserId, exportName)

      expect(result).toBeDefined()
      expect(result?.name).toBe(exportName)
      expect(result?.userId).toBe(testUserId)
    })

    it("should return null when export not found", async () => {
      const result = await getExportByName(testUserId, "non-existent-name")

      expect(result).toBeNull()
    })

    it("should return null when export exists but for different user", async () => {
      const exportName = "test-export-name"
      await prismaTest.export.create({
        data: {
          userId: testUserId,
          name: exportName,
          status: Status.Pending,
        },
      })

      const result = await getExportByName("different-user", exportName)

      expect(result).toBeNull()
    })
  })
})
