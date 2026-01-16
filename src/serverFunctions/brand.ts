"use server"

import { prismaClient } from "../db/prismaClient"
import { auth } from "../services/auth/auth"

export const addNewBrand = async (brand: string) => {
  console.log("[MEMORY][serverFunctions/brand/addNewBrand][start]", process.memoryUsage())
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

  const result = await prismaClient.brand.create({
    data: {
      name: trimmedBrand,
      organization: { connect: { id: user.organization.id } },
    },
  })
  console.log("[MEMORY][serverFunctions/brand/addNewBrand][end]", process.memoryUsage())
  return result
}

export const updateBrand = async (id: string, data: { name: string; active: boolean }) => {
  console.log("[MEMORY][serverFunctions/brand/updateBrand][start]", process.memoryUsage())
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

  const result = await prismaClient.brand.update({
    where: {
      id: id,
      organizationId: user.organization.id,
      default: false,
    },
    data: {
      name: data.name.trim(),
      active: data.active,
    },
  })
  console.log("[MEMORY][serverFunctions/brand/updateBrand][end]", process.memoryUsage())
  return result
}
