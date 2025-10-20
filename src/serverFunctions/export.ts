"use server"
import { Status } from "../../prisma/src/prisma"
import { getOrganizationProductsByUserIdAndBrand, getProductsByUploadId } from "../db/product"
import { stringify } from "csv-stringify/sync"
import * as XLSX from "xlsx"
import { getUploadById } from "../db/upload"
import { auth } from "../services/auth/auth"
import { createExport } from "../db/export"

export const exportScores = async (brand?: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }
  const products = await getOrganizationProductsByUserIdAndBrand(session.user.id, 0, undefined, brand)

  const data = products.map((product) => [product.internalReference, product.score ? Math.round(product.score) : ""])

  const headers = ["Référence interne", "Score"]

  return stringify(data, {
    header: true,
    columns: headers,
  })
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
  const data = products.map((product) => {
    let error = ""
    if (product.status === Status.Error) {
      error = product.error || "Erreur inconnue"
    }
    return [product.internalReference, product.score ? Math.round(product.score) : "", error]
  })

  const headers = ["Référence interne", "Score", "Erreur"]

  if (upload.name && upload.name.toLowerCase().endsWith(".xlsx")) {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Export")
    return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }))
  }

  return stringify(data, {
    header: true,
    columns: headers,
  })
}

export const exportProducts = async (brand?: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  return createExport(session.user.id, brand)
}
