import { v4 as uuid } from "uuid"
import { ConfidenceLevel, UserRole } from "@prisma/enums"
import { parse } from "csv-parse/sync"
import { exportDgccrfBrandProducts } from "./dgccrf"
import { forEachLatestProductsByBrandIdForExport } from "../../db/product"
import { encryptProductFields } from "../encryption/encryption"
import { FullUser, getUser } from "../../db/user"
import { AccessoryType, Business, Country, Impression, MaterialType, ProductCategory } from "../../types/Product"
import { BATCH_CATEGORY } from "../product/category"

jest.mock("../../db/product", () => ({
  forEachLatestProductsByBrandIdForExport: jest.fn(),
}))

jest.mock("../../db/user", () => ({
  getUser: jest.fn(),
}))

jest.mock("../../db/prismaClient", () => ({
  prismaClient: {},
}))

const mockedGetUser = getUser as jest.MockedFunction<typeof getUser>
const mockedGetProducts = forEachLatestProductsByBrandIdForExport as jest.MockedFunction<
  typeof forEachLatestProductsByBrandIdForExport
>

const mockExportProducts = (products: any[]) => {
  mockedGetProducts.mockImplementation(async (onBatch) => {
    await onBatch(products)
    return products.length
  })
}

const getMockedUser = async (role: UserRole | string) =>
  ({
    id: "user-1",
    email: "test@example.com",
    role,
  }) as FullUser

const makeInfo = (
  product: Parameters<typeof encryptProductFields>[0],
  extra: { mainComponent?: boolean | null } = {},
) => {
  const {
    product: { mainComponent: _mc, ...encProductRest },
    materials,
    accessories,
  } = encryptProductFields(product)
  return {
    id: uuid(),
    productId: null,
    emptyTrims: null,
    score: null,
    ...encProductRest,
    mainComponent: extra.mainComponent ?? null,
    materials: (materials ?? []).map((m) => ({ id: uuid(), productId: null, ...m })),
    accessories: (accessories ?? []).map((a) => ({ id: uuid(), productId: null, ...a })),
  }
}

const makeProduct = (overrides: Record<string, unknown> = {}) => ({
  id: uuid(),
  hash: "hash",
  status: "Done" as const,
  error: null,
  uploadId: uuid(),
  uploadOrder: 1,
  brandName: "TestBrand",
  brandId: "brand-1",
  brand: { id: "brand-1", name: "TestBrand" },
  reUploads: [],
  createdAt: new Date("2026-01-15"),
  gtins: ["1234567890123"],
  internalReference: "REF-001",
  declaredScore: null,
  score: null,
  standardized: null,
  informations: [],
  confidenceLevel: ConfidenceLevel.High,
  ...overrides,
})

const parseCSV = (csv: string) =>
  parse(csv, { columns: true, delimiter: ",", relax_quotes: true }) as Record<string, string>[]

describe("exportDgccrfBrandProducts", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("contrôles d'accès", () => {
    it("retourne une erreur si non authentifié", async () => {
      mockedGetUser.mockResolvedValue(null)
      const result = await exportDgccrfBrandProducts("user-1", {})
      expect(result).toEqual({ error: "Utilisateur non authentifié" })
      expect(mockedGetUser).toHaveBeenCalledWith("user-1")
    })

    it("retourne une erreur si le rôle n'est pas DGCCRF ou ADMIN", async () => {
      mockedGetUser.mockResolvedValue(getMockedUser(""))
      const result = await exportDgccrfBrandProducts("user-1", { brandId: "brand-1" })
      expect(result).toEqual({ error: "Vous n'êtes pas autorisé à exporter ces produits" })
      expect(mockedGetUser).toHaveBeenCalledWith("user-1")
    })

    it("retourne une erreur si pas de brandId et rôle non ADMIN", async () => {
      mockedGetUser.mockResolvedValue(getMockedUser(UserRole.DGCCRF))
      const result = await exportDgccrfBrandProducts("user-1", {})
      expect(result).toEqual({ error: "Marque invalide" })
      expect(mockedGetUser).toHaveBeenCalledWith("user-1")
    })

    it("retourne une erreur si aucun produit trouvé", async () => {
      mockedGetUser.mockResolvedValue(getMockedUser(UserRole.DGCCRF))
      mockExportProducts([])
      const result = await exportDgccrfBrandProducts("user-1", { brandId: "brand-1" })
      expect(result).toEqual({ error: "Aucun produit trouvé pour cette marque" })
      expect(mockedGetUser).toHaveBeenCalledWith("user-1")
    })
  })

  describe("produit simple (1 seule information)", () => {
    it("exporte une ligne avec toutes les colonnes correctement remplies", async () => {
      mockedGetUser.mockResolvedValue(getMockedUser(UserRole.DGCCRF))

      const info = makeInfo({
        product: ProductCategory.Jean,
        business: Business.Small,
        mass: 0.5,
        price: 89.9,
        numberOfReferences: 200,
        airTransportRatio: 0.1,
        fading: true,
        upcycled: false,
        countryDyeing: Country.France,
        countryFabric: Country.France,
        countryMaking: Country.France,
        countrySpinning: Country.France,
        printing: { kind: Impression.Pigmentaire, ratio: 0.25 },
        materials: [
          { id: MaterialType.Coton, share: 0.8, country: Country.France },
          { id: MaterialType.Polyester, share: 0.2, country: Country.Chine },
        ],
        trims: [
          { id: AccessoryType.ZipLong, quantity: 1 },
          { id: AccessoryType.BoutonEnMétal, quantity: 3 },
        ],
      })

      mockExportProducts([
        makeProduct({
          gtins: ["1234567890123"],
          internalReference: "REF-001",
          declaredScore: 42.6,
          score: 38.0,
          standardized: 50.0,
          informations: [info],
        }),
      ])

      const result = await exportDgccrfBrandProducts("user-1", { brandId: "brand-1" })
      expect(mockedGetUser).toHaveBeenCalledWith("user-1")
      expect(typeof result).toBe("string")

      const rows = parseCSV(result as string)
      expect(rows).toHaveLength(1)

      const row = rows[0]
      expect(row["GTINs/EANs"]).toBe("1234567890123")
      expect(row["Référence interne"]).toBe("REF-001")
      expect(row["Marque déclarée"]).toBe("TestBrand")
      expect(row["Score déclaré par la marque"]).toBe("43")
      expect(row["Score calculé pour la marque"]).toBe("38")
      expect(row["Score standardisé"]).toBe("50")
      expect(row["Catégorie"]).toBe(ProductCategory.Jean)
      expect(row["Élément"]).toBe("1/1")
      expect(row["Masse (en kg)"]).toBe("0.5")
      expect(row["Remanufacturé"]).toBe("Non")
      expect(row["Délavage"]).toBe("Oui")
      expect(row["Nombre de références"]).toBe("200")
      expect(row["Taille de l'entreprise"]).toBe(Business.Small)
      expect(row["Matière 1"]).toBe(MaterialType.Coton)
      expect(row["Matière 1 pourcentage"]).toBe("80.00")
      expect(row["Matière 1 origine"]).toBe(Country.France)
      expect(row["Matière 2"]).toBe(MaterialType.Polyester)
      expect(row["Matière 2 pourcentage"]).toBe("20.00")
      expect(row["Matière 2 origine"]).toBe(Country.Chine)
      expect(row["Matière 3"]).toBe("")
      expect(row["Type d'impression"]).toBe(Impression.Pigmentaire)
      expect(row["Pourcentage d'impression"]).toBe("25.00")
      expect(row["Part du transport aérien"]).toBe("10.00")
      expect(row["Quantité de zip long"]).toBe("1")
      expect(row["Quantité de bouton en métal"]).toBe("3")
      expect(row["Quantité de zip court"]).toBe("")
      expect(row["Quantité de bouton en plastique"]).toBe("")
    })
  })

  describe("produit multi-composant (avec main component)", () => {
    it("place le main component en premier et numérote 1/2 et 2/2", async () => {
      mockedGetUser.mockResolvedValue(getMockedUser(UserRole.DGCCRF))

      const mainInfo = makeInfo(
        {
          product: ProductCategory.Jean,
          business: Business.Small,
          mass: 0.4,
          price: 70,
          numberOfReferences: 100,
          countryDyeing: Country.France,
          countryFabric: Country.France,
          countryMaking: Country.France,
          countrySpinning: Country.France,
          materials: [{ id: MaterialType.Coton, share: 1 }],
          trims: [],
        },
        { mainComponent: true },
      )

      const secondInfo = makeInfo({
        product: ProductCategory.Pull,
        business: Business.Small,
        mass: 0.1,
        price: 20,
        numberOfReferences: 100,
        countryDyeing: Country.France,
        countryFabric: Country.France,
        countryMaking: Country.France,
        countrySpinning: Country.France,
        materials: [{ id: MaterialType.Polyester, share: 1 }],
        trims: [],
      })

      mockExportProducts([
        makeProduct({
          internalReference: "REF-002",
          gtins: ["9876543210987"],
          score: 55,
          standardized: 60,
          informations: [secondInfo, mainInfo],
        }),
      ])

      const result = await exportDgccrfBrandProducts("user-1", { brandId: "brand-1" })
      expect(mockedGetUser).toHaveBeenCalledWith("user-1")
      const rows = parseCSV(result as string)

      expect(rows).toHaveLength(2)

      expect(rows[0]["Élément"]).toBe("1/2")
      expect(rows[0]["Catégorie"]).toBe(ProductCategory.Jean)
      expect(rows[0]["Masse (en kg)"]).toBe("0.4")

      expect(rows[1]["Élément"]).toBe("2/2")
      expect(rows[1]["Catégorie"]).toBe(ProductCategory.Pull)
      expect(rows[1]["Masse (en kg)"]).toBe("0.1")

      expect(rows[0]["Score calculé pour la marque"]).toBe("55")
      expect(rows[1]["Score calculé pour la marque"]).toBe("55")

      expect(rows[0]["Référence interne"]).toBe("REF-002")
      expect(rows[1]["Référence interne"]).toBe("REF-002")
    })
  })

  describe("lot (plusieurs informations sans main component)", () => {
    it("affiche la catégorie 'Lot de produits' et numérote 1/2 et 2/2", async () => {
      mockedGetUser.mockResolvedValue(getMockedUser(UserRole.DGCCRF))

      const info1 = makeInfo({
        product: ProductCategory.Pull,
        business: Business.Small,
        mass: 0.3,
        price: 40,
        numberOfReferences: 50,
        countryDyeing: Country.France,
        countryFabric: Country.France,
        countryMaking: Country.France,
        countrySpinning: Country.France,
        materials: [{ id: MaterialType.Coton, share: 1 }],
        trims: [],
      })

      const info2 = makeInfo({
        product: ProductCategory.TShirtPolo,
        business: Business.Small,
        mass: 0.2,
        price: 25,
        numberOfReferences: 50,
        countryDyeing: Country.France,
        countryFabric: Country.France,
        countryMaking: Country.France,
        countrySpinning: Country.France,
        materials: [{ id: MaterialType.Coton, share: 1 }],
        trims: [],
      })

      mockExportProducts([
        makeProduct({
          internalReference: "REF-003",
          gtins: [],
          score: null,
          standardized: null,
          informations: [info1, info2],
        }),
      ])

      const result = await exportDgccrfBrandProducts("user-1", { brandId: "brand-1" })
      expect(mockedGetUser).toHaveBeenCalledWith("user-1")
      const rows = parseCSV(result as string)

      expect(rows).toHaveLength(2)

      expect(rows[0]["Catégorie"]).toBe(BATCH_CATEGORY)
      expect(rows[0]["Élément"]).toBe("1/2")
      expect(rows[0]["Masse (en kg)"]).toBe("0.3")

      expect(rows[1]["Catégorie"]).toBe(BATCH_CATEGORY)
      expect(rows[1]["Élément"]).toBe("2/2")
      expect(rows[1]["Masse (en kg)"]).toBe("0.2")
    })
  })
})
