"use server"

import { prismaClient } from "../db/prismaClient"
import { auth } from "../services/auth/auth"

export const addNewBrand = async (brandName: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  const brand = await prismaClient.brand.findFirst({
    select: { id: true, names: { select: { name: true } } },
    where: { users: { some: { id: session.user.id } } },
  })

  if (!brand) {
    return "Vous n'êtes pas membre d'une organisation"
  }

  if (brand.names.some((name) => name.name === brandName)) {
    return "Vous avez déjà une marque avec ce nom"
  }

  return prismaClient.brandName.create({
    data: {
      name: brandName,
      brand: { connect: { id: brand.id } },
    },
  })
}

export const deleteBrand = async (id: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  const brand = await prismaClient.brand.findFirst({
    select: { id: true, names: { select: { name: true } } },
    where: { users: { some: { id: session.user.id } } },
  })

  if (!brand) {
    return "Vous n'êtes pas membre d'une organisation"
  }

  return prismaClient.brandName.delete({
    where: {
      id: id,
      brandId: brand.id,
    },
  })
}
