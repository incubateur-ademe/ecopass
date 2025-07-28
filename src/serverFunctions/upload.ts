"use server"

import { v4 as uuid } from "uuid"
import { UploadType } from "../../prisma/src/prisma"
import { encryptAndZipFile } from "../db/encryption"
import { createUpload } from "../db/upload"
import { auth } from "../services/auth/auth"
import { uploadFileToS3 } from "../utils/s3/bucket"

export const uploadFile = async (file: File) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  try {
    console.log("Starting file upload:", file.name)
    const id = uuid()
    console.log("Generated unique ID for upload:", id)
    const zip = await encryptAndZipFile(Buffer.from(await file.arrayBuffer()), id)
    console.log("File encrypted and zipped successfully")
    await uploadFileToS3(id, zip, "upload")
    console.log("File uploaded to S3 successfully")
    await createUpload(session.user.id, UploadType.FILE, file.name, id)
    console.log("Upload record created in database")
  } catch (error) {
    console.error("Error during upload:", error)
    return "Erreur inconnue lors du traitement du fichier"
  }
}
