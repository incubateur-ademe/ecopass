"use server"
import { Status } from "../../prisma/src/prisma"
import { getProductsByUploadId } from "../db/product"
import { stringify } from "csv-stringify/sync"
import { productValidation } from "../services/validation/product"
import { getUploadById } from "../db/upload"

export const exportUpload = async (uploadId: string) => {
  const upload = await getUploadById(uploadId)
  if (!upload) {
    return "Fichier introuvable"
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
        const validation = productValidation.safeParse(product)
        if (!validation.success) {
          error = validation.error.issues.map((issue) => issue.message).join(", ")
        } else {
          error = "Erreur inconnue"
        }
      }
      return [product.ean, product.score?.score, error]
    }),
    {
      header: true,
      columns: ["EAN", "Score", "Erreur"],
    },
  )
}
