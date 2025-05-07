"use server"

import { createProducts } from "../db/product"
import { createUpload } from "../db/upload"
import { auth } from "../services/auth/auth"
import { parseCSV } from "../utils/csv/parse"

export async function uploadCSV(file: File) {
  const session = await auth()
  if (!session || !session.user) {
    return
  }
  const content = await file.text()
  const upload = await createUpload(session.user.id, file.name)
  const products = await parseCSV(content, upload.id)
  await createProducts(products)
}
