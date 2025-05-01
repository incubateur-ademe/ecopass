import fs from "fs"
import { parseCSV } from "../utils/csv/parse"
import { createUpload, failUpload } from "../db/upload"
import { createProducts } from "../db/product"

const getScores = async (file: string) => {
  const content = fs.readFileSync(file, { encoding: "utf-8" })
  const upload = await createUpload()
  try {
    const products = await parseCSV(content, upload.id)
    await createProducts(products)
  } catch (error) {
    console.error("Error processing file:", error)
    await failUpload(upload.id)
  }
}

getScores(process.argv[2])
