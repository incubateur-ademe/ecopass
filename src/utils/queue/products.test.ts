import { processProductsQueue } from "./products"
import { failProducts, getProductsToProcess } from "../../db/product"
import { checkUploadsStatus } from "../../db/upload"
import { saveEcobalyseResults } from "../ecobalyse/api"
import { Status } from "../../../prisma/src/prisma"
import { Business, Country, Impression, MaterialType, ProductCategory } from "../../types/Product"

jest.mock("../../db/product")
jest.mock("../../db/upload")
jest.mock("../ecobalyse/api")

const mockedFailProducts = failProducts as jest.MockedFunction<typeof failProducts>
const mockedGetProductsToProcess = getProductsToProcess as jest.MockedFunction<typeof getProductsToProcess>
const mockedCheckUploadsStatus = checkUploadsStatus as jest.MockedFunction<typeof checkUploadsStatus>
const mockedSaveEcobalyseResults = saveEcobalyseResults as jest.MockedFunction<typeof saveEcobalyseResults>

describe("processProductsQueue", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockProduct = {
    error: null,
    hash: "test-hash",
    status: Status.Pending,
    createdAt: new Date(),
    updatedAt: new Date(),
    uploadId: "test-upload-id",
    uploadOrder: 1,
    upload: {
      id: "test-upload-id",
      createdBy: {
        email: "test@test.fr",
        organization: {
          name: "Test Organization",
          authorizedBy: [],
          brands: [],
        },
      },
    },
    id: "product-1",
    gtins: ["1234567891113", "1234567891012"],
    internalReference: "My-ref",
    brand: "Test Organization",
    declaredScore: 123,
    business: Business.Small,
    countrySpinning: Country.Chine,
    countryDyeing: Country.Chine,
    countryFabric: Country.Chine,
    countryMaking: Country.Chine,
    mass: 0.15,
    numberOfReferences: 100000,
    price: 10,
    category: ProductCategory.TShirtPolo,
    upcycled: false,
    impression: Impression.Pigmentaire,
    impressionPercentage: 0.2,
    airTransportRatio: 0.1,
    fading: false,
    materials: [
      {
        id: "mat-1",
        productId: "product-1",
        slug: MaterialType.Coton,
        share: 1,
        country: Country.Chine,
      },
    ],
    accessories: [],
  }

  it("should process products successfully when validation passes", async () => {
    mockedGetProductsToProcess.mockResolvedValue([mockProduct])

    await processProductsQueue()

    expect(mockedGetProductsToProcess).toHaveBeenCalledWith(
      process.env.BATCH_SIZE ? parseInt(process.env.BATCH_SIZE) : 10,
    )
    expect(mockedSaveEcobalyseResults).toHaveBeenCalledWith([
      {
        accessories: [],
        airTransportRatio: 0.1,
        brand: "Test Organization",
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
        gtins: ["1234567891113", "1234567891012"],
        id: "product-1",
        impression: "Pigmentaire",
        impressionPercentage: 0.2,
        internalReference: "My-ref",
        mass: 0.15,
        materials: [
          {
            country: "Chine",
            id: "mat-1",
            productId: "product-1",
            share: 1,
            slug: "Coton",
          },
        ],
        numberOfReferences: 100000,
        price: 10,
        status: "Pending",
        upcycled: false,
        updatedAt: expect.any(Date),
        uploadId: "test-upload-id",
      },
    ])
    expect(mockedFailProducts).toHaveBeenCalledWith([])
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
        id: "product-1",
        error: "Organization not found for product upload.",
      },
    ])
    expect(mockedCheckUploadsStatus).toHaveBeenCalledWith(["test-upload-id"])
  })

  it("should handle validation failures", async () => {
    mockedGetProductsToProcess.mockResolvedValue([{ ...mockProduct, gtins: ["invalid-gtin"] }])

    await processProductsQueue()

    expect(mockedSaveEcobalyseResults).toHaveBeenCalledWith([])
    expect(mockedFailProducts).toHaveBeenCalledWith([
      {
        id: "product-1",
        error: "Le code GTIN doit contenir 8 ou 13 chiffres",
      },
    ])
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
        brand: "Test Organization",
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
        gtins: ["1234567891113", "1234567891012"],
        id: "product-1",
        impression: "Pigmentaire",
        impressionPercentage: 0.2,
        internalReference: "My-ref",
        mass: 0.15,
        materials: [
          {
            country: "Chine",
            id: "mat-1",
            productId: "product-1",
            share: 1,
            slug: "Coton",
          },
        ],
        numberOfReferences: 100000,
        price: 10,
        status: "Pending",
        upcycled: false,
        updatedAt: expect.any(Date),
        uploadId: "test-upload-id",
      },
    ])
    expect(mockedFailProducts).toHaveBeenCalledWith([
      {
        id: "product-2",
        error: "Le code GTIN doit contenir 8 ou 13 chiffres",
      },
    ])
    expect(mockedCheckUploadsStatus).toHaveBeenCalledWith(["test-upload-id", "test-upload-id-2"])
  })

  it("should handle errors", async () => {
    mockedGetProductsToProcess.mockResolvedValue([mockProduct])
    mockedSaveEcobalyseResults.mockRejectedValue(new Error("Ecobalyse API error"))
    mockedFailProducts.mockResolvedValue(undefined)

    await expect(processProductsQueue()).rejects.toThrow("Ecobalyse API error")
  })
})
