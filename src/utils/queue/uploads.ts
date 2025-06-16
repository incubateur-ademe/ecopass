import chardet from "chardet"
import { parseCSV } from "../csv/parse"
import { createProducts } from "../../db/product"
import { failUpload } from "../../services/upload"
import { getFirstUpload, updateUploadToPending } from "../../db/upload"
import { downloadFileFromS3 } from "../s3/bucket"

const encodingMap: Record<string, BufferEncoding> = {
  "iso-8859-1": "latin1",
}

const getEncoding = async (buffer: Buffer) => {
  const detected = chardet.detect(buffer)
  if (detected && detected.toLowerCase() in encodingMap) {
    return encodingMap[detected.toLowerCase()]
  }

  return detected
}
export const processUploadsToQueue = async () => {
  const upload = await getFirstUpload()
  if (!upload) {
    return
  }

  console.log("Processing upload:", upload.id)
  const buffer = await downloadFileFromS3(`uploads/${upload.id}`)
  try {
    await updateUploadToPending(upload.id)
    const encoding = await getEncoding(buffer)
    const csvData = await parseCSV(buffer, encoding, upload.id)
    await createProducts(csvData)
    console.log(`Upload processed, ${csvData.products.length} products created`)
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
  }
}
