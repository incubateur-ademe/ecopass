import crypto from "crypto"

const ALGO = "aes-256-gcm"
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex")
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
