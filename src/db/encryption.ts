import crypto from "crypto"
import { ProductAPIValidation } from "../services/validation/api"
import { ParsedProduct } from "../types/Product"
import JSZip from "jszip"

const ALGO = "aes-256-gcm"
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex")
const STORAGE_KEY = Buffer.from(process.env.STORAGE_ENCRYPTION_KEY!, "hex")
const IV_LENGTH = 12

export function encrypt(value: string | number | boolean | undefined): string {
  const plainText = (value || "").toString()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGO, KEY, iv)
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`
}

function decrypt(data: string) {
  const [ivHex, tagHex, encryptedHex] = data.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const tag = Buffer.from(tagHex, "hex")
  const encrypted = Buffer.from(encryptedHex, "hex")
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString("utf8")
}

export const decryptNumber = (data: string) => {
  const decrypted = decrypt(data)
  const value = parseFloat(decrypted)
  return isNaN(value) ? (decrypted === "" ? undefined : decrypted) : value
}

export const decryptBoolean = (data: string) => {
  const decrypted = decrypt(data)
  if (decrypted === "true") {
    return true
  } else if (decrypted === "false") {
    return false
  }
  return decrypted === "" ? undefined : decrypted
}

export const decryptString = (data: string) => {
  const decrypted = decrypt(data)
  return decrypted || undefined
}

export function encryptProductFields(product: ProductAPIValidation | ParsedProduct) {
  const date =
    product.date instanceof Date
      ? `${product.date.getDate().toString().padStart(2, "0")}/${(product.date.getMonth() + 1).toString().padStart(2, "0")}/${product.date.getFullYear()}`
      : product.date
  return {
    product: {
      gtin: product.gtin,
      date: date,
      brand: product.brand,
      declaredScore: product.declaredScore || null,
      category: encrypt(product.product),
      airTransportRatio: encrypt(product.airTransportRatio),
      business: encrypt(product.business),
      fading: encrypt(product.fading),
      mass: encrypt(product.mass),
      numberOfReferences: encrypt(product.numberOfReferences),
      price: encrypt(product.price),
      traceability: encrypt(product.traceability),
      countryDyeing: encrypt(product.countryDyeing),
      countryFabric: encrypt(product.countryFabric),
      countryMaking: encrypt(product.countryMaking),
      countrySpinning: encrypt(product.countrySpinning),
      impression: encrypt(product.printing?.kind),
      impressionPercentage: encrypt(product.printing?.ratio),
      upcycled: encrypt(product.upcycled),
      materials: undefined,
      accessories: undefined,
    },
    materials: product.materials.map((material) => ({
      slug: encrypt(material.id),
      country: material.country ? encrypt(material.country) : null,
      share: encrypt(material.share),
    })),
    accessories: product.trims?.map((trim) => ({
      slug: encrypt(trim.id),
      quantity: encrypt(trim.quantity),
    })),
  }
}

export const encryptAndZipFile = async (buffer: Buffer, filename: string) => {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGO, STORAGE_KEY, iv)

  const zip = new JSZip()
  zip.file(filename, buffer)
  const zippedBuffer = await zip.generateAsync({ type: "nodebuffer" })

  const encrypted = Buffer.concat([cipher.update(zippedBuffer), cipher.final()])
  const tag = cipher.getAuthTag()
  const encryptedZip = Buffer.concat([iv, encrypted, tag])
  return encryptedZip
}

export const decryptAndDezipFile = async (encryptedBuffer: Buffer) => {
  const iv = encryptedBuffer.subarray(0, IV_LENGTH)
  const tag = encryptedBuffer.subarray(encryptedBuffer.length - 16)
  const encryptedData = encryptedBuffer.subarray(IV_LENGTH, encryptedBuffer.length - 16)

  const decipher = crypto.createDecipheriv(ALGO, STORAGE_KEY, iv)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()])

  const dezipped = await JSZip.loadAsync(decrypted)
  return dezipped.files[Object.keys(dezipped.files)[0]].async("nodebuffer")
}
