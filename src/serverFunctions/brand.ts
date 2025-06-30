"use server"

import { prismaClient } from "../db/prismaClient"
import { auth } from "../services/auth/auth"

export const addNewBrand = async (brand: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  const organization = await prismaClient.organization.findFirst({
    select: { id: true, brands: { select: { name: true } } },
    where: { users: { some: { id: session.user.id } } },
  })

  if (!organization) {
    return "Vous n'êtes pas membre d'une organisation"
  }

  if (organization.brands.some(({ name }) => name === brand)) {
    return "Vous avez déjà une marque avec ce nom"
  }

  return prismaClient.brand.create({
    data: {
      name: brand,
      organization: { connect: { id: organization.id } },
    },
  })
}

export const deleteBrand = async (id: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  const organization = await prismaClient.organization.findFirst({
    select: { id: true, brands: { select: { name: true } } },
    where: { users: { some: { id: session.user.id } } },
  })

  if (!organization) {
    return "Vous n'êtes pas membre d'une organisation"
  }

  return prismaClient.brand.delete({
    where: {
      id: id,
      organizationId: organization.id,
    },
  })
}
