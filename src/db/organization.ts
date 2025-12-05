import { getSiretInfo } from "../serverFunctions/siret"
import { organizationTypeByNaf } from "../utils/admin/nafs"
import { prismaClient } from "./prismaClient"

export const createOrganization = async (siret: string) => {
  const result = await getSiretInfo(siret)
  if (!result) {
    throw new Error("Failed to fetch SIRET information from API")
  }
  const type = organizationTypeByNaf[result.etablissement.uniteLegale.activitePrincipaleUniteLegale]

  return prismaClient.organization.create({
    data: {
      siret: siret,
      name: result.etablissement.uniteLegale.denominationUniteLegale,
      displayName: result.etablissement.uniteLegale.denominationUniteLegale,
      effectif: result.etablissement.uniteLegale.trancheEffectifsUniteLegale,
      naf: result.etablissement.uniteLegale.activitePrincipaleUniteLegale,
      type,
      brands: {
        create: {
          name: result.etablissement.uniteLegale.denominationUniteLegale,
          default: true,
        },
      },
    },
  })
}

export const getUserOrganizationType = async (organizationId: string) =>
  prismaClient.organization
    .findUnique({
      where: { id: organizationId },
      select: { type: true },
    })
    .then((org) => org?.type || null)
