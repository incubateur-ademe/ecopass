"use server"

import { createProducts } from "../db/product"
import { createUpload } from "../db/upload"
import { auth } from "../services/auth/auth"
import { failUpload } from "../services/upload"
import { ProductWithMaterialsAndAccessories } from "../types/Product"
import { parseCSV } from "../utils/csv/parse"
import { parseJson } from "../utils/json/parse"
import chardet from "chardet"

export async function uploadFile(file: File) {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }
  let upload

  try {
    const content = await file.text()
    upload = await createUpload(session.user.id, file.name)
    let products: ProductWithMaterialsAndAccessories[] = []
    try {
      const json = JSON.parse(content)
      products = parseJson(Array.isArray(json) ? json : [json], upload.id)
    } catch (error) {
      console.error("Error parsing JSON:", error)
      try {
        const buffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(buffer)
        const encoding = chardet.detect(uint8Array)

        products = await parseCSV(content, encoding, upload.id)
      } catch (error) {
        let message = "Ereur lors de l'analyse du fichier CSV"
        if (error && typeof error === "object" && "message" in error) {
          message = error.message as string
        }
        await failUpload(upload, message)
        return
      }
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
