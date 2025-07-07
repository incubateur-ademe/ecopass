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
    const id = uuid()
    const zip = await encryptAndZipFile(Buffer.from(await file.arrayBuffer()), id)
    await uploadFileToS3(id, zip, "upload")
    await createUpload(session.user.id, UploadType.FILE, file.name, id)
  } catch (error) {
    console.error("Error during upload:", error)
    return "Erreur inconnue lors du traitement du fichier"
  }
}
