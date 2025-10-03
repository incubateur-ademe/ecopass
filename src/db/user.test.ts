import { v4 as uuid } from "uuid"
import { prismaTest } from "../../jest.setup"

jest.mock("./prismaClient", () => ({
  prismaClient: prismaTest,
}))

import { getUserByApiKey, getUserByEmail, getAPIKeys, updateAPIUse, getUserOrganization } from "./user"
import { cleanDB } from "./testUtils"

describe("User DB integration", () => {
  let testUser: { id: string; email: string }
  let testOrganization: { id: string; name: string; siret: string }
  let testBrand: { id: string; name: string }
  let testAPIKey: { id: string; key: string; name: string }

  beforeAll(async () => {
    await cleanDB()

    testOrganization = await prismaTest.organization.create({
      data: {
        name: "TestOrg",
        siret: "12345678901234",
      },
    })

    testBrand = await prismaTest.brand.create({
      data: {
        name: "TestBrand",
        organizationId: testOrganization.id,
      },
    })

    testUser = await prismaTest.user.create({
      data: {
        email: "test@example.com",
        organizationId: testOrganization.id,
      },
      select: { id: true, email: true },
    })

    testAPIKey = await prismaTest.aPIKey.create({
      data: {
        key: "test-api-key-12345",
        name: "Test API Key",
        userId: testUser.id,
      },
    })
  })

  afterAll(async () => {
    await cleanDB()
  })

  beforeEach(async () => {
    await prismaTest.aPIKey.update({
      where: { id: testAPIKey.id },
      data: { lastUsed: null },
    })
  })

  describe("getUserByApiKey", () => {
    it("should return user by API key", async () => {
      const result = await getUserByApiKey(testAPIKey.key)

      expect(result).toBeDefined()
      expect(result?.key).toBe(testAPIKey.key)
      expect(result?.user).toBeDefined()
      expect(result?.user.id).toBe(testUser.id)
      expect(result?.user.email).toBe(testUser.email)
      expect(result?.user.organization).toBeDefined()
      expect(result?.user.organization?.id).toBe(testOrganization.id)
      expect(result?.user.organization?.name).toBe(testOrganization.name)
      expect(result?.user.organization?.brands).toHaveLength(1)
      expect(result?.user.organization?.brands[0].name).toBe(testBrand.name)
    })

    it("should return null for non-existent API key", async () => {
      const result = await getUserByApiKey("non-existent-key")
      expect(result).toBeNull()
    })

    it("should include authorized organizations", async () => {
      const authorizedOrg = await prismaTest.organization.create({
        data: {
          name: "AuthorizedOrg",
          siret: "98765432109876",
        },
      })

      await prismaTest.brand.create({
        data: {
          name: "AuthorizedBrand",
          organizationId: authorizedOrg.id,
        },
      })

      await prismaTest.authorizedOrganization.createMany({
        data: [
          {
            fromId: authorizedOrg.id,
            toId: testOrganization.id,
            createdById: testUser.id,
            active: true,
          },
          {
            fromId: authorizedOrg.id,
            toId: testOrganization.id,
            createdById: testUser.id,
            active: false,
          },
        ],
      })

      const result = await getUserByApiKey(testAPIKey.key)

      expect(result?.user.organization?.authorizedBy).toHaveLength(1)
      expect(result?.user.organization?.authorizedBy[0].from.name).toBe("AuthorizedOrg")
      expect(result?.user.organization?.authorizedBy[0].from.siret).toBe("98765432109876")
      expect(result?.user.organization?.authorizedBy[0].from.brands).toHaveLength(1)
      expect(result?.user.organization?.authorizedBy[0].from.brands[0].name).toBe("AuthorizedBrand")
    })
  })

  describe("getUserByEmail", () => {
    it("should return user by email", async () => {
      const result = await getUserByEmail(testUser.email)

      expect(result).toBeDefined()
      expect(result?.id).toBe(testUser.id)
      expect(result?.email).toBe(testUser.email)
    })

    it("should return null for non-existent email", async () => {
      const result = await getUserByEmail("nonexistent@example.com")
      expect(result).toBeNull()
    })
  })

  describe("getAPIKeys", () => {
    it("should return API keys for user with masked keys", async () => {
      const secondAPIKey = await prismaTest.aPIKey.create({
        data: {
          key: "another-test-key-67890",
          name: "Second API Key",
          userId: testUser.id,
        },
      })

      const result = await getAPIKeys(testUser.id)

      expect(result).toHaveLength(2)

      const firstKey = result.find((k) => k.name === "Test API Key")
      const secondKey = result.find((k) => k.name === "Second API Key")

      expect(firstKey?.key).toBe("tes")
      expect(secondKey?.key).toBe("ano")

      expect(firstKey?.name).toBe("Test API Key")
      expect(firstKey?.userId).toBe(testUser.id)
      expect(secondKey?.name).toBe("Second API Key")
      expect(secondKey?.userId).toBe(testUser.id)

      await prismaTest.aPIKey.delete({ where: { id: secondAPIKey.id } })
    })

    it("should return empty array for user with no API keys", async () => {
      const userWithoutKeys = await prismaTest.user.create({
        data: {
          email: "nokeys@example.com",
          organizationId: testOrganization.id,
        },
      })

      const result = await getAPIKeys(userWithoutKeys.id)
      expect(result).toHaveLength(0)

      await prismaTest.user.delete({ where: { id: userWithoutKeys.id } })
    })
  })

  describe("updateAPIUse", () => {
    it("should update last used date for API key", async () => {
      const beforeUpdate = new Date()

      const result = await updateAPIUse(testAPIKey.key)

      expect(result.lastUsed).toBeDefined()
      expect(result.lastUsed!.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime())
      expect(result.id).toBe(testAPIKey.id)
      expect(result.key).toBe(testAPIKey.key)
    })

    it("should throw error for non-existent API key", async () => {
      await expect(updateAPIUse("non-existent-key")).rejects.toThrow()
    })
  })

  describe("getUserOrganization", () => {
    it("should return user organization with brands and authorized organizations", async () => {
      const [authorizedOrg, authorizingOrg] = await prismaTest.organization.createManyAndReturn({
        data: [
          {
            name: "AuthorizedCompany",
            siret: "11111111111111",
          },
          {
            name: "AuthorizingCompany",
            siret: "99999999999999",
          },
        ],
      })

      await prismaTest.brand.createManyAndReturn({
        data: [
          {
            name: "AuthorizedBrand2",
            organizationId: authorizedOrg.id,
          },
          {
            name: "AuthorizingBrand",
            organizationId: authorizingOrg.id,
          },
        ],
      })

      await prismaTest.authorizedOrganization.createManyAndReturn({
        data: [
          {
            fromId: testOrganization.id,
            toId: authorizedOrg.id,
            createdById: testUser.id,
            active: true,
          },
          {
            fromId: authorizingOrg.id,
            toId: testOrganization.id,
            createdById: testUser.id,
            active: true,
          },
        ],
      })

      const result = await getUserOrganization(testUser.id)

      expect(result).toBeDefined()
      expect(result?.id).toBe(testOrganization.id)
      expect(result?.name).toBe(testOrganization.name)
      expect(result?.brands).toHaveLength(1)
      expect(result?.brands[0].name).toBe(testBrand.name)

      expect(result?.authorizedOrganizations).toHaveLength(1)
      expect(result?.authorizedOrganizations[0].to.name).toBe("AuthorizedCompany")
      expect(result?.authorizedOrganizations[0].to.siret).toBe("11111111111111")

      expect(result?.authorizedBy).toHaveLength(2)
      expect(result?.authorizedBy[0].from.name).toBe("AuthorizingCompany")
      expect(result?.authorizedBy[0].from.siret).toBe("99999999999999")
      expect(result?.authorizedBy[0].from.brands).toHaveLength(1)
      expect(result?.authorizedBy[0].from.brands[0].name).toBe("AuthorizingBrand")

      expect(result?.authorizedBy[1].from.name).toBe("AuthorizedOrg")
      expect(result?.authorizedBy[1].from.siret).toBe("98765432109876")
      expect(result?.authorizedBy[1].from.brands).toHaveLength(1)
      expect(result?.authorizedBy[1].from.brands[0].name).toBe("AuthorizedBrand")

      await prismaTest.authorizedOrganization.deleteMany({
        where: {
          OR: [
            { fromId: testOrganization.id, toId: authorizedOrg.id },
            { fromId: authorizingOrg.id, toId: testOrganization.id },
          ],
        },
      })
      await prismaTest.brand.deleteMany({
        where: { organizationId: { in: [authorizedOrg.id, authorizingOrg.id] } },
      })
      await prismaTest.organization.deleteMany({
        where: { id: { in: [authorizedOrg.id, authorizingOrg.id] } },
      })
    })

    it("should return null for user without organization", async () => {
      const userWithoutOrg = await prismaTest.user.create({
        data: {
          email: "noorg@example.com",
          organizationId: null,
        },
      })

      const result = await getUserOrganization(userWithoutOrg.id)
      expect(result).toBeNull()

      await prismaTest.user.delete({ where: { id: userWithoutOrg.id } })
    })

    it("should return null for non-existent user", async () => {
      const result = await getUserOrganization(uuid())
      expect(result).toBeNull()
    })

    it("should only return active authorized organizations", async () => {
      const activeOrg = await prismaTest.organization.create({
        data: { name: "ActiveOrg", siret: "22222222222222" },
      })

      const inactiveOrg = await prismaTest.organization.create({
        data: { name: "InactiveOrg", siret: "33333333333333" },
      })

      const activeAuth = await prismaTest.authorizedOrganization.create({
        data: {
          fromId: testOrganization.id,
          toId: activeOrg.id,
          createdById: testUser.id,
          active: true,
        },
      })

      const inactiveAuth = await prismaTest.authorizedOrganization.create({
        data: {
          fromId: testOrganization.id,
          toId: inactiveOrg.id,
          createdById: testUser.id,
          active: false,
        },
      })

      const result = await getUserOrganization(testUser.id)

      expect(result?.authorizedOrganizations).toHaveLength(1)
      expect(result?.authorizedOrganizations[0].to.name).toBe("ActiveOrg")

      await prismaTest.authorizedOrganization.deleteMany({
        where: { id: { in: [activeAuth.id, inactiveAuth.id] } },
      })
      await prismaTest.organization.deleteMany({
        where: { id: { in: [activeOrg.id, inactiveOrg.id] } },
      })
    })

    it("should order authorized organizations by creation date desc", async () => {
      const firstOrg = await prismaTest.organization.create({
        data: { name: "FirstOrg", siret: "44444444444444" },
      })

      const secondOrg = await prismaTest.organization.create({
        data: { name: "SecondOrg", siret: "55555555555555" },
      })

      const firstAuth = await prismaTest.authorizedOrganization.create({
        data: {
          fromId: testOrganization.id,
          toId: firstOrg.id,
          createdById: testUser.id,
          active: true,
          createdAt: new Date("2025-01-01"),
        },
      })

      await new Promise((resolve) => setTimeout(resolve, 10))

      const secondAuth = await prismaTest.authorizedOrganization.create({
        data: {
          fromId: testOrganization.id,
          toId: secondOrg.id,
          createdById: testUser.id,
          active: true,
          createdAt: new Date("2025-01-02"),
        },
      })

      const result = await getUserOrganization(testUser.id)

      expect(result?.authorizedOrganizations).toHaveLength(2)
      expect(result?.authorizedOrganizations[0].to.name).toBe("SecondOrg")
      expect(result?.authorizedOrganizations[1].to.name).toBe("FirstOrg")

      // Cleanup optimisé avec deleteMany
      await prismaTest.authorizedOrganization.deleteMany({
        where: { id: { in: [firstAuth.id, secondAuth.id] } },
      })
      await prismaTest.organization.deleteMany({
        where: { id: { in: [firstOrg.id, secondOrg.id] } },
      })
    })
  })
})
