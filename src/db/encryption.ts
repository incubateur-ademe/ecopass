import crypto from "crypto"
import { ProductAPIValidation } from "../services/validation/api"
import { ParsedProduct } from "../types/Product"
import JSZip from "jszip"
import { Accessory, Material, Product, Score } from "../../prisma/src/prisma"

const ALGO = "aes-256-gcm"
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex")
const STORAGE_KEY = Buffer.from(process.env.STORAGE_ENCRYPTION_KEY!, "hex")
const IV_LENGTH = 12

export function encrypt(value: string | number | boolean | undefined): string {
  const payload = {
    v: value === undefined ? "" : value,
    n: crypto.randomBytes(8).toString("hex"),
  }
  const plainText = JSON.stringify(payload)
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
  const decryptedText = decrypted.toString("utf8")
  try {
    const payload = JSON.parse(decryptedText)
    return payload instanceof Object && "v" in payload ? payload.v : payload
  } catch {
    return decryptedText
  }
}

export const decryptNumber = (data: string) => {
  const decrypted = decrypt(data)
  const value = parseFloat(decrypted)
  return isNaN(value) ? (decrypted === null || decrypted === "" ? undefined : decrypted) : value
}

export const decryptBoolean = (data: string) => {
  const decrypted = decrypt(data)
  if (decrypted === true || decrypted === "true") {
    return true
  } else if (decrypted === false || decrypted === "false") {
    return false
  }
  return decrypted === null || decrypted === "" ? undefined : decrypted
}

export const decryptString = (data: string) => {
  const decrypted = decrypt(data)
  return decrypted === null || decrypted === "" ? undefined : decrypted
}

export const decryptProductFields = (
  product: Product & {
    materials: Material[]
    accessories: Accessory[]
    score?: Score | null
    upload: {
      createdBy: {
        organization: {
          name: string
          authorizedBy: { from: { name: string; brands: { name: string }[] } }[]
          brands: { name: string }[]
        } | null
      }
    }
  },
) => ({
  ...product,
  category: decryptString(product.category),
  business: decryptString(product.business),
  countryDyeing: decryptString(product.countryDyeing),
  countryFabric: decryptString(product.countryFabric),
  countryMaking: decryptString(product.countryMaking),
  countrySpinning: decryptString(product.countrySpinning),
  mass: decryptNumber(product.mass),
  price: decryptNumber(product.price),
  airTransportRatio: decryptNumber(product.airTransportRatio),
  numberOfReferences: decryptNumber(product.numberOfReferences),
  fading: decryptBoolean(product.fading),
  upcycled: decryptBoolean(product.upcycled),
  impression: decryptString(product.impression),
  impressionPercentage: decryptNumber(product.impressionPercentage),
  materials: product.materials.map((material) => ({
    ...material,
    slug: decryptString(material.slug),
    country: material.country ? decryptString(material.country) : undefined,
    share: decryptNumber(material.share),
  })),
  accessories: product.accessories.map((accessory) => ({
    ...accessory,
    slug: decryptString(accessory.slug),
    quantity: decryptNumber(accessory.quantity),
  })),
})

export function encryptProductFields(product: ProductAPIValidation | ParsedProduct) {
  const date =
    product.date instanceof Date
      ? `${product.date.getDate().toString().padStart(2, "0")}/${(product.date.getMonth() + 1).toString().padStart(2, "0")}/${product.date.getFullYear()}`
      : product.date
  return {
    product: {
      gtins: product.gtins,
      internalReference: product.internalReference,
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
