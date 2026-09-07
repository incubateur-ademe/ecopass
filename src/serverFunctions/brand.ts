"use server"

import { prismaClient } from "../db/prismaClient"
import { auth } from "../services/auth/auth"

export const addNewBrand = async (brand: string) => {
  console.log(`[addNewBrand] Starting - brand: ${brand}`)
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

  const newBrand = await prismaClient.brand.create({
    data: {
      name: trimmedBrand,
      organization: { connect: { id: user.organization.id } },
    },
  })
  console.log(`[addNewBrand] Completed - brand: ${newBrand.id}`)
  return newBrand
}

export const updateBrand = async (id: string, data: { name: string; active: boolean }) => {
  console.log(`[updateBrand] Starting - id: ${id}, data:`, data)
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  const user = await prismaClient.user.findUnique({
    where: { id: session.user.id },
    select: {
      organization: { select: { id: true, brands: { select: { id: true, name: true } } } },
    },
  })

  if (!user || !user.organization) {
    return "Vous n'êtes pas membre d'une organisation"
  }

  const trimmedBrand = data.name.trim()
  if (trimmedBrand.length === 0) {
    return "Le nom de la marque ne peut pas être vide"
  }

  if (user.organization.brands.some(({ name, id: brandId }) => name === trimmedBrand && brandId !== id)) {
    return "Vous avez déjà une marque avec ce nom"
  }

  const updatedBrand = await prismaClient.brand.update({
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
  console.log(`[updateBrand] Completed - id: ${id}`)
  return updatedBrand
}
