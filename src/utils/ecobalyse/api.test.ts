import { saveEcobalyseResults, computeEcobalyseScore } from "./api"
import { createProductScore, failProducts } from "../../db/product"
import { prismaClient } from "../../db/prismaClient"
import { runElmFunction } from "./elm"
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
import { EcobalyseResponse } from "../../types/Ecobalyse"

jest.mock("../../db/product")
jest.mock("./elm")
jest.mock("../../db/prismaClient", () => ({
  prismaClient: {
    product: {
      update: jest.fn(),
    },
  },
}))

const mockedRunElmFunction = runElmFunction as jest.MockedFunction<typeof runElmFunction>
const mockedCreateProductScore = createProductScore as jest.MockedFunction<typeof createProductScore>
const mockedFailProducts = failProducts as jest.MockedFunction<typeof failProducts>
const mockedPrismaUpdate = prismaClient.product.update as jest.MockedFunction<typeof prismaClient.product.update>

describe("API Ecobalyse", () => {
  const mockEcobalyseResponse = {
    impacts: {
      ecs: 85.5,
      acd: 2.73,
      cch: 1589.45,
      etf: 20654.8,
      "etf-c": 21287.2,
      fru: 4289.7,
      fwe: 0.106,
      htc: 0.00000114,
      "htc-c": 0.0000000904,
      htn: 0.0000849,
      "htn-c": 0.000127,
      ior: 167.8,
      ldu: 51743.2,
      mru: 0.00423,
      ozd: 0.00268,
      pco: 1.548,
      pma: 0.0000423,
      swe: 0.459,
      tre: 5.207,
      wtu: 763.4,
      pef: 0.855,
    },
    durability: 0.75,
    complementsImpacts: {
      cropDiversity: 0,
      hedges: 0,
      livestockDensity: 0,
      microfibers: 12.3,
      outOfEuropeEOL: 1.2,
      permanentPasture: 0,
      plotSize: 0,
    },
  } satisfies EcobalyseResponse

  describe("saveEcobalyseResults", () => {
    const mockProduct: ProductWithMaterialsAndAccessories = {
      id: "product-1",
      gtins: ["1234567890123"],
      internalReference: "REF-001",
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
      countryFabric: Country.Inde,
      countryMaking: Country.Bangladesh,
      countrySpinning: Country.Myanmar,
      impression: Impression.Pigmentaire,
      impressionPercentage: 0.2,
      fading: false,
      upcycled: false,
      numberOfReferences: 100,
      declaredScore: null,
      materials: [
        {
          id: "mat-1",
          productId: "product-1",
          slug: MaterialType.Coton,
          share: 1.0,
          country: Country.Cambodge,
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
    })

    it("should compute and save score", async () => {
      mockedRunElmFunction.mockResolvedValueOnce(mockEcobalyseResponse)

      const results = await saveEcobalyseResults([mockProduct])

      expect(mockedRunElmFunction).toHaveBeenCalledWith({
        method: "POST",
        url: "/textile/simulator/detailed",
        body: {
          brand: undefined,
          declaredScore: undefined,
          gtins: undefined,
          internalReference: undefined,
          airTransportRatio: 0.1,
          business: "small-business",
          countryDyeing: "FR",
          countryFabric: "IN",
          countryMaking: "BD",
          countrySpinning: "MM",
          fading: false,
          mass: 0.5,
          materials: [{ id: "ei-coton", share: 1, country: "KH", productId: "product-1", slug: "Coton" }],
          numberOfReferences: 100,
          price: 25.99,
          printing: { kind: "pigment", ratio: 0.2 },
          product: "tshirt",
          trims: [{ id: "d56bb0d5-7999-4b8b-b076-94d79099b56a", quantity: 5 }],
          upcycled: false,
        },
      })

      expect(mockedCreateProductScore).toHaveBeenCalledWith({
        productId: "product-1",
        score: 85.5,
        standardized: (85.5 / 0.5) * 0.1,
        acd: 2.73,
        cch: 1589.45,
        durability: 0.75,
        etf: 21287.2,
        fru: 4289.7,
        fwe: 0.106,
        htc: 9.04e-8,
        htn: 0.000127,
        ior: 167.8,
        ldu: 51743.2,
        microfibers: 12.3,
        mru: 0.00423,
        outOfEuropeEOL: 1.2,
        ozd: 0.00268,
        pco: 1.548,
        pma: 0.0000423,
        swe: 0.459,
        tre: 5.207,
        wtu: 763.4,
      })

      expect(results).toEqual([
        {
          id: "product-1",
          score: 85.5,
          acd: 2.73,
          cch: 1589.45,
          durability: 0.75,
          etf: 21287.2,
          fru: 4289.7,
          fwe: 0.106,
          htc: 9.04e-8,
          htn: 0.000127,
          ior: 167.8,
          ldu: 51743.2,
          microfibers: 12.3,
          mru: 0.00423,
          outOfEuropeEOL: 1.2,
          ozd: 0.00268,
          pco: 1.548,
          pma: 0.0000423,
          swe: 0.459,
          tre: 5.207,
          wtu: 763.4,
        },
      ])
    })

    it("should remove undefined value before computing", async () => {
      mockedRunElmFunction.mockResolvedValueOnce(mockEcobalyseResponse)

      const results = await saveEcobalyseResults([
        {
          ...mockProduct,
          business: undefined,
          numberOfReferences: undefined,
          materials: [{ ...mockProduct.materials[0], country: undefined }],
        },
      ])

      expect(mockedRunElmFunction).toHaveBeenCalledWith({
        method: "POST",
        url: "/textile/simulator/detailed",
        body: {
          brand: undefined,
          declaredScore: undefined,
          gtins: undefined,
          internalReference: undefined,
          airTransportRatio: 0.1,
          countryFabric: "IN",
          countryMaking: "BD",
          countrySpinning: "MM",
          countryDyeing: "FR",
          fading: false,
          mass: 0.5,
          materials: [{ id: "ei-coton", share: 1, productId: "product-1", slug: "Coton" }],
          price: 25.99,
          printing: { kind: "pigment", ratio: 0.2 },
          product: "tshirt",
          trims: [{ id: "d56bb0d5-7999-4b8b-b076-94d79099b56a", quantity: 5 }],
          upcycled: false,
        },
      })

      expect(mockedCreateProductScore).toHaveBeenCalledWith({
        productId: "product-1",
        score: 85.5,
        standardized: (85.5 / 0.5) * 0.1,
        acd: 2.73,
        cch: 1589.45,
        durability: 0.75,
        etf: 21287.2,
        fru: 4289.7,
        fwe: 0.106,
        htc: 9.04e-8,
        htn: 0.000127,
        ior: 167.8,
        ldu: 51743.2,
        microfibers: 12.3,
        mru: 0.00423,
        outOfEuropeEOL: 1.2,
        ozd: 0.00268,
        pco: 1.548,
        pma: 0.0000423,
        swe: 0.459,
        tre: 5.207,
        wtu: 763.4,
      })

      expect(results).toEqual([
        {
          id: "product-1",
          score: 85.5,
          acd: 2.73,
          cch: 1589.45,
          durability: 0.75,
          etf: 21287.2,
          fru: 4289.7,
          fwe: 0.106,
          htc: 9.04e-8,
          htn: 0.000127,
          ior: 167.8,
          ldu: 51743.2,
          microfibers: 12.3,
          mru: 0.00423,
          outOfEuropeEOL: 1.2,
          ozd: 0.00268,
          pco: 1.548,
          pma: 0.0000423,
          swe: 0.459,
          tre: 5.207,
          wtu: 763.4,
        },
      ])
    })

    it("should fail if declared score is different", async () => {
      mockedRunElmFunction.mockResolvedValueOnce(mockEcobalyseResponse)
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
      mockedRunElmFunction.mockResolvedValueOnce(mockEcobalyseResponse)
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
        acd: 2.73,
        cch: 1589.45,
        durability: 0.75,
        etf: 21287.2,
        fru: 4289.7,
        fwe: 0.106,
        htc: 9.04e-8,
        htn: 0.000127,
        ior: 167.8,
        ldu: 51743.2,
        microfibers: 12.3,
        mru: 0.00423,
        outOfEuropeEOL: 1.2,
        ozd: 0.00268,
        pco: 1.548,
        pma: 0.0000423,
        swe: 0.459,
        tre: 5.207,
        wtu: 763.4,
      })
    })

    it("should fail product if api fail", async () => {
      const apiError = new Error("API Error")
      mockedRunElmFunction.mockRejectedValueOnce(apiError)
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

      mockedRunElmFunction.mockResolvedValueOnce(mockEcobalyseResponse).mockResolvedValueOnce({
        impacts: {
          ecs: 92.3,
          acd: 3.14,
          cch: 1823.67,
          etf: 23789.5,
          "etf-c": 24456.1,
          fru: 4932.8,
          fwe: 0.142,
          htc: 0.00000135,
          "htc-c": 0.000000108,
          htn: 0.0000978,
          "htn-c": 0.000146,
          ior: 193.2,
          ldu: 59432.7,
          mru: 0.00487,
          ozd: 0.00308,
          pco: 1.789,
          pma: 0.0000487,
          swe: 0.528,
          tre: 5.984,
          wtu: 878.9,
          pef: 0.923,
        },
        durability: 0.68,
        complementsImpacts: {
          cropDiversity: 0,
          hedges: 0,
          livestockDensity: 0,
          microfibers: 14.7,
          outOfEuropeEOL: 1.8,
          permanentPasture: 0,
          plotSize: 0,
        },
      })

      const results = await saveEcobalyseResults(products)

      expect(mockedRunElmFunction).toHaveBeenCalledTimes(2)
      expect(mockedCreateProductScore).toHaveBeenCalledTimes(2)
      expect(mockedCreateProductScore).toHaveBeenNthCalledWith(1, {
        productId: "product-1",
        score: 85.5,
        standardized: (85.5 / 0.5) * 0.1,
        acd: 2.73,
        cch: 1589.45,
        durability: 0.75,
        etf: 21287.2,
        fru: 4289.7,
        fwe: 0.106,
        htc: 9.04e-8,
        htn: 0.000127,
        ior: 167.8,
        ldu: 51743.2,
        microfibers: 12.3,
        mru: 0.00423,
        outOfEuropeEOL: 1.2,
        ozd: 0.00268,
        pco: 1.548,
        pma: 0.0000423,
        swe: 0.459,
        tre: 5.207,
        wtu: 763.4,
      })
      expect(mockedCreateProductScore).toHaveBeenNthCalledWith(2, {
        productId: "product-2",
        score: 92.3,
        standardized: (92.3 / 0.7) * 0.1,
        acd: 3.14,
        cch: 1823.67,
        durability: 0.68,
        etf: 24456.1,
        fru: 4932.8,
        fwe: 0.142,
        htc: 1.08e-7,
        htn: 0.000146,
        ior: 193.2,
        ldu: 59432.7,
        microfibers: 14.7,
        mru: 0.00487,
        outOfEuropeEOL: 1.8,
        ozd: 0.00308,
        pco: 1.789,
        pma: 0.0000487,
        swe: 0.528,
        tre: 5.984,
        wtu: 878.9,
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
      gtins: ["1234567891113", "1234567891012"],
      internalReference: "My-ref",
      brand: "TOTALENERGIES SE",
      declaredScore: 123,
      business: "large-business-without-services",
      countrySpinning: "CN",
      countryFabric: "IN",
      countryMaking: "BD",
      countryDyeing: "FR",
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
      trims: [],
      upcycled: false,
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should compute proper score", async () => {
      mockedRunElmFunction.mockResolvedValueOnce(mockEcobalyseResponse)

      const result = await computeEcobalyseScore(mockAPIProduct)

      expect(mockedRunElmFunction).toHaveBeenCalledWith({
        method: "POST",
        url: "/textile/simulator/detailed",
        body: {
          brand: undefined,
          declaredScore: undefined,
          gtins: undefined,
          internalReference: undefined,
          business: "large-business-without-services",
          countrySpinning: "CN",
          countryFabric: "IN",
          countryMaking: "BD",
          countryDyeing: "FR",
          mass: 0.15,
          materials: [{ id: "ei-coton", share: 1, spinning: "UnconventionalSpinning" }],
          numberOfReferences: 100000,
          price: 10,
          product: "tshirt",
          trims: [],
          upcycled: false,
        },
      })

      expect(result).toEqual({
        score: 85.5,
        acd: 2.73,
        cch: 1589.45,
        durability: 0.75,
        etf: 21287.2,
        fru: 4289.7,
        fwe: 0.106,
        htc: 9.04e-8,
        htn: 0.000127,
        ior: 167.8,
        ldu: 51743.2,
        microfibers: 12.3,
        mru: 0.00423,
        outOfEuropeEOL: 1.2,
        ozd: 0.00268,
        pco: 1.548,
        pma: 0.0000423,
        swe: 0.459,
        tre: 5.207,
        wtu: 763.4,
      })
    })
  })
})
