"use server"

import { v4 as uuid } from "uuid"
import { OrganizationRole, UploadType } from "@prisma/client"
import { createUpload } from "../db/upload"
import { auth } from "../services/auth/auth"
import { uploadFileToS3 } from "../utils/s3/bucket"
import { encryptAndZipFile } from "../utils/encryption/encryption"
import path from "path"
import { organizationTypesAllowedToDeclare } from "../utils/organization/canDeclare"
import { getUser, getUserOrganizationType } from "../db/user"
import { getUserProductSimplifiedDeclarationValidation } from "../services/validation/api"
import { computeEcobalyseScore } from "../utils/ecobalyse/api"
import { createScore } from "../db/score"
import { hashProduct } from "../utils/encryption/hash"
import { prismaClient } from "../db/prismaClient"
import { getProductConfidenceLevel } from "../utils/product/confidence"
import { checkOldProduct } from "../services/validation/oldProduct"
import { ProductCheckResult } from "../services/validation/productCheckResult"

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

  const user = await getUser(session.user.id)
  if (!user) {
    return "Utilisateur non trouvé"
  }

  if (user.organizationRole !== OrganizationRole.ADMIN) {
    return "Vous n'avez pas les droits pour uploader des fichiers"
  }

  const organizationType = await getUserOrganizationType(session.user.id)
  if (!organizationTypesAllowedToDeclare.includes(organizationType!)) {
    return "Vous n'êtes pas autorisé à uploader des fichiers"
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

export type SimplifiedDeclarationData = {
  brandName: string
  brandId?: string
  gtin: string
  internalReference: string
  url: string
  product: string
  mass: number
  materials: { id: string; share: number }[]
  countryFabric?: string
  countryDyeing?: string
  countryMaking?: string
  countrySpinning?: string
}

export const createProductFromSimplifiedDeclaration = async (data: SimplifiedDeclarationData) => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const user = await getUser(session.user.id)
    if (!user) {
      throw new Error("User not found")
    }

    const normalizedBrandName = data.brandName.trim()
    if (!normalizedBrandName) {
      throw new Error("Le nom de la marque ne peut pas être vide")
    }

    const providedBrandId = data.brandId?.trim()

    const selectedBrand = providedBrandId
      ? await prismaClient.brand.findUnique({
          where: { id: providedBrandId },
          select: { id: true },
        })
      : await prismaClient.brand.findFirst({
          where: {
            name: {
              equals: normalizedBrandName,
              mode: "insensitive",
            },
          },
          select: { id: true },
        })

    const resolvedBrand =
      selectedBrand ||
      (await prismaClient.brand.create({
        data: {
          name: normalizedBrandName,
        },
        select: { id: true },
      }))

    const validatedData = getUserProductSimplifiedDeclarationValidation([resolvedBrand.id]).safeParse({
      ...data,
      mass: data.mass / 1000,
      brandId: resolvedBrand.id,
    })

    if (validatedData.error) {
      throw new Error(`Validation error: ${validatedData.error.message}`)
    }

    const confidenceLevel = getProductConfidenceLevel(user, validatedData.data.brandId)
    const { product, informations } = {
      product: {
        internalReference: validatedData.data.internalReference,
        declaredScore: validatedData.data.declaredScore,
        brandId: validatedData.data.brandId,
        gtins: [data.gtin],
        confidenceLevel,
      },
      informations: [validatedData.data],
    }

    const hash = await hashProduct(product, informations, [resolvedBrand.id])
    const oldProductCheck = await checkOldProduct([data.gtin], hash, confidenceLevel, {
      userId: user.id,
      userType: user.type,
      organizationId: user.organization?.id ?? null,
    })
    if (oldProductCheck.result === ProductCheckResult.Unchanged) {
      throw new Error("Le produit existe déjà.")
    }

    if (oldProductCheck.result === ProductCheckResult.TooRecent) {
      throw new Error("Un produit avec le même GTIN a été déclaré trop récemment.")
    }

    if (oldProductCheck.result === ProductCheckResult.HigherConfidence) {
      throw new Error("Un produit avec le même GTIN a été déclaré avec une confiance plus élevée.")
    }

    const scores = await Promise.all(informations.map((information) => computeEcobalyseScore(information)))
    const computedScores = await createScore(
      user,
      product,
      informations,
      scores,
      hash,
      UploadType.SIMPLIFIED,
      confidenceLevel,
    )

    return {
      success: true,
      score: {
        score: computedScores?.score || 0,
        standardized: computedScores?.standardized || 0,
      },
      message: "Produit créé avec succès",
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
