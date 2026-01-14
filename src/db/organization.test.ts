import { jest } from "@jest/globals"
import { prismaTest } from "../../jest.setup"

jest.mock("./prismaClient", () => ({
  prismaClient: prismaTest,
}))

import { createOrganization, getUserOrganizationType } from "./organization"
import { getSiretInfo } from "../serverFunctions/siret"
import { prismaClient } from "./prismaClient"
import { OrganizationType } from "@prisma/enums"
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
})
