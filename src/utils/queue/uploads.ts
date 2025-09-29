import chardet from "chardet"
import { parseCSV } from "../parsing/csv/parse"
import { parseExcel } from "../parsing/excel/parse"
import { createProducts } from "../../db/product"
import { failUpload } from "../../services/upload"
import { checkUploadsStatus, getFirstFileUpload, updateUploadToPending } from "../../db/upload"
import { downloadFileFromS3 } from "../s3/bucket"
import { decryptAndDezipFile } from "../encryption/encryption"
import path from "path"
import { FileUpload } from "../../db/upload"

const encodingMap: Record<string, BufferEncoding> = {
  "iso-8859-1": "latin1",
  "windows-1252": "latin1",
}

const getEncoding = async (buffer: Buffer) => {
  const detected = chardet.detect(buffer)
  if (detected && detected.toLowerCase() in encodingMap) {
    return encodingMap[detected.toLowerCase()]
  }

  return detected
}

const getFile = async (uploadId: string) => {
  const zip = await downloadFileFromS3(uploadId, "upload")
  return decryptAndDezipFile(zip)
}

const parseFile = async (buffer: Buffer, upload: NonNullable<FileUpload>) => {
  const extension = upload.name && path.extname(upload.name).toLowerCase()
  if (extension === ".xlsx") {
    return parseExcel(buffer, upload)
  } else {
    const encoding = await getEncoding(buffer)
    return parseCSV(buffer, encoding, upload)
  }
}

export const processUploadsToQueue = async () => {
  const upload = await getFirstFileUpload()
  if (!upload) {
    return
  }

  console.log("Processing upload:", upload.id)
  try {
    const buffer = await getFile(upload.id)
    await updateUploadToPending(upload.id)
    const parsedData = await parseFile(buffer, upload)
    const numberOfCreatedProduct = await createProducts(parsedData)
    if (numberOfCreatedProduct === 0) {
      await checkUploadsStatus([upload.id])
    }
    console.log(`Upload processed, ${parsedData.products.length} products, ${numberOfCreatedProduct} created`)
  } catch (error) {
    let message = "Erreur lors de l'analyse du fichier"
    if (error && typeof error === "object" && "message" in error) {
      if ("code" in error && error.code === "CSV_RECORD_INCONSISTENT_COLUMNS") {
        message = "Le fichier CSV contient des lignes avec un nombre de colonnes différent"
      } else {
        message = error.message as string
      }
    }
    await failUpload(upload, message)
  }
}
