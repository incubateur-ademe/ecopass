"use server"

import { createProducts } from "../db/product"
import { createUpload } from "../db/upload"
import { auth } from "../services/auth/auth"
import { failUpload } from "../services/upload"
import { parseCSV } from "../utils/csv/parse"
import chardet from "chardet"

const encodingMap: Record<string, BufferEncoding> = {
  "iso-8859-1": "latin1",
}

const getEncoding = async (file: File) => {
  const blob = file.slice(0, 1024)
  const buffer = await blob.arrayBuffer()
  const uint8Array = new Uint8Array(buffer)
  const detected = chardet.detect(uint8Array)
  if (detected && detected.toLowerCase() in encodingMap) {
    return encodingMap[detected.toLowerCase()]
  }

  return detected
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
          if ("code" in error && error.code === "CSV_RECORD_INCONSISTENT_COLUMNS") {
            message = "Le fichier CSV contient des lignes avec un nombre de colonnes différent"
          } else {
            message = error.message as string
          }
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
