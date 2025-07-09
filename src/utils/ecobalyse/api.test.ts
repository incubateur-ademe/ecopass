import axios from "axios"
import { saveEcobalyseResults, computeEcobalyseScore } from "./api"
import { createProductScore, failProducts } from "../../db/product"
import { prismaClient } from "../../db/prismaClient"
import { Status } from "../../../prisma/src/prisma"
import {
  ProductWithMaterialsAndAccessories,
  Business,
  Country,
  MaterialType,
  AccessoryType,
  Impression,
  ProductCategory,
} from "../../types/Product"

jest.mock("axios")
jest.mock("../../db/product")
jest.mock("../../db/prismaClient", () => ({
  prismaClient: {
    product: {
      update: jest.fn(),
    },
    version: {
      findFirst: jest.fn(),
    },
  },
}))

const mockedAxios = axios as jest.Mocked<typeof axios>
const mockedCreateProductScore = createProductScore as jest.MockedFunction<typeof createProductScore>
const mockedFailProducts = failProducts as jest.MockedFunction<typeof failProducts>
const mockedPrismaUpdate = prismaClient.product.update as jest.MockedFunction<typeof prismaClient.product.update>
const mockedPrismaVersionFirst = prismaClient.version.findFirst as jest.MockedFunction<
  typeof prismaClient.version.findFirst
>

describe("API Ecobalyse", () => {
  const mockEcobalyseResponse = {
    data: {
      impacts: { ecs: 85.5 },
    },
  }

  describe("saveEcobalyseResults", () => {
    const mockProduct: ProductWithMaterialsAndAccessories = {
      id: "product-1",
      gtins: ["1234567890123"],
      internalReference: "REF-001",
      date: new Date("2023-01-01"),
      brand: "Test Brand",
      status: Status.Pending,
      error: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      uploadId: "upload-1",
      category: ProductCategory.TShirtPolo,
      business: Business.Small,
      mass: 0.5,
      price: 25.99,
      airTransportRatio: 0.1,
      countryDyeing: Country.France,
      countryFabric: Country.France,
      countryMaking: Country.France,
      countrySpinning: Country.France,
      impression: Impression.Pigmentaire,
      impressionPercentage: 0.2,
      fading: false,
      traceability: true,
      upcycled: false,
      numberOfReferences: 100,
      declaredScore: null,
      materials: [
        {
          id: "mat-1",
          productId: "product-1",
          slug: MaterialType.Coton,
          share: 1.0,
          country: Country.France,
        },
      ],
      accessories: [
        {
          id: "acc-1",
          productId: "product-1",
          slug: AccessoryType.BoutonEnPlastique,
          quantity: 5,
        },
      ],
    }
    beforeEach(() => {
      jest.clearAllMocks()
      mockedPrismaVersionFirst.mockResolvedValue({
        id: "version-1",
        createdAt: new Date("2023-01-01"),
        version: "v5.0.1",
        link: "https://ecobalyse.beta.gouv.fr/versions/v5.0.1",
      })
    })

    it("should compute and save score", async () => {
      mockedAxios.post.mockResolvedValueOnce(mockEcobalyseResponse)

      const results = await saveEcobalyseResults([mockProduct])

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://ecobalyse.beta.gouv.fr/versions/v5.0.1/textile/simulator/detailed",
        {
          airTransportRatio: 0.1,
          business: "small-business",
          countryDyeing: "FR",
          countryFabric: "FR",
          countryMaking: "FR",
          countrySpinning: "FR",
          fading: false,
          mass: 0.5,
          materials: [{ country: "FR", id: "ei-coton", productId: "product-1", share: 1, slug: "Coton" }],
          numberOfReferences: 100,
          price: 25.99,
          printing: { kind: "pigment", ratio: 0.2 },
          product: "tshirt",
          traceability: true,
          trims: [{ id: "d56bb0d5-7999-4b8b-b076-94d79099b56a", quantity: 5 }],
          upcycled: false,
        },
      )

      expect(mockedCreateProductScore).toHaveBeenCalledWith({
        productId: "product-1",
        score: 85.5,
        standardized: (85.5 / 0.5) * 0.1,
      })

      expect(results).toEqual([
        {
          id: "product-1",
          score: 85.5,
        },
      ])
    })

    it("should fail if declared score is different", async () => {
      mockedAxios.post.mockResolvedValueOnce(mockEcobalyseResponse)
      const productWithDeclaredScore = {
        ...mockProduct,
        declaredScore: 100,
      }

      await saveEcobalyseResults([productWithDeclaredScore])

      expect(mockedFailProducts).toHaveBeenCalledWith([
        {
          id: "product-1",
          error: "Le score déclaré (100) ne correspond pas au score calculé (85.5)",
        },
      ])

      expect(mockedCreateProductScore).not.toHaveBeenCalled()
    })

    it("should create score if declared score is correctly rounded", async () => {
      mockedAxios.post.mockResolvedValueOnce(mockEcobalyseResponse)
      const productWithDeclaredScore = {
        ...mockProduct,
        declaredScore: 86,
      }

      await saveEcobalyseResults([productWithDeclaredScore])

      expect(mockedFailProducts).not.toHaveBeenCalled()
      expect(mockedCreateProductScore).toHaveBeenCalledWith({
        productId: "product-1",
        score: 85.5,
        standardized: (85.5 / 0.5) * 0.1,
      })
    })

    it("should fail product if api fail", async () => {
      const apiError = new Error("API Error")
      mockedAxios.post.mockRejectedValueOnce(apiError)
      mockedPrismaUpdate.mockResolvedValueOnce({} as any)

      const results = await saveEcobalyseResults([mockProduct])

      expect(mockedPrismaUpdate).toHaveBeenCalledWith({
        where: { id: "product-1" },
        data: { status: Status.Error, error: "API Error" },
      })

      expect(results[0]).toBeUndefined()
    })

    it("should compute multiple products", async () => {
      const product2 = { ...mockProduct, id: "product-2", mass: 0.7 }
      const products = [mockProduct, product2]

      mockedAxios.post.mockResolvedValueOnce(mockEcobalyseResponse).mockResolvedValueOnce({
        data: {
          ...mockEcobalyseResponse.data,
          impacts: { ecs: 92.3 },
        },
      })

      const results = await saveEcobalyseResults(products)

      expect(mockedAxios.post).toHaveBeenCalledTimes(2)
      expect(mockedCreateProductScore).toHaveBeenCalledTimes(2)
      expect(mockedCreateProductScore).toHaveBeenNthCalledWith(1, {
        productId: "product-1",
        score: 85.5,
        standardized: (85.5 / 0.5) * 0.1,
      })
      expect(mockedCreateProductScore).toHaveBeenNthCalledWith(2, {
        productId: "product-2",
        score: 92.3,
        standardized: (92.3 / 0.7) * 0.1,
      })
      expect(results).toHaveLength(2)
      expect(results[0]?.id).toBe("product-1")
      expect(results[0]?.score).toBe(85.5)
      expect(results[1]?.id).toBe("product-2")
      expect(results[1]?.score).toBe(92.3)
    })
  })

  describe("computeEcobalyseScore", () => {
    const mockAPIProduct = {
      date: new Date("2025-01-01"),
      gtins: ["1234567891113", "1234567891012"],
      internalReference: "My-ref",
      brand: "TOTALENERGIES SE",
      declaredScore: 123,
      business: "large-business-without-services",
      countrySpinning: "CN",
      mass: 0.15,
      materials: [
        {
          id: "ei-coton",
          share: 1,
          spinning: "UnconventionalSpinning",
        },
      ],
      numberOfReferences: 100000,
      price: 10,
      product: "tshirt",
      traceability: false,
      trims: [],
      upcycled: false,
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should compute proper score", async () => {
      mockedAxios.post.mockResolvedValueOnce(mockEcobalyseResponse)

      const result = await computeEcobalyseScore(mockAPIProduct)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://ecobalyse.beta.gouv.fr/versions/v5.0.1/textile/simulator/detailed",
        {
          business: "large-business-without-services",
          countrySpinning: "CN",
          mass: 0.15,
          materials: [{ id: "ei-coton", share: 1, spinning: "UnconventionalSpinning" }],
          numberOfReferences: 100000,
          price: 10,
          product: "tshirt",
          traceability: false,
          trims: [],
          upcycled: false,
        },
      )

      expect(result).toEqual({
        score: 85.5,
      })
    })
  })
})
