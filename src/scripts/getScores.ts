import fs from "fs"
import { parseCSV } from "../utils/csv/parse"
import { checkUploadsStatus, createUpload, updateUploadToError } from "../db/upload"
import { createProducts } from "../db/product"
import { prismaClient } from "../db/prismaClient"
import chardet from "chardet"

const getScores = async (file: string) => {
  const encoding = chardet.detect(fs.readFileSync(file)) as BufferEncoding
  const content = fs.readFileSync(file, { encoding })
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
    await updateUploadToError(upload.id)
  }
}

getScores(process.argv[2])
