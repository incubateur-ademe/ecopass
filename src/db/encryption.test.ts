import { v4 as uuid } from "uuid"
import {
  encryptProductFields,
  encryptAndZipFile,
  decryptAndDezipFile,
  decryptProductFields,
  encrypt,
  decryptString,
} from "./encryption"
import { Status } from "../../prisma/src/prisma"

const product = {
  gtin: "12345678",
  date: new Date("2024-12-31"),
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

const oldEncryptions = [
  {
    product: {
      gtin: "12345678",
      date: "31/12/2024",
      brand: "TestBrand",
      declaredScore: 99,
      category: "8357e82c3e41947bfdda6bf2:d53abd5bb37578c6c4e10a9dc0b451fe:4f675ab0",
      airTransportRatio: "5eb3449c044b028641191f62:6ae1dec0371ba44d63e7bdd2ed0221dd:ca8282",
      business: "5b24ec6892c136ec3f5cb880:515d31ad2ca3d373aab392c7f8993c8c:2b0facaf470b56",
      fading: "e09f5fc0a5043428f942995c:27b11945acf83e89a679bc17992643d6:4d14d5c7",
      mass: "008dacedda074d044b95da86:d953567e856ceded4e2ffebc4540dd65:57d82663",
      numberOfReferences: "0d5c177201be2f2c1a7cf845:37dd2d5704454572cfdeaf750b00eaa9:be",
      price: "31e85f24e020d65a45da662b:4c9ae508e542132b304f04f27054d1bc:b6f4be83",
      traceability: "2c049b29a18def0dfb361af5:f07f649fdfd1a6123ce6f4ff9f7f17e0:478087ec28",
      countryDyeing: "279cdbf96c317ce3c1e7cfdb:9507fa5aa55f6b1db6e11720e516efe6:17c095a638ce",
      countryFabric: "3f22ed77ec07ea290614d1cf:049b18f64a4fc98f685d7b6b2d8024e6:81bc9b9e4db3",
      countryMaking: "24259ad981fc576cf4af73b6:21f2c86493b0c041d17f452d2b033b7e:a265564c3b72",
      countrySpinning: "7eb1159b37e52f601432fd66:7bfc4d74d57e96894a7f98faff25f7e4:6d12b238020c",
      impression: "c90616b526a0034f463aa0c9:88ad3056cce5732674ebb8b273c5ec72:50c778040bc594b79bb31b",
      impressionPercentage: "73744a46c814f7e4615e9954:5629532d5bf3b65d9320ca434e718454:59de6e",
      upcycled: "f3420cc4e9c8c5508696e229:98f9890bcd4163ad8acd1684b59b9960:6a699331b2",
      materials: undefined,
      accessories: undefined,
    },
    materials: [
      {
        slug: "364a31f33a47c515e3bceed1:35bfe2b89947dec622c157c258f6798e:1f30713fda",
        country: "953ffe27054b3daee83b975f:e995645fa2e301361e2fd6665dc2d438:e8340535a18f",
        share: "a2edcaaa54bdae586eb0588b:c0a5d5d1a41183e84345fadbb19b3144:a7",
      },
    ],
    accessories: [
      {
        slug: "967f829b169121e8e712bc09:02cc786727793a0e15d6ba1235afff04:798647a5c9b6eb2b",
        quantity: "c6309c8c1db0e67c0085deb4:29693456655e5f028733b6867e7ec655:41",
      },
    ],
  },
]

const checkDecryption = (product: any, encrypted: any, decrypted: any) => {
  const objectFields = ["trims", "materials", "printing"]
  const notEncryptedFields = ["gtin", "date", "brand", "declaredScore"]
  const encryptedFields = Object.keys(product).filter(
    (key) => !notEncryptedFields.includes(key) && !objectFields.includes(key),
  )

  for (const field of notEncryptedFields) {
    if (field === "date") {
      expect(encrypted.product[field]).toEqual("31/12/2024")
      expect(decrypted[field]).toEqual("31/12/2024")
    } else {
      expect(encrypted.product[field]).toEqual(product[field])
      expect(decrypted[field]).toEqual(product[field])
    }
  }

  for (const field of encryptedFields) {
    if (field === "product") {
      expect(encrypted.product.category).not.toEqual(product[field])
      expect(typeof encrypted.product.category).toBe("string")
      expect(decrypted.category).toEqual(product[field])
    } else {
      expect(encrypted.product[field]).not.toEqual(product[field])
      expect(typeof encrypted.product[field]).toBe("string")
      expect(decrypted[field]).toEqual(product[field])
    }
  }

  encrypted.materials.forEach((material, i) => {
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

  encrypted.accessories?.forEach((accessory, i) => {
    expect(accessory.slug).not.toEqual(product.trims[i].id)
    expect(typeof accessory.slug).toBe("string")
    expect(decrypted.accessories[i].slug).toEqual(product.trims[i].id)
    expect(accessory.quantity).not.toEqual(product.trims[i].quantity)
    expect(typeof accessory.quantity).toBe("string")
    expect(decrypted.accessories[i].quantity).toEqual(product.trims[i].quantity)
  })
}

describe("encryption utils", () => {
  it("decrpyt old encryptions", () => {
    oldEncryptions.forEach((oldEncryption) => {
      const decrypted = decryptProductFields({
        status: Status.Pending,
        id: uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        error: null,
        uploadId: uuid(),
        ...oldEncryption.product,
        materials: oldEncryption.materials.map((material) => ({ ...material, id: uuid(), productId: uuid() })),
        accessories:
          oldEncryption.accessories?.map((accessory) => ({ ...accessory, id: uuid(), productId: uuid() })) || [],
      })
      checkDecryption(product, oldEncryption, decrypted)
    })
  })

  it("encryptProductFields returns encrypted fields and decrypts it", () => {
    const encrypted = encryptProductFields(product)
    const decrypted = decryptProductFields({
      status: Status.Pending,
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      error: null,
      uploadId: uuid(),
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
