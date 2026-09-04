"use server"

import { OrganizationRole } from "@prisma/client"
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
      organizationRole: true,
      organization: { select: { id: true, brands: { select: { name: true } } } },
    },
  })

  if (!user || !user.organization) {
    return "Vous n'êtes pas membre d'une organisation"
  }

  if (user.organizationRole !== OrganizationRole.ADMIN) {
    return "Vous n'avez pas les droits pour ajouter une marque"
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

export const updateBrand = async (id: string, data: { name: string; active: boolean }) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  const user = await prismaClient.user.findUnique({
    where: { id: session.user.id },
    select: {
      organizationRole: true,
      organization: { select: { id: true, brands: { select: { id: true, name: true } } } },
    },
  })

  if (!user || !user.organization) {
    return "Vous n'êtes pas membre d'une organisation"
  }

  if (user.organizationRole !== OrganizationRole.ADMIN) {
    return "Vous n'avez pas les droits pour modifier une marque"
  }

  const trimmedBrand = data.name.trim()
  if (trimmedBrand.length === 0) {
    return "Le nom de la marque ne peut pas être vide"
  }

  if (user.organization.brands.some(({ name, id: brandId }) => name === trimmedBrand && brandId !== id)) {
    return "Vous avez déjà une marque avec ce nom"
  }

  return prismaClient.brand.update({
    where: {
      id: id,
      organizationId: user.organization.id,
      default: false,
    },
    data: {
      name: trimmedBrand,
      active: data.active,
    },
  })
}
