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
      category: "52573aaf4eb7ede0d9543d6d:d0c6009dd2ce29f7d8b99676de21187f:036adcf9",
      airTransportRatio: "0bb539587854012b8cef444f:0f99ee5c95d6384236dd67425826e49f:376750",
      business: "4764870b1995713025710d4d:04554112f41b6b5743b4a72f644c16d9:7eb66dcd2e916b",
      fading: "353f77794fbcb8ee13d175dd:16c3b4617597d0459783cf278ec04afc:ad36379e",
      mass: "ed4caec961d6619707a912b4:c873f922367d95b8e90ac5de4b53dd52:6f5aa787",
      numberOfReferences: "d383bf43029ec482dc654a8d:4329edeef7f915f58b667c02a90b3218:65",
      price: "29d7ff6e5c0cb006fe4496fd:e42c797a5b1829d92776831c69b149ee:1aeec67f",
      traceability: "6cad07be94b9e977b73228a7:8bebc22fd4d1e93c586b9bb8e4609ea8:1da623eca8",
      countryDyeing: "490179331b4494624b1551bc:b6e365fa2961eaa83db38334de2aa16d:072cd94e8243",
      countryFabric: "a9819561b10828aaeb7eb8f7:f8cea23336416c2b025e4952d4def16b:e8590d545fd2",
      countryMaking: "6b2cf04bc63f55c7c261253c:c6a962c0235c329c3f300295a8f6bd1b:424993ae2afa",
      countrySpinning: "0e53a1f3f0ac75bee4b11b83:9255bf39751f26fccfd5542337965054:d1e73da87e22",
      impression: "1f401988622ed7639d323353:2df48e3cb56ad9d784be4cb899054b40:e64c8d36ef1adc56e11fbd",
      impressionPercentage: "0815663741a8df2dc552b277:d7b73b5d26a0146c10c7176ff4e27d5c:38be4f",
      upcycled: "cdb82a69f6c6d60a36decff6:d1d3abba324dd7815ef5603fb0d30dc2:fd0804cc2f",
      materials: undefined,
      accessories: undefined,
    },
    materials: [
      {
        slug: "999bff81d7751823585edc9f:f6a2c0ad1755663e853368844cb79b1d:b69c50f7a6",
        country: "e2cf2a4ea001d15e62134147:7227ab094969c0831b7a8d9a40c3d5f4:bcbf6ac9d63a",
        share: "7d388012e292a957d8f90bd6:8c2dec4879ae2a8aa54d90dee8843a9c:d2",
      },
    ],
    accessories: [
      {
        slug: "a5e07413d28bcb7734ca8822:ef3248d81c528239fcf30aaf4f8261b6:a1cd801e2e41c827",
        quantity: "bf47667323dde4402af12789:7b2d8a454a5cb0ae85d419c39a91332c:f5",
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
      console.log(decrypted)
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
