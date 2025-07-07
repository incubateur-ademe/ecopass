import "dotenv/config"
import { downloadFileFromS3 } from "../utils/s3/bucket"
import { decryptAndDezipFile } from "../db/encryption"
import fs from "fs"
import path from "path"

const main = async (uploadId: string) => {
  try {
    console.log(`Téléchargement du fichier pour l'upload ID : ${uploadId}`)
    const encryptedZip = await downloadFileFromS3(uploadId, "upload")
    console.log("File", encryptedZip)
    const csvBuffer = await decryptAndDezipFile(encryptedZip)
    const outputPath = path.resolve(process.cwd(), `${uploadId}.csv`)
    fs.writeFileSync(outputPath, csvBuffer)
    console.log(`Fichier CSV téléchargé et sauvegardé sous : ${outputPath}`)
  } catch (e) {
    console.error("Erreur lors du téléchargement ou du déchiffrement :", e)
    process.exit(1)
  }
}

const uploadId = process.argv[2]
if (!uploadId) {
  console.error("Usage: tsx src/scripts/downloadCSV.ts <uploadId>")
  process.exit(1)
}

main(uploadId)
