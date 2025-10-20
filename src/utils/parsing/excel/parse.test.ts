import { FileUpload } from "../../../db/upload"
import { v4 as uuid } from "uuid"
import { parseExcel } from "./parse"
import { Status } from "../../../../prisma/src/prisma"
import { AccessoryType, Business, Country, Impression, MaterialType, ProductCategory } from "../../../types/Product"
import { decryptProductFields } from "../../encryption/encryption"
import * as XLSX from "xlsx"
import { defaultProductRow, defaultHeaders } from "../parsingTest"

describe("parseExcel", () => {
  const defaultProducts = defaultProductRow.map((cell) =>
    cell.toString().includes("%") ? parseFloat(cell.toString().replace("%", "")) / 100 : cell,
  )
  const upload = {
    id: uuid(),
    name: "test.xlsx",
    createdAt: new Date(),
    products: [],
    createdBy: {
      email: "test@test.fr",
      organization: {
        name: "TestOrg",
        authorizedBy: [
          {
            from: {
              name: "OtherOrg",
              brands: [{ name: "otherBrand" }],
            },
          },
        ],
        brands: [{ name: "TestBrand" }],
      },
    },
    reUploadProducts: [],
  } satisfies FileUpload

  const createExcelBuffer = (data: (string | number | boolean)[][], sheetName?: string) => {
    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName || "Sheet1")
    return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }))
  }

  const createMultiSheetExcelBuffer = (sheets: { name: string; data: (string | number | boolean)[][] }[]) => {
    const wb = XLSX.utils.book_new()
    sheets.forEach((sheet) => {
      const ws = XLSX.utils.aoa_to_sheet(sheet.data)
      XLSX.utils.book_append_sheet(wb, ws, sheet.name)
    })
    return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }))
  }

  it("parses a valid Excel file", async () => {
    const excelBuffer = createExcelBuffer([defaultHeaders, defaultProducts])
    const { products, informations, materials, accessories } = await parseExcel(excelBuffer, upload)

    expect(products).toHaveLength(1)
    expect(materials).toHaveLength(2)
    expect(accessories).toHaveLength(1)

    expect(products[0].status).toBe(Status.Pending)
    expect(products[0].gtins).toEqual(["2234567891001", "3234567891000"])
    expect(products[0].internalReference).toBe("REF-123")
    expect(products[0].brand).toBe("Marque")
    expect(products[0].declaredScore).toBe(2222.63)

    const fullProducts = informations.map((information) => {
      return {
        ...information,
        materials: materials.filter((material) => material.productId === information.id),
        accessories: accessories.filter((accessory) => accessory.productId === information.id),
        upload: {
          createdBy: { organization: { name: "TestOrg", authorizedBy: [], brands: [] } },
        },
      }
    })
    const parsedProduct = decryptProductFields(fullProducts[0])
    expect(parsedProduct.category).toBe(ProductCategory.Pull)
    expect(parsedProduct.airTransportRatio).toBe(0.75)
    expect(parsedProduct.business).toBe(Business.WithoutServices)
    expect(parsedProduct.fading).toBe(false)
    expect(parsedProduct.mass).toBe(0.55)
    expect(parsedProduct.numberOfReferences).toBe(9000)
    expect(parsedProduct.price).toBe(100)
    expect(parsedProduct.countryDyeing).toBe(Country.Chine)
    expect(parsedProduct.countryFabric).toBe(Country.Chine)
    expect(parsedProduct.countryMaking).toBe(Country.Chine)
    expect(parsedProduct.countrySpinning).toBe(Country.Chine)
    expect(parsedProduct.impression).toBe(Impression.Pigmentaire)
    expect(parsedProduct.impressionPercentage).toBe(0.2)
    expect(parsedProduct.upcycled).toBe(false)
    expect(parsedProduct.materials).toHaveLength(2)
    expect(parsedProduct.materials[0].slug).toBe(MaterialType.Viscose)
    expect(parsedProduct.materials[0].country).toBe(Country.Chine)
    expect(parsedProduct.materials[0].share).toBe(0.9)
    expect(parsedProduct.materials[1].slug).toBe(MaterialType.Jute)
    expect(parsedProduct.materials[1].country).toBeUndefined()
    expect(parsedProduct.materials[1].share).toBe(0.1)
    expect(parsedProduct.accessories).toHaveLength(1)
    expect(parsedProduct.accessories[0].slug).toBe(AccessoryType.BoutonEnMétal)
    expect(parsedProduct.accessories[0].quantity).toBe(1)
  })

  it("parses all invalid values", async () => {
    const invalidRow = defaultHeaders.map(() => "Test")

    const excelBuffer = createExcelBuffer([defaultHeaders, invalidRow])
    const { products, informations, materials, accessories } = await parseExcel(excelBuffer, upload)

    expect(products).toHaveLength(1)
    expect(materials).toHaveLength(16)
    expect(accessories).toHaveLength(4)

    expect(products[0].status).toBe(Status.Pending)
    expect(products[0].gtins).toEqual(["Test"])
    expect(products[0].internalReference).toBe("Test")
    expect(products[0].brand).toBe("Test")
    expect(products[0].declaredScore).toBe(-1)

    const fullProducts = informations.map((information) => {
      return {
        ...information,
        materials: materials.filter((material) => material.productId === information.id),
        accessories: accessories.filter((accessory) => accessory.productId === information.id),
        upload: {
          createdBy: { organization: { name: "TestOrg", authorizedBy: [], brands: [] } },
        },
      }
    })
    const parsedProduct = decryptProductFields(fullProducts[0])
    expect(parsedProduct.category).toBe("Test")
    expect(parsedProduct.airTransportRatio).toBe("Test")
    expect(parsedProduct.business).toBe("Test")
    expect(parsedProduct.fading).toBe("Test")
    expect(parsedProduct.mass).toBe("Test")
    expect(parsedProduct.numberOfReferences).toBe("Test")
    expect(parsedProduct.price).toBe("Test")
    expect(parsedProduct.countryDyeing).toBe("Test")
    expect(parsedProduct.countryFabric).toBe("Test")
    expect(parsedProduct.countryMaking).toBe("Test")
    expect(parsedProduct.countrySpinning).toBe("Test")
    expect(parsedProduct.impression).toBe("Test")
    expect(parsedProduct.impressionPercentage).toBe("Test")
    expect(parsedProduct.upcycled).toBe("Test")
    expect(parsedProduct.materials).toHaveLength(16)
    expect(parsedProduct.materials[0].slug).toBe("Test")
    expect(parsedProduct.materials[0].country).toBe("Test")
    expect(parsedProduct.materials[0].share).toBe("Test")
    expect(parsedProduct.accessories).toHaveLength(4)
    expect(parsedProduct.accessories[0].slug).toBe("Test")
    expect(parsedProduct.accessories[0].quantity).toBe("Test")
  })

  it("handles empty Excel file", async () => {
    const emptyBuffer = createExcelBuffer([])

    await expect(parseExcel(emptyBuffer, upload)).rejects.toThrow("Le fichier Excel est vide")
  })

  it("handles missing headers", async () => {
    const incompleteHeaders = ["Header1", "Header2"]
    const incompleteRow = ["2234567891001", "REF-123"]
    const excelBuffer = createExcelBuffer([incompleteHeaders, incompleteRow])

    await expect(parseExcel(excelBuffer, upload)).rejects.toThrow(
      "Colonne(s) manquante(s): GTINs/Eans, Référence interne, Catégorie, Masse (en kg), Remanufacturé, Nombre de références, Prix (en euros, TTC), Taille de l'entreprise, Matière 1, Matière 1 pourcentage, Matière 1 origine, Origine de filature, Origine de tissage/tricotage, Origine de l'ennoblissement/impression, Type d'impression, Pourcentage d'impression, Origine de confection, Délavage, Part du transport aérien, Accessoire 1, Accessoire 1 quantité",
    )
  })

  it("defaults declared score to -1 for invalid values", async () => {
    const row = [...defaultProducts]
    row[3] = "nimps"
    const excelBuffer = createExcelBuffer([defaultHeaders, row])
    const { products } = await parseExcel(excelBuffer, upload)
    expect(products).toHaveLength(1)
    expect(products[0].declaredScore).toBe(-1)
  })

  it("prioritizes 'Produits' sheet over other sheets", async () => {
    const validProductsSheetData = [defaultHeaders, defaultProducts]

    const invalidOtherSheetData = [
      ["Invalid", "Header"],
      ["Invalid", "Data"],
    ]

    const excelBuffer = createMultiSheetExcelBuffer([
      { name: "OtherSheet", data: invalidOtherSheetData },
      { name: "Produits", data: validProductsSheetData },
      { name: "AnotherSheet", data: invalidOtherSheetData },
    ])

    const { products, materials, accessories } = await parseExcel(excelBuffer, upload)

    expect(products).toHaveLength(1)
    expect(materials).toHaveLength(2)
    expect(accessories).toHaveLength(1)
    expect(products[0].gtins).toEqual(["2234567891001", "3234567891000"])
    expect(products[0].brand).toBe("Marque")
  })

  it("uses first sheet when 'Produits' sheet does not exist", async () => {
    const excelBuffer = createExcelBuffer([defaultHeaders, defaultProducts], "DataSheet")

    const { products, materials, accessories } = await parseExcel(excelBuffer, upload)

    expect(products).toHaveLength(1)
    expect(materials).toHaveLength(2)
    expect(accessories).toHaveLength(1)
    expect(products[0].gtins).toEqual(["2234567891001", "3234567891000"])
    expect(products[0].brand).toBe("Marque")
  })

  it("ignores materials with empty or whitespace-only values", async () => {
    const row = [...defaultProducts]
    const matiere3Index = defaultHeaders.indexOf("Matière 3")
    row[matiere3Index] = " "
    row[matiere3Index + 1] = "0.5"

    const excelBuffer = createExcelBuffer([defaultHeaders, row])
    const { products, materials } = await parseExcel(excelBuffer, upload)

    expect(products).toHaveLength(1)
    expect(materials).toHaveLength(2)

    const fullProducts = products.map((product) => ({
      ...product,
      materials: materials.filter((material) => material.productId === product.id),
      accessories: [],
      upload: {
        createdBy: { organization: { name: "TestOrg", authorizedBy: [], brands: [] } },
      },
    }))

    const parsedProduct = decryptProductFields(fullProducts[0])
    expect(parsedProduct.materials).toHaveLength(2)
    expect(parsedProduct.materials[0].slug).toBe(MaterialType.Viscose)
    expect(parsedProduct.materials[1].slug).toBe(MaterialType.Jute)
  })
})
