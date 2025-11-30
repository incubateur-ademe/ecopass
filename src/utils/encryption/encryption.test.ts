import { v4 as uuid } from "uuid"
import {
  encryptProductFields,
  encryptAndZipFile,
  decryptAndDezipFile,
  decryptProductFields,
  encrypt,
  decryptString,
  decryptNumber,
  decryptBoolean,
} from "./encryption"

const product = {
  product: "Jean",
  airTransportRatio: 0.1,
  business: "TPE/PME",
  fading: true,
  mass: 1.23,
  numberOfReferences: 2,
  price: 10.5,
  countryDyeing: "France",
  countryFabric: "France",
  countryMaking: "France",
  countrySpinning: "France",
  printing: { kind: "Pigmentaire", ratio: 0.5 },
  upcycled: false,
  materials: [{ id: "Coton", share: 1, country: "France" }],
  trims: [{ id: "Zip long", quantity: 1 }],
}

const checkDecryption = (product: any, encrypted: any, decrypted: any) => {
  const objectFields = ["trims", "materials", "printing"]
  const notEncryptedFields = ["gtins", "internalReference", "brand", "declaredScore", "product"]
  const encryptedFields = Object.keys(product).filter(
    (key) => !notEncryptedFields.includes(key) && !objectFields.includes(key),
  )

  for (const field of notEncryptedFields) {
    if (field === "product") {
      expect(encrypted.product.category).toEqual(product.product)
      expect(decrypted.category).toEqual(product.product)
    } else {
      expect(encrypted.product[field]).toEqual(product[field])
      expect(decrypted[field]).toEqual(product[field])
    }
  }

  for (const field of encryptedFields) {
    expect(encrypted.product[field]).not.toEqual(product[field])
    expect(typeof encrypted.product[field]).toBe("string")
    expect(decrypted[field]).toEqual(product[field])
  }

  encrypted.materials.forEach((material: any, i: number) => {
    expect(material.slug).not.toEqual(product.materials[i].id)
    expect(typeof material.slug).toBe("string")
    expect(decrypted.materials[i].slug).toEqual(product.materials[i].id)
    expect(material.country).not.toEqual(product.materials[i].country)
    expect(typeof material.country === "string").toBe(true)
    expect(decrypted.materials[i].country).toEqual(product.materials[i].country)
    expect(material.share).not.toEqual(product.materials[i].share)
    expect(typeof material.share).toBe("string")
    expect(decrypted.materials[i].share).toEqual(product.materials[i].share)
  })

  encrypted.accessories?.forEach((accessory: any, i: number) => {
    expect(accessory.slug).not.toEqual(product.trims[i].id)
    expect(typeof accessory.slug).toBe("string")
    expect(decrypted.accessories[i].slug).toEqual(product.trims[i].id)
    expect(accessory.quantity).not.toEqual(product.trims[i].quantity)
    expect(typeof accessory.quantity).toBe("string")
    expect(decrypted.accessories[i].quantity).toEqual(product.trims[i].quantity)
  })
}

describe("encryption utils", () => {
  it("encrypts and decrypts zero values", () => {
    const value = 0
    const encrypted = encrypt(value)
    const decrypted = decryptNumber(encrypted)
    expect(decrypted).toBe(value)
  })

  it("encrypts and decrypts false values", () => {
    const value = false
    const encrypted = encrypt(value)
    const decrypted = decryptBoolean(encrypted)
    expect(decrypted).toBe(value)
  })

  it("encryptProductFields returns encrypted fields and decrypts it", () => {
    const encrypted = encryptProductFields(product)
    const decrypted = decryptProductFields({
      id: "id-1",
      productId: "product-id-1",
      ...encrypted.product,
      materials: encrypted.materials.map((material) => ({ ...material, id: uuid(), productId: uuid() })),
      accessories: encrypted.accessories?.map((accessory) => ({ ...accessory, id: uuid(), productId: uuid() })) || [],
    })
    checkDecryption(product, encrypted, decrypted)
  })

  it("encryptAndZipFile / decryptAndDezipFile roundtrip", async () => {
    const buffer = Buffer.from("test file content")
    const filename = "test.txt"
    const encrypted = await encryptAndZipFile(buffer, filename)
    expect(encrypted).not.toBe(buffer.toString())
    const decrypted = await decryptAndDezipFile(encrypted)
    expect(decrypted.equals(buffer)).toBe(true)
  })

  it("encrypt/decrypt string", () => {
    const value = "hello world"
    const encrypted = encrypt(value)
    expect(decryptString(encrypted)).toBe(value)
  })

  it("encrypt/decrypt empty string", () => {
    const value = ""
    const encrypted = encrypt(value)
    const values = encrypted.split(":")
    expect(values.length).toBe(3)
    expect(values[2].length).not.toBe(0)
    expect(decryptString(encrypted)).toBe(undefined)
  })

  it("encrypt/decrypt undefined string", () => {
    const value = undefined
    const encrypted = encrypt(value)
    const values = encrypted.split(":")
    expect(values.length).toBe(3)
    expect(values[2].length).not.toBe(0)
    expect(decryptString(encrypted)).toBe(value)
  })
})
