"use server"

import { prismaClient } from "../db/prismaClient"
import { auth } from "../services/auth/auth"

export const addNewBrand = async (brand: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  const user = await prismaClient.user.findUnique({
    where: { id: session.user.id },
    select: {
      organization: { select: { id: true, brands: { select: { name: true } } } },
    },
  })

  if (!user || !user.organization) {
    return "Vous n'êtes pas membre d'une organisation"
  }

  const trimmedBrand = brand.trim()
  if (trimmedBrand.length === 0) {
    return "Le nom de la marque ne peut pas être vide"
  }

  if (user.organization.brands.some(({ name }) => name === trimmedBrand)) {
    return "Vous avez déjà une marque avec ce nom"
  }

  return prismaClient.brand.create({
    data: {
      name: trimmedBrand,
      organization: { connect: { id: user.organization.id } },
    },
  })
}

export const deleteBrand = async (id: string) => {
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
    return "Vous n'êtes pas membre d'une organisation"
  }

  return prismaClient.brand.delete({
    where: {
      id: id,
      organizationId: user.organization.id,
    },
  })
}
