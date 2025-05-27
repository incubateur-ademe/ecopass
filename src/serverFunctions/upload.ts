"use server"

import { createProducts } from "../db/product"
import { createUpload } from "../db/upload"
import { auth } from "../services/auth/auth"
import { failUpload } from "../services/upload"
import { ProductWithMaterialsAndAccessories } from "../types/Product"
import { parseCSV } from "../utils/csv/parse"
import chardet from "chardet"

const getEncoding = async (file: File) => {
  const blob = file.slice(0, 1024)
  const buffer = await blob.arrayBuffer()
  const uint8Array = new Uint8Array(buffer)
  const encoding = chardet.detect(uint8Array) as BufferEncoding | null
  return encoding
}

export async function uploadFile(file: File) {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }
  let upload

  try {
    upload = await createUpload(session.user.id, file.name)
    let products: ProductWithMaterialsAndAccessories[] = []
    try {
      const encoding = await getEncoding(file)
      products = await parseCSV(file, encoding, upload.id)
    } catch (error) {
      let message = "Ereur lors de l'analyse du fichier CSV"
      if (error && typeof error === "object" && "message" in error) {
        message = error.message as string
      }
      await failUpload(upload, message)
      return
    }
    await createProducts(products)
  } catch (error) {
    console.error("Error processing file:", error)
    if (upload) {
      await failUpload(upload, "Erreur inconnue lors du traitement du fichier")
    }
    return "Erreur inconnue lors du traitement du fichier"
  }
}
