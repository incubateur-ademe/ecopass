"use server"
import { prismaClient } from "../db/prismaClient"
import { getUserOrganizationType as getUserOrganizationTypeDB } from "../db/user"
import { auth } from "../services/auth/auth"

export const generateAPIKey = async (name: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  if (!name) {
    return "Le nom de la clé est requis"
  }

  const { key } = await prismaClient.aPIKey.create({
    data: {
      userId: session.user.id,
      name,
    },
  })

  return key
}

export const deleteAPIKey = async (id: string) =>
  prismaClient.aPIKey.delete({
    where: { id },
  })

export const getUserOrganizationType = async (id?: string) => {
  if (!id) {
    return null
  }

  return getUserOrganizationTypeDB(id)
}
