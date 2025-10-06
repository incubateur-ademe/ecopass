import "dotenv/config"
import { prismaClient } from "../db/prismaClient"
import { getSiretInfo } from "../serverFunctions/siret"

const main = async () => {
  const organizations = await prismaClient.organization.findMany({ select: { siret: true, id: true } })
  for (const organization of organizations) {
    console.log(`SIRET: ${organization.siret}, ID: ${organization.id}`)
    const info = await getSiretInfo(organization.siret)
    if (!info) {
      console.error(`Impossible de récupérer les informations pour le SIRET ${organization.siret}`)
      continue
    }
    await prismaClient.organization.update({
      where: { id: organization.id },
      data: {
        effectif: info.etablissement.uniteLegale.trancheEffectifsUniteLegale,
        naf: info.etablissement.uniteLegale.activitePrincipaleUniteLegale,
      },
    })

    console.log(
      `Mise à jour de l'organisation ID ${organization.id} avec effectif ${info.etablissement.uniteLegale.trancheEffectifsUniteLegale} et NAF ${info.etablissement.uniteLegale.activitePrincipaleUniteLegale}`,
    )
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }
}

main()
