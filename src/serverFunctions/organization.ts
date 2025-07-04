"use server"
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
    prismaClient.organization.findFirst({
      select: {
        id: true,
        authorizedOrganizations: {
          where: { active: true },
          select: {
            to: {
              select: {
                id: true,
                siret: true,
              },
            },
          },
        },
      },
      where: {
        users: {
          some: {
            id: session.user.id,
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

  if (!userOrganization) {
    return "Aucune organisation trouvée pour l'utilisateur"
  }

  if (userOrganization.authorizedOrganizations.some((org) => org.to.siret === siret)) {
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
      },
    })
    id = newOrganization.id
  }

  await prismaClient.organization.update({
    where: { id: userOrganization.id },
    data: {
      authorizedOrganizations: {
        create: {
          to: {
            connect: { id },
          },
          createdBy: {
            connect: { id: session.user.id },
          },
        },
      },
    },
  })
}

export const removeOrganizationAuthorization = async (id: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }
  const userOrganization = await prismaClient.organization.findFirst({
    where: { users: { some: { id: session.user.id } } },
    select: { id: true },
  })
  if (!userOrganization) {
    return "Aucune organisation trouvée pour l'utilisateur"
  }

  await prismaClient.authorizedOrganization.update({
    where: { id, fromId: userOrganization.id, active: true },
    data: { active: false, removedAt: new Date() },
  })
}
