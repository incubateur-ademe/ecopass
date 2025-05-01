"use server"

import { createProducts } from "../db/product"
import { createUpload } from "../db/upload"
import { parseCSV } from "../utils/csv/parse"

export async function uploadCSV(file: File) {
  const content = await file.text()
  const upload = await createUpload()
  const products = await parseCSV(content, upload.id)
  await createProducts(products)
}
