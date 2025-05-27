"use server"

import { createProducts } from "../db/product"
import { createUpload } from "../db/upload"
import { auth } from "../services/auth/auth"
import { failUpload } from "../services/upload"
import { parseCSV } from "../utils/csv/parse"
import chardet from "chardet"

const getEncoding = async (file: File) => {
  const blob = file.slice(0, 1024)
  const buffer = await blob.arrayBuffer()
  const uint8Array = new Uint8Array(buffer)
  return chardet.detect(uint8Array) as BufferEncoding | null
}

export const uploadFile = async (file: File) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  try {
    const upload = await createUpload(session.user.id, file.name)
    new Promise<void>(async (resolve) => {
      try {
        const encoding = await getEncoding(file)
        const products = await parseCSV(file, encoding, upload.id)
        await createProducts(products)
      } catch (error) {
        let message = "Ereur lors de l'analyse du fichier CSV"
        if (error && typeof error === "object" && "message" in error) {
          message = error.message as string
        }
        await failUpload(upload, message)
        resolve()
      }
    })
  } catch (error) {
    console.error("Error during upload:", error)
    return "Erreur inconnue lors du traitement du fichier"
  }
}
