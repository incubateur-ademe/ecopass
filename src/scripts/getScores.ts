import fs from "fs"
import { parseCSV } from "../utils/csv/parse"
import { checkUploadsStatus, createUpload, failUpload } from "../db/upload"
import { createProducts } from "../db/product"
import { prismaClient } from "../db/prismaClient"
import chardet from "chardet"

const getScores = async (file: string) => {
  const content = fs.readFileSync(file)
  const encoding = chardet.detect(content)
  const randomUser = await prismaClient.user.findFirst()
  if (!randomUser) {
    throw new Error("No user found")
  }
  const upload = await createUpload(randomUser.id, file)
  try {
    const products = await parseCSV(content, encoding, upload.id)
    await createProducts(products)
    await checkUploadsStatus([upload.id])
  } catch (error) {
    console.error("Error processing file:", error)
    await failUpload(upload.id)
  }
}

getScores(process.argv[2])
