"use server"

import { createProducts } from "../db/product"
import { createUpload } from "../db/upload"
import { auth } from "../services/auth/auth"
import { ProductWithMaterialsAndAccessories } from "../types/Product"
import { parseCSV } from "../utils/csv/parse"
import { parseJson } from "../utils/json/parse"

export async function uploadFile(file: File) {
  const session = await auth()
  if (!session || !session.user) {
    return
  }

  const content = await file.text()
  const upload = await createUpload(session.user.id, file.name)
  let products: ProductWithMaterialsAndAccessories[] = []
  try {
    const json = JSON.parse(content)
    products = parseJson(Array.isArray(json) ? json : [json], upload.id)
  } catch (error) {
    console.error("Error parsing JSON:", error)
    products = await parseCSV(content, upload.id)
  }
  await createProducts(products)
}
