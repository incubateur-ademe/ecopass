"use server"
import { Status } from "../../prisma/src/prisma"
import { getOrganizationProductsByUserIdAndBrand, getProductsByUploadId } from "../db/product"
import { stringify } from "csv-stringify/sync"
import { getUploadById } from "../db/upload"
import { auth } from "../services/auth/auth"
import { createExport } from "../db/export"

export const exportScores = async (brand?: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }
  const products = await getOrganizationProductsByUserIdAndBrand(session.user.id, 0, undefined, brand)
  return stringify(
    products.map((product) => {
      return [product.internalReference, product.score?.score]
    }),
    {
      header: true,
      columns: ["Référence interne", "Score"],
    },
  )
}

export const exportUpload = async (uploadId: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  const upload = await getUploadById(uploadId)
  if (!upload) {
    return "Fichier introuvable"
  }

  if (upload.createdById !== session.user.id) {
    return "Vous n'êtes pas autorisé à accéder à ce fichier"
  }

  if (upload.status !== Status.Done && upload.status !== Status.Error) {
    return "Fichier en cours de traitement"
  }

  if (upload.status === Status.Error && upload.error) {
    return upload.error
  }

  const products = await getProductsByUploadId(uploadId)
  return stringify(
    products.map((product) => {
      let error = ""
      if (product.status === Status.Error) {
        error = product.error || "Erreur inconnue"
      }
      return [
        product.internalReference,
        product.score !== null && product.score !== undefined ? Math.round(product.score.score) : "",
        error,
      ]
    }),
    {
      header: true,
      columns: ["Référence interne", "Score", "Erreur"],
    },
  )
}

export const exportProducts = async (brand?: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  return createExport(session.user.id, brand)
}
