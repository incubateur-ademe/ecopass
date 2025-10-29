"use server"
import { OrganizationType } from "../../prisma/src/prisma"
import { prismaClient } from "../db/prismaClient"
import { auth } from "../services/auth/auth"
import { getSiretInfo } from "./siret"

export const authorizeOrganization = async (siret: string) => {
  if (!siret || !/^\d{14}$/.test(siret)) {
    return "SIRET invalide"
  }

  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  const [userOrganization, siretOrganization] = await Promise.all([
    prismaClient.user.findUnique({
      where: { id: session.user.id },
      select: {
        organization: {
          select: {
            id: true,
            siret: true,
            authorizedOrganizations: {
              where: { active: true, to: { siret } },
            },
          },
        },
      },
    }),
    prismaClient.organization.findFirst({
      select: {
        id: true,
        siret: true,
      },
      where: {
        siret,
      },
    }),
  ])

  if (!userOrganization || !userOrganization.organization) {
    return "Aucune organisation trouvée pour l'utilisateur"
  }

  if (userOrganization.organization.siret === siret) {
    return "Vous ne pouvez pas autoriser votre propre organisation"
  }

  if (userOrganization.organization.authorizedOrganizations.length > 0) {
    return "L'organisation est déjà autorisée"
  }

  let id = siretOrganization?.id
  if (!siretOrganization) {
    const info = await getSiretInfo(siret)
    if (!info) {
      return "Aucune organisation trouvée pour ce SIRET"
    }
    const newOrganization = await prismaClient.organization.create({
      data: {
        siret,
        name: info.etablissement.uniteLegale.denominationUniteLegale,
        effectif: info.etablissement.uniteLegale.trancheEffectifsUniteLegale,
        naf: info.etablissement.uniteLegale.activitePrincipaleUniteLegale,
      },
    })
    id = newOrganization.id
  }

  await prismaClient.authorizedOrganization.create({
    data: {
      from: {
        connect: { id: userOrganization.organization.id },
      },
      to: {
        connect: { id },
      },
      active: true,
      createdBy: {
        connect: { id: session.user.id },
      },
    },
  })
}

export const removeOrganizationAuthorization = async (id: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }
  const user = await prismaClient.user.findUnique({
    where: { id: session.user.id },
    select: {
      organization: true,
    },
  })

  if (!user || !user.organization) {
    return "Aucune organisation trouvée pour l'utilisateur"
  }

  await prismaClient.authorizedOrganization.update({
    where: { id, fromId: user.organization.id, active: true },
    data: { active: false, removedAt: new Date() },
  })
}

export const updateOrganizationType = async (type: OrganizationType) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }
  const user = await prismaClient.user.findUnique({
    where: { id: session.user.id },
    select: {
      organization: true,
    },
  })

  if (!user || !user.organization) {
    return "Aucune organisation trouvée pour l'utilisateur"
  }
  await prismaClient.organization.update({
    where: { id: user.organization.id },
    data: { type },
  })
}
