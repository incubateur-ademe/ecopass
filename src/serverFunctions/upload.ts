"use server"

import { v4 as uuid } from "uuid"
import { UploadType } from "../../prisma/src/prisma"
import { createUpload } from "../db/upload"
import { auth } from "../services/auth/auth"
import { uploadFileToS3 } from "../utils/s3/bucket"
import { encryptAndZipFile } from "../utils/encryption/encryption"
import path from "path"

const ALLOWED_MIME_TYPES = [
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]

const MAX_FILE_SIZE = 1 * 1024 * 1024
const ALLOWED_FILE_EXTENSIONS = [".csv", ".xlsx"]

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, "_")
    .substring(0, 255)
}

const isValidFileExtension = (fileName: string): boolean => {
  const extension = path.extname(fileName).toLowerCase()
  return ALLOWED_FILE_EXTENSIONS.includes(extension)
}

const scanFileContent = async (buffer: Buffer): Promise<boolean> => {
  const content = buffer.toString("utf8", 0, Math.min(buffer.length, 1024))

  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /eval\(/i,
    /document\.cookie/i,
    /window\.location/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ]

  return !suspiciousPatterns.some((pattern) => pattern.test(content))
}

export const uploadFile = async (file: File) => {
  const session = await auth()
  if (!session || !session.user) {
    return "Veuillez vous reconnecter et réessayer"
  }

  try {
    if (file.size > MAX_FILE_SIZE) {
      return "Le fichier est trop volumineux. Taille maximale autorisée : 1MB"
    }

    if (file.size === 0) {
      return "Le fichier est vide"
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return `Type de fichier non autorisé. Types acceptés : ${ALLOWED_MIME_TYPES.join(", ")}`
    }

    if (!isValidFileExtension(file.name)) {
      return `Extension de fichier non autorisée. Extensions acceptées : ${ALLOWED_FILE_EXTENSIONS.join(", ")}`
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const isContentSafe = await scanFileContent(buffer)
    if (!isContentSafe) {
      return "Le contenu du fichier contient des éléments potentiellement dangereux"
    }

    const sanitizedFileName = sanitizeFileName(file.name)
    const id = uuid()
    const zip = await encryptAndZipFile(buffer, id)
    await uploadFileToS3(id, zip, "upload")
    await createUpload(session.user.id, UploadType.FILE, sanitizedFileName, id)

    return null
  } catch (error) {
    console.error("Error during upload:", error)
    return "Erreur inconnue lors du traitement du fichier"
  }
}
