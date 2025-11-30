import { v4 as uuid } from "uuid"
import { Status, UploadType } from "../../prisma/src/prisma"
import { prismaTest } from "../../jest.setup"

jest.mock("./prismaClient", () => ({
  prismaClient: prismaTest,
}))

jest.mock("../services/upload", () => ({
  completeUpload: jest.fn().mockResolvedValue(undefined),
  failUpload: jest.fn().mockResolvedValue(undefined),
}))

import {
  getUploadById,
  createUpload,
  updateUploadToDone,
  updateUploadToError,
  updateUploadToPending,
  getuploadsCountByUserId,
  getUploadsByUserId,
  checkUploadsStatus,
  getFirstFileUpload,
} from "./upload"
import { completeUpload, failUpload } from "../services/upload"
import { cleanDB } from "./testUtils"
import { ecobalyseVersion } from "../utils/ecobalyse/config"

describe("Upload DB integration", () => {
  let testUser: { id: string; organizationId: string | null }
  let testOrganizationId: string

  const baseProduct = {
    internalReference: "REF-124",
    brandId: "abf5acc4-fabc-4082-b49a-61b00b5cfcad",
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
            ],
          },
        },
      },
    })
    testOrganizationId = organization.id

    testUser = await prismaTest.user.create({
      data: {
        email: "test@example.com",
        organizationId: testOrganizationId,
      },
      select: { id: true, organizationId: true },
    })
  })

  afterAll(async () => {
    await cleanDB()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    await prismaTest.uploadProduct.deleteMany()
    await prismaTest.product.deleteMany()
    await prismaTest.upload.deleteMany()
  })

  describe("getUploadById", () => {
    it("should return upload by id", async () => {
      const uploadId = uuid()
      await prismaTest.upload.create({
        data: {
          id: uploadId,
          name: "test-upload.csv",
          type: UploadType.FILE,
          createdById: testUser.id,
          organizationId: testOrganizationId,
          version: ecobalyseVersion,
          status: Status.Pending,
        },
      })

      const result = await getUploadById(uploadId)

      expect(result).toBeDefined()
      expect(result?.id).toBe(uploadId)
      expect(result?.createdById).toBe(testUser.id)
      expect(result?.status).toBe(Status.Pending)
    })

    it("should return null for non-existent upload", async () => {
      const result = await getUploadById(uuid())
      expect(result).toBeNull()
    })
  })

  describe("createUpload", () => {
    it("should create upload successfully", async () => {
      const uploadName = "test-file.csv"
      const uploadId = uuid()

      const result = await createUpload(testUser.id, UploadType.FILE, uploadName, uploadId)

      expect(result).toBeDefined()
      expect(result.id).toBe(uploadId)
      expect(result.name).toBe(uploadName)
      expect(result.createdBy.email).toBe("test@example.com")

      const uploadInDb = await prismaTest.upload.findUnique({
        where: { id: uploadId },
      })
      expect(uploadInDb).toBeDefined()
      expect(uploadInDb?.type).toBe(UploadType.FILE)
      expect(uploadInDb?.version).toBe(ecobalyseVersion)
      expect(uploadInDb?.createdById).toBe(testUser.id)
      expect(uploadInDb?.name).toBe(uploadName)
    })

    it("should throw error when user not found", async () => {
      await expect(createUpload(uuid(), UploadType.FILE, "test.csv")).rejects.toThrow("No user found")
    })
  })

  describe("updateUploadToDone", () => {
    it("should update upload status to done", async () => {
      const uploadId = uuid()
      await prismaTest.upload.create({
        data: {
          id: uploadId,
          name: "test.csv",
          type: UploadType.FILE,
          createdById: testUser.id,
          organizationId: testOrganizationId,
          version: ecobalyseVersion,
          status: Status.Pending,
        },
      })

      const result = await updateUploadToDone(uploadId)

      expect(result.status).toBe(Status.Done)
      expect(result.id).toBe(uploadId)
    })
  })

  describe("updateUploadToError", () => {
    it("should update upload status to error with message", async () => {
      const uploadId = uuid()
      const errorMessage = "Processing failed"

      await prismaTest.upload.create({
        data: {
          id: uploadId,
          name: "test.csv",
          type: UploadType.FILE,
          createdById: testUser.id,
          organizationId: testOrganizationId,
          version: ecobalyseVersion,
          status: Status.Pending,
        },
      })

      const result = await updateUploadToError(uploadId, errorMessage)

      expect(result.status).toBe(Status.Error)
      expect(result.error).toBe(errorMessage)
      expect(result.id).toBe(uploadId)
    })

    it("should update upload status to error without message", async () => {
      const uploadId = uuid()

      await prismaTest.upload.create({
        data: {
          id: uploadId,
          name: "test.csv",
          type: UploadType.FILE,
          createdById: testUser.id,
          organizationId: testOrganizationId,
          version: ecobalyseVersion,
          status: Status.Pending,
        },
      })

      const result = await updateUploadToError(uploadId)

      expect(result.status).toBe(Status.Error)
      expect(result.error).toBeNull()
    })
  })

  describe("updateUploadToPending", () => {
    it("should update upload status to processing", async () => {
      const uploadId = uuid()
      await prismaTest.upload.create({
        data: {
          id: uploadId,
          name: "test.csv",
          type: UploadType.FILE,
          createdById: testUser.id,
          organizationId: testOrganizationId,
          version: ecobalyseVersion,
          status: Status.Pending,
        },
      })

      const result = await updateUploadToPending(uploadId)

      expect(result.status).toBe(Status.Processing)
      expect(result.id).toBe(uploadId)
    })
  })

  describe("getuploadsCountByUserId", () => {
    it("should count uploads for a user", async () => {
      await prismaTest.upload.createMany({
        data: [
          {
            id: uuid(),
            name: "file1.csv",
            type: UploadType.FILE,
            createdById: testUser.id,
            organizationId: testOrganizationId,
            version: ecobalyseVersion,
          },
          {
            id: uuid(),
            name: "file2.csv",
            type: UploadType.FILE,
            createdById: testUser.id,
            organizationId: testOrganizationId,
            version: ecobalyseVersion,
          },
          {
            id: uuid(),
            name: "api-upload",
            type: UploadType.API,
            createdById: testUser.id,
            organizationId: testOrganizationId,
            version: ecobalyseVersion,
          },
        ],
      })

      const count = await getuploadsCountByUserId(testUser.id)
      expect(count).toBe(2)
    })

    it("should return 0 for user with no uploads", async () => {
      const count = await getuploadsCountByUserId(uuid())
      expect(count).toBe(0)
    })
  })

  describe("getUploadsByUserId", () => {
    it("should return uploads for a user with pagination", async () => {
      const upload1Id = uuid()
      const upload2Id = uuid()
      const upload3Id = uuid()

      await prismaTest.upload.createMany({
        data: [
          {
            id: upload1Id,
            name: "file1.csv",
            type: UploadType.FILE,
            createdById: testUser.id,
            organizationId: testOrganizationId,
            version: ecobalyseVersion,
            createdAt: new Date("2025-01-01"),
          },
          {
            id: upload2Id,
            name: "file2.csv",
            type: UploadType.FILE,
            createdById: testUser.id,
            organizationId: testOrganizationId,
            version: ecobalyseVersion,
            createdAt: new Date("2025-01-02"),
          },
          {
            id: upload3Id,
            name: "file3.csv",
            type: UploadType.FILE,
            createdById: testUser.id,
            organizationId: testOrganizationId,
            version: ecobalyseVersion,
            createdAt: new Date("2025-01-03"),
          },
        ],
      })

      const product1Id = uuid()
      const product2Id = uuid()
      const product3Id = uuid()
      const product4Id = uuid()

      await Promise.all([
        prismaTest.product.create({
          data: {
            id: product1Id,
            hash: "test-hash",
            gtins: ["123"],
            uploadId: upload1Id,
            status: Status.Done,
            ...baseProduct,
          },
        }),
        prismaTest.product.create({
          data: {
            id: product2Id,
            hash: "test-hash",
            gtins: ["456"],
            uploadId: upload1Id,
            status: Status.Error,
            ...baseProduct,
          },
        }),
        prismaTest.product.create({
          data: {
            id: product3Id,
            hash: "test-hash",
            gtins: ["789"],
            uploadId: upload2Id,
            status: Status.Done,
            ...baseProduct,
          },
        }),
        prismaTest.product.create({
          data: {
            id: product4Id,
            hash: "test-hash",
            gtins: ["104"],
            uploadId: upload1Id,
            status: Status.Pending,
            ...baseProduct,
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            hash: "test-hash",
            gtins: ["101"],
            uploadId: upload3Id,
            status: Status.Done,
            ...baseProduct,
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            hash: "test-hash",
            gtins: ["102"],
            uploadId: upload3Id,
            status: Status.Error,
            ...baseProduct,
          },
        }),
      ])

      await prismaTest.uploadProduct.createMany({
        data: [
          { uploadId: upload3Id, productId: product1Id, uploadOrder: 1 },
          { uploadId: upload3Id, productId: product2Id, uploadOrder: 2 },
          { uploadId: upload3Id, productId: product3Id, uploadOrder: 3 },
          { uploadId: upload3Id, productId: product4Id, uploadOrder: 4 },
        ],
      })

      const results = await getUploadsByUserId(testUser.id, 0, 5)

      expect(results).toHaveLength(3)
      expect(results[0].name).toBe("file3.csv")
      expect(results[1].name).toBe("file2.csv")
      expect(results[2].name).toBe("file1.csv")

      expect(results[2].total).toBe(3)
      expect(results[2].success).toBe(1)
      expect(results[2].done).toBe(2)

      expect(results[1].total).toBe(1)
      expect(results[1].success).toBe(1)
      expect(results[1].done).toBe(1)

      expect(results[0].total).toBe(6)
      expect(results[0].success).toBe(3)
      expect(results[0].done).toBe(5)
    })

    it("should handle pagination correctly", async () => {
      await prismaTest.upload.createMany({
        data: [
          {
            id: uuid(),
            name: "file1.csv",
            type: UploadType.FILE,
            createdById: testUser.id,
            organizationId: testOrganizationId,
            version: ecobalyseVersion,
            createdAt: new Date("2025-01-01"),
          },
          {
            id: uuid(),
            name: "file2.csv",
            type: UploadType.FILE,
            createdById: testUser.id,
            organizationId: testOrganizationId,
            version: ecobalyseVersion,
            createdAt: new Date("2025-01-02"),
          },
          {
            id: uuid(),
            name: "file3.csv",
            type: UploadType.FILE,
            createdById: testUser.id,
            organizationId: testOrganizationId,
            version: ecobalyseVersion,
            createdAt: new Date("2025-01-03"),
          },
        ],
      })

      const page1 = await getUploadsByUserId(testUser.id, 0, 2)
      expect(page1).toHaveLength(2)
      expect(page1[0].name).toBe("file3.csv")

      const page2 = await getUploadsByUserId(testUser.id, 1, 2)
      expect(page2).toHaveLength(1)
      expect(page2[0].name).toBe("file1.csv")
    })
  })

  describe("checkUploadsStatus", () => {
    it("should complete uploads when all products are done", async () => {
      const uploadId = uuid()

      // Créer un upload avec tous les produits terminés
      await prismaTest.upload.create({
        data: {
          id: uploadId,
          name: "complete-upload.csv",
          type: UploadType.FILE,
          createdById: testUser.id,
          organizationId: testOrganizationId,
          version: ecobalyseVersion,
        },
      })

      await prismaTest.product.create({
        data: {
          id: uuid(),
          hash: "test-hash",
          gtins: ["123"],
          uploadId: uploadId,
          status: Status.Done,
          ...baseProduct,
        },
      })

      await checkUploadsStatus([uploadId])

      expect(completeUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          id: uploadId,
          name: "complete-upload.csv",
        }),
      )
    })

    it("should fail uploads when some products have errors", async () => {
      const uploadId = uuid()

      await prismaTest.upload.create({
        data: {
          id: uploadId,
          name: "failed-upload.csv",
          type: UploadType.FILE,
          createdById: testUser.id,
          organizationId: testOrganizationId,
          version: ecobalyseVersion,
        },
      })

      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            hash: "test-hash",
            gtins: ["123"],
            uploadId: uploadId,
            status: Status.Done,
            ...baseProduct,
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            hash: "test-hash",
            gtins: ["456"],
            uploadId: uploadId,
            status: Status.Error,
            ...baseProduct,
          },
        }),
      ])

      await checkUploadsStatus([uploadId])

      expect(failUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          id: uploadId,
          name: "failed-upload.csv",
        }),
      )
    })

    it("should ignore uploads with pending products", async () => {
      const uploadId = uuid()

      await prismaTest.upload.create({
        data: {
          id: uploadId,
          name: "pending-upload.csv",
          type: UploadType.FILE,
          createdById: testUser.id,
          organizationId: testOrganizationId,
          version: ecobalyseVersion,
        },
      })

      await Promise.all([
        prismaTest.product.create({
          data: {
            id: uuid(),
            hash: "test-hash",
            gtins: ["123"],
            uploadId: uploadId,
            status: Status.Pending,
            ...baseProduct,
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            hash: "test-hash",
            gtins: ["123"],
            uploadId: uploadId,
            status: Status.Done,
            ...baseProduct,
          },
        }),
        prismaTest.product.create({
          data: {
            id: uuid(),
            hash: "test-hash",
            gtins: ["456"],
            uploadId: uploadId,
            status: Status.Error,
            ...baseProduct,
          },
        }),
      ])

      await checkUploadsStatus([uploadId])

      expect(completeUpload).not.toHaveBeenCalled()
      expect(failUpload).not.toHaveBeenCalled()
    })
  })

  describe("getFirstFileUpload", () => {
    it("should return first pending file upload", async () => {
      const upload1Id = uuid()
      const upload2Id = uuid()

      await prismaTest.upload.createMany({
        data: [
          {
            id: upload1Id,
            name: "second.csv",
            type: UploadType.FILE,
            createdById: testUser.id,
            organizationId: testOrganizationId,
            version: ecobalyseVersion,
            status: Status.Pending,
            createdAt: new Date("2025-01-02"),
          },
          {
            id: upload2Id,
            name: "first.csv",
            type: UploadType.FILE,
            createdById: testUser.id,
            organizationId: testOrganizationId,
            version: ecobalyseVersion,
            status: Status.Pending,
            createdAt: new Date("2025-01-01"),
          },
          {
            id: uuid(),
            name: "done.csv",
            type: UploadType.FILE,
            createdById: testUser.id,
            organizationId: testOrganizationId,
            version: ecobalyseVersion,
            status: Status.Done,
            createdAt: new Date("2024-12-31"),
          },
          {
            id: uuid(),
            name: "api.csv",
            type: UploadType.API,
            createdById: testUser.id,
            organizationId: testOrganizationId,
            version: ecobalyseVersion,
            status: Status.Pending,
            createdAt: new Date("2024-12-30"),
          },
        ],
      })

      const result = await getFirstFileUpload()

      expect(result).toBeDefined()
      expect(result?.name).toBe("first.csv")
      expect(result?.id).toBe(upload2Id)
    })

    it("should return null when no pending file uploads", async () => {
      await prismaTest.upload.create({
        data: {
          id: uuid(),
          name: "done.csv",
          type: UploadType.FILE,
          createdById: testUser.id,
          organizationId: testOrganizationId,
          version: ecobalyseVersion,
          status: Status.Done,
        },
      })

      const result = await getFirstFileUpload()
      expect(result).toBeNull()
    })
  })
})
