import { prismaTest } from "../../jest.setup"

jest.mock("./prismaClient", () => ({
  prismaClient: prismaTest,
}))

import { createOrganization, getUserOrganizationType, getOrganizationById } from "./organization"
import { getSiretInfo } from "../serverFunctions/siret"
import { prismaClient } from "./prismaClient"
import { OrganizationType, Status, UploadType } from "@prisma/enums"
import { cleanDB } from "./testUtils"

jest.mock("../serverFunctions/siret")

const mockGetSiretInfo = getSiretInfo as jest.MockedFunction<typeof getSiretInfo>

const mockSiretResponse = {
  etablissement: {
    uniteLegale: {
      denominationUniteLegale: "Test Company",
      nomUniteLegale: "Dupont",
      prenom1UniteLegale: "Jean",
      trancheEffectifsUniteLegale: "10-19",
      activitePrincipaleUniteLegale: "47.91B",
    },
    siret: "12345678901234",
    adresseEtablissement: {
      numeroVoieEtablissement: "123",
      typeVoieEtablissement: "RUE",
      libelleVoieEtablissement: "DE LA PAIX",
      codePostalEtablissement: "75001",
      libelleCommuneEtablissement: "PARIS",
    },
  },
}

describe("organization", () => {
  let testOrganizationId: string
  beforeAll(async () => {
    await cleanDB()

    const org = await prismaClient.organization.create({
      data: {
        siret: "11111111111111",
        name: "Test Org",
        displayName: "Test Org",
        type: OrganizationType.Brand,
        naf: "14.13Z",
      },
    })
    testOrganizationId = org.id
  })

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await cleanDB()
  })

  describe("createOrganization", () => {
    it("should create organization with SIRET data and default brand", async () => {
      const siret = "12345678901234"
      mockGetSiretInfo.mockResolvedValue(mockSiretResponse)

      const result = await createOrganization(siret)

      expect(mockGetSiretInfo).toHaveBeenCalledWith(siret)
      expect(result).toMatchObject({
        siret,
        name: "Test Company",
        effectif: "10-19",
        naf: "47.91B",
        type: OrganizationType.Distributor,
      })

      const dbOrganization = await prismaClient.organization.findUnique({
        where: { siret },
        include: { brands: true },
      })

      expect(dbOrganization).not.toBeNull()
      expect(dbOrganization?.name).toBe("Test Company")
      expect(dbOrganization?.type).toBe(OrganizationType.Distributor)
      expect(dbOrganization?.brands).toHaveLength(1)
      expect(dbOrganization?.brands[0].name).toBe("Test Company")
      expect(dbOrganization?.brands[0].default).toBe(true)
      expect(dbOrganization?.brands[0].active).toBe(true)
    })

    it("should handle unknown NAF code with undefined type", async () => {
      const siret = "12345678901235"
      const responseWithUnknownNaf = {
        ...mockSiretResponse,
        etablissement: {
          ...mockSiretResponse.etablissement,
          siret,
          uniteLegale: {
            ...mockSiretResponse.etablissement.uniteLegale,
            activitePrincipaleUniteLegale: "UNKNOWN_NAF",
          },
        },
      }

      mockGetSiretInfo.mockResolvedValue(responseWithUnknownNaf)

      const result = await createOrganization(siret)

      expect(result.type).toBeNull()
      expect(result.naf).toBe("UNKNOWN_NAF")

      const dbOrganization = await prismaClient.organization.findUnique({
        where: { siret },
        include: { brands: true },
      })
      expect(dbOrganization?.type).toBeNull()
    })
  })

  describe("getUserOrganizationType", () => {
    it("should return organization type for valid organization ID", async () => {
      const result = await getUserOrganizationType(testOrganizationId)

      expect(result).toBe(OrganizationType.Brand)
    })

    it("should return null when organization not found", async () => {
      const nonExistentId = "non-existent-org-id"

      const result = await getUserOrganizationType(nonExistentId)

      expect(result).toBeNull()
    })

    it("should return null when organization has null type", async () => {
      const orgWithNullType = await prismaClient.organization.create({
        data: {
          siret: "22222222222222",
          name: "Org with Null Type",
          displayName: "Org with Null Type",
          type: null,
        },
      })

      const result = await getUserOrganizationType(orgWithNullType.id)
      expect(result).toBeNull()
    })
  })

  describe("getOrganizationById", () => {
    it("should return null when organization does not exist", async () => {
      const result = await getOrganizationById("non-existent-id")

      expect(result).toBeNull()
    })

    it("should return organization with every information", async () => {
      const user = await prismaClient.user.create({
        data: {
          email: "test-user@example.com",
        },
      })

      const orgFrom = await prismaClient.organization.create({
        data: {
          name: "From Org",
          displayName: "From Org",
          type: OrganizationType.Distributor,
        },
      })

      await prismaClient.authorizedOrganization.create({
        data: {
          fromId: orgFrom.id,
          toId: testOrganizationId,
          active: true,
          createdById: user.id,
        },
      })

      await prismaClient.brand.createMany({
        data: [
          {
            id: "brand1-id",
            name: "Test Brand",
            organizationId: testOrganizationId,
            active: true,
          },
          {
            name: "Test Brand Inactive",
            organizationId: testOrganizationId,
            active: false,
          },
          {
            id: "brand2-id",
            name: "Test Brand 2",
            organizationId: orgFrom.id,
            active: false,
          },
        ],
      })

      await prismaClient.upload.createMany({
        data: [
          {
            id: "upload1-id",
            organizationId: testOrganizationId,
            version: "v1",
            type: UploadType.FILE,
            createdById: user.id,
          },
          {
            id: "upload2-id",
            organizationId: orgFrom.id,
            version: "v1",
            type: UploadType.FILE,
            createdById: user.id,
          },
        ],
      })

      await prismaClient.product.createMany({
        data: [
          {
            brandId: "brand1-id",
            hash: "hash1",
            uploadId: "upload1-id",
            internalReference: "REF001",
            status: Status.Done,
            createdAt: new Date("2035-01-01T00:00:00Z"),
          },
          {
            brandId: "brand1-id",
            hash: "hash2",
            uploadId: "upload1-id",
            internalReference: "REF002",
            status: Status.Done,
          },
          {
            brandId: "brand1-id",
            hash: "hash3",
            uploadId: "upload1-id",
            internalReference: "REF003",
            status: Status.Error,
          },
          {
            brandId: "brand2-id",
            hash: "hash1",
            uploadId: "upload2-id",
            internalReference: "REF001",
            status: Status.Done,
            createdAt: new Date("2045-01-01T00:00:00Z"),
          },
          {
            brandId: "brand2-id",
            hash: "hash2",
            uploadId: "upload2-id",
            internalReference: "REF002",
            status: Status.Done,
          },
          {
            brandId: "brand2-id",
            hash: "hash3",
            uploadId: "upload2-id",
            internalReference: "REF003",
            status: Status.Error,
          },
        ],
      })

      const result = await getOrganizationById(testOrganizationId)

      expect(result).not.toBeNull()
      expect(result).toMatchObject({
        id: testOrganizationId,
        siret: "11111111111111",
        name: "Test Org",
        displayName: "Test Org",
        type: OrganizationType.Brand,
      })
      expect(result?.brands).toHaveLength(2)
      expect(result?.brands[0]).toMatchObject({
        id: "brand1-id",
        name: "Test Brand",
        active: true,
        references: 2,
      })
      expect(result?.brands[0].lastDeclaration?.getTime()).toBe(new Date("2035-01-01T00:00:00Z").getTime())
      expect(result?.authorizedBy).toHaveLength(1)
      expect(result?.authorizedBy[0]).toMatchObject({
        active: true,
        references: 2,
        from: {
          id: orgFrom.id,
          name: "From Org",
          displayName: "From Org",
          siret: null,
          brands: [
            {
              active: false,
              id: "brand2-id",
              name: "Test Brand 2",
              references: 2,
            },
          ],
        },
      })
    })

    it("should return zero references when brand has no products", async () => {
      const org = await prismaClient.organization.create({
        data: {
          siret: "99999999999999",
          name: "No Products Org",
          displayName: "No Products Org",
          type: OrganizationType.Brand,
        },
      })

      await prismaClient.brand.create({
        data: {
          name: "Empty Brand",
          organizationId: org.id,
          active: true,
          default: true,
        },
      })

      const result = await getOrganizationById(org.id)

      expect(result?.brands[0].references).toBe(0)
      expect(result?.brands[0].lastDeclaration).toBeNull()
    })
  })
})
