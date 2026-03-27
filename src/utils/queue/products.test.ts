import { processProductsQueue } from "./products"
import { failProducts, getProductsToProcess } from "../../db/product"
import { getBrandsByIds } from "../../db/brands"
import { checkUploadsStatus } from "../../db/upload"
import { saveEcobalyseResults } from "../ecobalyse/api"
import { prismaClient } from "../../db/prismaClient"
import { Status, UploadType } from "@prisma/enums"
import { Business, Country, Impression, MaterialType, ProductCategory } from "../../types/Product"

jest.mock("../../db/product")
jest.mock("../../db/upload")
jest.mock("../../db/brands")
jest.mock("../ecobalyse/api")
jest.mock("../../db/prismaClient", () => ({
  prismaClient: {
    product: {
      update: jest.fn(),
    },
  },
}))

const mockedFailProducts = failProducts as jest.MockedFunction<typeof failProducts>
const mockedGetProductsToProcess = getProductsToProcess as jest.MockedFunction<typeof getProductsToProcess>
const mockedCheckUploadsStatus = checkUploadsStatus as jest.MockedFunction<typeof checkUploadsStatus>
const mockedGetBrandsByIds = getBrandsByIds as jest.MockedFunction<typeof getBrandsByIds>
const mockedSaveEcobalyseResults = saveEcobalyseResults as jest.MockedFunction<typeof saveEcobalyseResults>
const mockedPrismaUpdate = prismaClient.product.update as jest.MockedFunction<typeof prismaClient.product.update>

describe("processProductsQueue", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockProduct = {
    error: null,
    hash: "test-hash",
    status: Status.Pending,
    createdAt: new Date(),
    uploadId: "test-upload-id",
    uploadOrder: 1,
    upload: {
      id: "test-upload-id",
      error: null,
      name: "test-upload.csv",
      createdAt: new Date(),
      type: UploadType.FILE,
      status: Status.Pending,
      version: "test-version",
      createdById: "user-1",
      organizationId: "org-1",
      createdBy: {
        id: "user-1",
        email: "test@test.fr",
        emailVerified: null,
        nom: "Jane",
        prenom: "Dane",
        agentconnect_info: null,
        role: null,
        organizationId: "org-1",
        organization: {
          name: "Test Organization",
          authorizedBy: [],
          brands: [{ id: "2c3be047-4388-459a-80e1-0ce2bbd0e9d4", name: "Test Organization", active: true }],
        },
      },
    },
    id: "product-1",
    gtins: ["1234567891118", "1234567891019"],
    internalReference: "My-ref",
    brandId: "2c3be047-4388-459a-80e1-0ce2bbd0e9d4",
    brandName: "2c3be047-4388-459a-80e1-0ce2bbd0e9d4",
    declaredScore: 123,
    score: null,
    standardized: null,
    informations: [
      {
        id: "info-1",
        productId: "product-1",
        mainComponent: null,
        business: Business.Small,
        countrySpinning: Country.Chine,
        countryDyeing: Country.Chine,
        countryFabric: Country.Chine,
        countryMaking: Country.Chine,
        mass: 0.15,
        numberOfReferences: 100000,
        price: 10,
        category: ProductCategory.TShirtPolo,
        categorySlug: ProductCategory.TShirtPolo,
        upcycled: false,
        impression: Impression.Pigmentaire,
        impressionPercentage: 0.2,
        airTransportRatio: 0.1,
        fading: false,
        materials: [
          {
            id: "mat-1",
            productId: "info-1",
            slug: MaterialType.Coton,
            share: 1,
            country: Country.Chine,
          },
        ],
        accessories: [],
        emptyTrims: false,
      },
    ],
  }

  it("should process products successfully when validation passes", async () => {
    mockedGetProductsToProcess.mockResolvedValue([mockProduct])
    mockedGetBrandsByIds.mockResolvedValue([
      {
        id: "2c3be047-4388-459a-80e1-0ce2bbd0e9d4",
        organization: { id: "organization-id", siret: "123456789", uniqueId: "unique-id", noGTIN: false },
      },
    ])

    await processProductsQueue()

    expect(mockedGetProductsToProcess).toHaveBeenCalledWith(
      process.env.BATCH_SIZE ? parseInt(process.env.BATCH_SIZE) : 10,
    )
    expect(mockedSaveEcobalyseResults).toHaveBeenCalledWith([
      {
        accessories: [],
        airTransportRatio: 0.1,
        brandId: "2c3be047-4388-459a-80e1-0ce2bbd0e9d4",
        business: "TPE/PME",
        category: "T-shirt / Polo",
        countryDyeing: "Chine",
        countryFabric: "Chine",
        countryMaking: "Chine",
        countrySpinning: "Chine",
        createdAt: expect.any(Date),
        declaredScore: 123,
        error: null,
        fading: false,
        gtins: ["1234567891118", "1234567891019"],
        id: "info-1",
        productId: "product-1",
        impression: "Pigmentaire",
        impressionPercentage: 0.2,
        internalReference: "My-ref",
        mass: 0.15,
        materials: [
          {
            country: "Chine",
            id: "mat-1",
            productId: "info-1",
            share: 1,
            slug: "Coton",
          },
        ],
        emptyTrims: false,
        numberOfReferences: 100000,
        price: 10,
        status: "Pending",
        upcycled: false,
        uploadId: "test-upload-id",
      },
    ])
    expect(mockedFailProducts).toHaveBeenCalledWith([])
    expect(mockedPrismaUpdate).not.toHaveBeenCalled()
    expect(mockedCheckUploadsStatus).toHaveBeenCalledWith(["test-upload-id"])
  })

  it("should process products without gtin successfully when validation passes and no gtin organization", async () => {
    mockedGetProductsToProcess.mockResolvedValue([{ ...mockProduct, gtins: [] }])
    mockedGetBrandsByIds.mockResolvedValue([
      {
        id: "2c3be047-4388-459a-80e1-0ce2bbd0e9d4",
        organization: { id: "organization-id", siret: "123456789", uniqueId: "unique-id", noGTIN: true },
      },
    ])

    await processProductsQueue()

    expect(mockedGetProductsToProcess).toHaveBeenCalledWith(
      process.env.BATCH_SIZE ? parseInt(process.env.BATCH_SIZE) : 10,
    )
    expect(mockedSaveEcobalyseResults).toHaveBeenCalledWith([
      {
        accessories: [],
        airTransportRatio: 0.1,
        brandId: "2c3be047-4388-459a-80e1-0ce2bbd0e9d4",
        business: "TPE/PME",
        category: "T-shirt / Polo",
        countryDyeing: "Chine",
        countryFabric: "Chine",
        countryMaking: "Chine",
        countrySpinning: "Chine",
        createdAt: expect.any(Date),
        declaredScore: 123,
        error: null,
        fading: false,
        gtins: ["My-ref-123456789"],
        id: "info-1",
        productId: "product-1",
        impression: "Pigmentaire",
        impressionPercentage: 0.2,
        internalReference: "My-ref",
        mass: 0.15,
        materials: [
          {
            country: "Chine",
            id: "mat-1",
            productId: "info-1",
            share: 1,
            slug: "Coton",
          },
        ],
        emptyTrims: false,
        numberOfReferences: 100000,
        price: 10,
        status: "Pending",
        upcycled: false,
        uploadId: "test-upload-id",
      },
    ])
    expect(mockedFailProducts).toHaveBeenCalledWith([])
    expect(mockedPrismaUpdate).toHaveBeenCalledWith({
      where: { id: "product-1" },
      data: {
        gtins: ["My-ref-123456789"],
      },
    })
    expect(mockedCheckUploadsStatus).toHaveBeenCalledWith(["test-upload-id"])
  })

  it("should process products with empty gtin successfully when validation passes and no gtin organization", async () => {
    mockedGetProductsToProcess.mockResolvedValue([{ ...mockProduct, gtins: [""] }])
    mockedGetBrandsByIds.mockResolvedValue([
      {
        id: "2c3be047-4388-459a-80e1-0ce2bbd0e9d4",
        organization: { id: "organization-id", siret: null, uniqueId: "unique-id", noGTIN: true },
      },
    ])

    await processProductsQueue()

    expect(mockedGetProductsToProcess).toHaveBeenCalledWith(
      process.env.BATCH_SIZE ? parseInt(process.env.BATCH_SIZE) : 10,
    )
    expect(mockedSaveEcobalyseResults).toHaveBeenCalledWith([
      {
        accessories: [],
        airTransportRatio: 0.1,
        brandId: "2c3be047-4388-459a-80e1-0ce2bbd0e9d4",
        business: "TPE/PME",
        category: "T-shirt / Polo",
        countryDyeing: "Chine",
        countryFabric: "Chine",
        countryMaking: "Chine",
        countrySpinning: "Chine",
        createdAt: expect.any(Date),
        declaredScore: 123,
        error: null,
        fading: false,
        gtins: ["My-ref-unique-i"],
        id: "info-1",
        productId: "product-1",
        impression: "Pigmentaire",
        impressionPercentage: 0.2,
        internalReference: "My-ref",
        mass: 0.15,
        materials: [
          {
            country: "Chine",
            id: "mat-1",
            productId: "info-1",
            share: 1,
            slug: "Coton",
          },
        ],
        emptyTrims: false,
        numberOfReferences: 100000,
        price: 10,
        status: "Pending",
        upcycled: false,
        uploadId: "test-upload-id",
      },
    ])
    expect(mockedFailProducts).toHaveBeenCalledWith([])
    expect(mockedPrismaUpdate).toHaveBeenCalledWith({
      where: { id: "product-1" },
      data: {
        gtins: ["My-ref-unique-i"],
      },
    })
    expect(mockedCheckUploadsStatus).toHaveBeenCalledWith(["test-upload-id"])
  })

  it("should handle products without organization", async () => {
    mockedGetProductsToProcess.mockResolvedValue([
      {
        ...mockProduct,
        upload: { ...mockProduct.upload, createdBy: { ...mockProduct.upload.createdBy, organization: null } },
      },
    ])

    await processProductsQueue()

    expect(mockedSaveEcobalyseResults).toHaveBeenCalledWith([])
    expect(mockedFailProducts).toHaveBeenCalledWith([
      {
        productId: "product-1",
        error: "Organisation non trouvée",
      },
    ])
    expect(mockedPrismaUpdate).not.toHaveBeenCalled()
    expect(mockedCheckUploadsStatus).toHaveBeenCalledWith(["test-upload-id"])
  })

  it("should handle products without brand", async () => {
    mockedGetProductsToProcess.mockResolvedValue([mockProduct])
    mockedGetBrandsByIds.mockResolvedValue([])

    await processProductsQueue()

    expect(mockedSaveEcobalyseResults).toHaveBeenCalledWith([])
    expect(mockedFailProducts).toHaveBeenCalledWith([
      {
        productId: "product-1",
        error: 'Marque invalide. Voici la liste de vos marques : "2c3be047-4388-459a-80e1-0ce2bbd0e9d4"',
      },
    ])
    expect(mockedPrismaUpdate).not.toHaveBeenCalled()
    expect(mockedCheckUploadsStatus).toHaveBeenCalledWith(["test-upload-id"])
  })

  it("should handle products with gtin and no gtin organization", async () => {
    mockedGetProductsToProcess.mockResolvedValue([mockProduct])
    mockedGetBrandsByIds.mockResolvedValue([
      {
        id: "2c3be047-4388-459a-80e1-0ce2bbd0e9d4",
        organization: { id: "organization-id", siret: "123456789", uniqueId: "unique-id", noGTIN: true },
      },
    ])

    await processProductsQueue()

    expect(mockedSaveEcobalyseResults).toHaveBeenCalledWith([])
    expect(mockedFailProducts).toHaveBeenCalledWith([
      {
        productId: "product-1",
        error: "Votre organisation n'utilise pas de GTIN, le champ 'GTINs/EANs' ne doit pas être renseigné",
      },
    ])
    expect(mockedPrismaUpdate).not.toHaveBeenCalled()
    expect(mockedCheckUploadsStatus).toHaveBeenCalledWith(["test-upload-id"])
  })

  it("should handle validation failures", async () => {
    mockedGetProductsToProcess.mockResolvedValue([
      { ...mockProduct, informations: [{ ...mockProduct.informations[0], mass: undefined }] },
    ])
    mockedGetBrandsByIds.mockResolvedValue([
      {
        id: "2c3be047-4388-459a-80e1-0ce2bbd0e9d4",
        organization: { id: "organization-id", siret: "123456789", uniqueId: "unique-id", noGTIN: false },
      },
    ])

    await processProductsQueue()

    expect(mockedSaveEcobalyseResults).toHaveBeenCalledWith([])
    expect(mockedFailProducts).toHaveBeenCalledWith([
      {
        productId: "product-1",
        error: "Le poids est obligatoire",
      },
    ])
    expect(mockedPrismaUpdate).not.toHaveBeenCalled()
    expect(mockedCheckUploadsStatus).toHaveBeenCalledWith(["test-upload-id"])
  })

  it("should handle gtins validation failures", async () => {
    mockedGetProductsToProcess.mockResolvedValue([{ ...mockProduct, gtins: ["invalid-gtin"] }])
    mockedGetBrandsByIds.mockResolvedValue([
      {
        id: "2c3be047-4388-459a-80e1-0ce2bbd0e9d4",
        organization: { id: "organization-id", siret: "123456789", uniqueId: "unique-id", noGTIN: false },
      },
    ])

    await processProductsQueue()

    expect(mockedSaveEcobalyseResults).toHaveBeenCalledWith([])
    expect(mockedFailProducts).toHaveBeenCalledWith([
      {
        productId: "product-1",
        error:
          "Le code GTIN doit contenir 8 ou 13 chiffres, Le code GTIN n'est pas valide (somme de contrôle incorrecte)",
      },
    ])
    expect(mockedPrismaUpdate).not.toHaveBeenCalled()
    expect(mockedCheckUploadsStatus).toHaveBeenCalledWith(["test-upload-id"])
  })

  it("should handle both validation failures", async () => {
    mockedGetProductsToProcess.mockResolvedValue([
      { ...mockProduct, gtins: ["invalid-gtin"], informations: [{ ...mockProduct.informations[0], mass: undefined }] },
    ])
    mockedGetBrandsByIds.mockResolvedValue([
      {
        id: "2c3be047-4388-459a-80e1-0ce2bbd0e9d4",
        organization: { id: "organization-id", siret: "123456789", uniqueId: "unique-id", noGTIN: false },
      },
    ])

    await processProductsQueue()

    expect(mockedSaveEcobalyseResults).toHaveBeenCalledWith([])
    expect(mockedFailProducts).toHaveBeenCalledWith([
      {
        productId: "product-1",
        error:
          "Le poids est obligatoire, Le code GTIN doit contenir 8 ou 13 chiffres, Le code GTIN n'est pas valide (somme de contrôle incorrecte)",
      },
    ])
    expect(mockedPrismaUpdate).not.toHaveBeenCalled()
    expect(mockedCheckUploadsStatus).toHaveBeenCalledWith(["test-upload-id"])
  })

  it("should handle mixed validation results", async () => {
    mockedGetProductsToProcess.mockResolvedValue([
      mockProduct,
      { ...mockProduct, id: "product-2", gtins: ["invalid-gtin"], uploadId: "test-upload-id-2" },
    ])

    await processProductsQueue()

    expect(mockedSaveEcobalyseResults).toHaveBeenCalledWith([
      {
        accessories: [],
        airTransportRatio: 0.1,
        brandId: "2c3be047-4388-459a-80e1-0ce2bbd0e9d4",
        business: "TPE/PME",
        category: "T-shirt / Polo",
        countryDyeing: "Chine",
        countryFabric: "Chine",
        countryMaking: "Chine",
        countrySpinning: "Chine",
        createdAt: expect.any(Date),
        declaredScore: 123,
        error: null,
        fading: false,
        gtins: ["1234567891118", "1234567891019"],
        id: "info-1",
        productId: "product-1",
        impression: "Pigmentaire",
        impressionPercentage: 0.2,
        internalReference: "My-ref",
        mass: 0.15,
        materials: [
          {
            country: "Chine",
            id: "mat-1",
            productId: "info-1",
            share: 1,
            slug: "Coton",
          },
        ],
        emptyTrims: false,
        numberOfReferences: 100000,
        price: 10,
        status: "Pending",
        upcycled: false,
        uploadId: "test-upload-id",
      },
    ])
    expect(mockedFailProducts).toHaveBeenCalledWith([
      {
        productId: "product-2",
        error:
          "Le code GTIN doit contenir 8 ou 13 chiffres, Le code GTIN n'est pas valide (somme de contrôle incorrecte)",
      },
    ])
    expect(mockedPrismaUpdate).not.toHaveBeenCalled()
    expect(mockedCheckUploadsStatus).toHaveBeenCalledWith(["test-upload-id", "test-upload-id-2"])
  })

  it("should handle errors", async () => {
    mockedGetProductsToProcess.mockResolvedValue([mockProduct])
    mockedSaveEcobalyseResults.mockRejectedValue(new Error("Ecobalyse API error"))
    mockedFailProducts.mockResolvedValue(undefined)

    await expect(processProductsQueue()).rejects.toThrow("Ecobalyse API error")
    expect(mockedPrismaUpdate).not.toHaveBeenCalled()
  })
})
