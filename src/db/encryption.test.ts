import {
  encrypt,
  decryptString,
  decryptNumber,
  decryptBoolean,
  encryptProductFields,
  encryptAndZipFile,
  decryptAndDezipFile,
} from "./encryption"

describe("encryption utils", () => {
  it("encrypt/decrypt string", () => {
    const value = "hello world"
    const encrypted = encrypt(value)
    expect(decryptString(encrypted)).toBe(value)
  })

  it("encrypt/decrypt number", () => {
    const value = 42.5
    const encrypted = encrypt(value)
    expect(decryptNumber(encrypted)).toBeCloseTo(value)
  })

  it("encrypt/decrypt boolean", () => {
    const value = true
    const encrypted = encrypt(value)
    expect(decryptBoolean(encrypted)).toBe(value)
    const encryptedFalse = encrypt(false)
    expect(decryptBoolean(encryptedFalse)).toBe(false)
  })

  it("encryptProductFields returns encrypted fields", () => {
    const product = {
      gtin: "12345678",
      date: new Date("2024-01-01"),
      brand: "TestBrand",
      declaredScore: 99,
      product: "Jean",
      airTransportRatio: 0.1,
      business: "TPE/PME",
      fading: true,
      mass: 1.23,
      numberOfReferences: 2,
      price: 10.5,
      traceability: false,
      countryDyeing: "France",
      countryFabric: "France",
      countryMaking: "France",
      countrySpinning: "France",
      printing: { kind: "Pigmentaire", ratio: 0.5 },
      upcycled: false,
      materials: [{ id: "Coton", share: 1, country: "France" }],
      trims: [{ id: "Zip long", quantity: 1 }],
    }
    const encrypted = encryptProductFields(product)
    expect(typeof encrypted.product.category).toBe("string")
    expect(typeof encrypted.materials[0].slug).toBe("string")
    expect(typeof encrypted.accessories[0].slug).toBe("string")
  })

  it("encryptAndZipFile / decryptAndDezipFile roundtrip", async () => {
    const buffer = Buffer.from("test file content")
    const filename = "test.txt"
    const encrypted = await encryptAndZipFile(buffer, filename)
    const decrypted = await decryptAndDezipFile(encrypted)
    expect(decrypted.equals(buffer)).toBe(true)
  })
})
