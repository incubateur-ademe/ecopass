"use server"
import { Status } from "../../prisma/src/prisma"
import { getProductsByUploadId } from "../db/product"
import { stringify } from "csv-stringify/sync"
import { getUploadById } from "../db/upload"
import { auth } from "../services/auth/auth"
import { createExport } from "../db/export"

export const exportUpload = async (uploadId: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  const upload = await getUploadById(uploadId)
  if (!upload) {
    return "Fichier introuvable"
  }

  if (upload.userId !== session.user.id) {
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
      return [product.gtin, product.score?.score, error]
    }),
    {
      header: true,
      columns: ["GTIN", "Score", "Erreur"],
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
