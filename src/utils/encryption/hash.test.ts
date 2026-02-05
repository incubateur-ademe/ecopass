import { ProductInformationAPI, ProductMetadataAPI } from "../../services/validation/api"
import { Business, Country, ParsedProduct, ProductCategory } from "../../types/Product"
import { hashProduct } from "./hash"

jest.mock("../ecobalyse/config", () => ({
  ecobalyseVersion: "test-version-1.0.0",
}))

describe("hashProduct", () => {
  const baseProduct: ProductMetadataAPI = {
    gtins: ["1234567890123"],
    internalReference: "REF-TEST",
    brandId: "f05259c6-1599-431a-91ae-e7943405e4d6",
    declaredScore: 1500,
  }

  const baseParsedInformations: ParsedProduct = {
    mass: 0.17,
    materials: [
      {
        id: "ei-coton",
        share: 0.8,
        country: Country.France,
      },
      {
        id: "ei-pet",
        share: 0.2,
        country: Country.Chine,
      },
    ],
    product: ProductCategory.TShirtPolo,
    countrySpinning: Country.France,
    countryFabric: Country.France,
    countryDyeing: Country.France,
    countryMaking: Country.France,
    business: Business.Small,
    airTransportRatio: undefined,
    fading: undefined,
    numberOfReferences: undefined,
    price: undefined,
    upcycled: undefined,
    printing: undefined,
    trims: [],
  }

  const baseAPIInformations: ProductInformationAPI[] = [
    {
      mass: 0.17,
      materials: [
        {
          id: "ei-coton",
          share: 0.8,
          country: "France",
        },
        {
          id: "ei-pet",
          share: 0.2,
          country: "Chine",
        },
      ],
      product: "T-shirt / Polo",
      countrySpinning: "France",
      countryFabric: "France",
      countryDyeing: "France",
      countryMaking: "France",
      business: "TPE/PME",
      airTransportRatio: undefined,
      fading: undefined,
      numberOfReferences: undefined,
      price: undefined,
      upcycled: undefined,
      printing: undefined,
      trims: [],
    },
  ]

  it("should generate consistent hash for the same input", () => {
    const hash1 = hashProduct(baseProduct, [baseParsedInformations], [])
    const hash2 = hashProduct(baseProduct, baseAPIInformations, [])

    expect(hash1).toBe(hash2)
  })

  describe("hashParsedProduct", () => {
    it("should generate different hashes when materials change", () => {
      const hash1 = hashProduct(baseProduct, [baseParsedInformations], [])
      const hash2 = hashProduct(
        baseProduct,
        [
          {
            ...baseParsedInformations,
            materials: [
              {
                id: "ei-coton",
                share: 0.6,
                country: Country.France,
              },
              {
                id: "ei-pet",
                share: 0.4,
                country: Country.Chine,
              },
            ],
          },
        ],
        [],
      )

      expect(hash1).not.toBe(hash2)
    })

    it("should not generate different hash when materials order changes", () => {
      const productWithReorderedMaterials = {
        ...baseParsedInformations,
        materials: [baseParsedInformations.materials[1], baseParsedInformations.materials[0]],
      }

      const hash1 = hashProduct(baseProduct, [baseParsedInformations], [])
      const hash2 = hashProduct(baseProduct, [productWithReorderedMaterials], [])

      expect(hash1).toBe(hash2)
    })

    it("should include ecobalyse version in hash calculation", () => {
      const hash1 = hashProduct(baseProduct, [baseParsedInformations], [])

      jest.doMock("../ecobalyse/config", () => ({
        ecobalyseVersion: "test-version-2.0.0",
      }))

      jest.resetModules()
      const { hashProduct: hashProductWithNewVersion } = require("./hash")

      const hash2 = hashProductWithNewVersion(baseProduct, [baseParsedInformations], [])

      expect(hash1).not.toBe(hash2)
    })

    it("should generate different hashes when information properties change", () => {
      const hash1 = hashProduct(baseProduct, [baseParsedInformations], [])
      const hash2 = hashProduct(
        baseProduct,
        [
          {
            ...baseParsedInformations,
            mass: 0.25,
          },
        ],
        [],
      )

      expect(hash1).not.toBe(hash2)
    })

    it("should generate different hashes when product properties change", () => {
      const hash1 = hashProduct(baseProduct, [baseParsedInformations], [])
      const hash2 = hashProduct({ ...baseProduct, declaredScore: 1600 }, [baseParsedInformations], [])

      expect(hash1).not.toBe(hash2)
    })

    it("should include authorized brand information in hash", () => {
      const hash1 = hashProduct(baseProduct, [baseParsedInformations], [])
      const hash2 = hashProduct(baseProduct, [baseParsedInformations], ["39c78b8a-8e97-4464-96c5-e420820e1c20"])
      const hash3 = hashProduct(baseProduct, [baseParsedInformations], ["f05259c6-1599-431a-91ae-e7943405e4d6"])

      expect(hash1).toBe(hash2)
      expect(hash1).not.toBe(hash3)
    })
  })

  describe("hashProductAPI", () => {
    it("should generate different hashes when materials change", () => {
      const hash1 = hashProduct(baseProduct, baseAPIInformations, [])
      const hash2 = hashProduct(
        baseProduct,
        [
          {
            ...baseAPIInformations[0],
            materials: [
              {
                id: "ei-coton",
                share: 0.6,
                country: "France",
              },
              {
                id: "ei-pet",
                share: 0.4,
                country: "Chine",
              },
            ],
          },
        ],
        [],
      )

      expect(hash1).not.toBe(hash2)
    })

    it("should not generate different hash when materials order changes", () => {
      const informationsWithReorderedMaterials = [
        {
          ...baseAPIInformations[0],
          materials: [baseAPIInformations[0].materials[1], baseAPIInformations[0].materials[0]],
        },
      ]

      const hash1 = hashProduct(baseProduct, baseAPIInformations, [])
      const hash2 = hashProduct(baseProduct, informationsWithReorderedMaterials, [])

      expect(hash1).toBe(hash2)
    })

    it("should include ecobalyse version in hash calculation", () => {
      const hash1 = hashProduct(baseProduct, baseAPIInformations, [])

      jest.doMock("../ecobalyse/config", () => ({
        ecobalyseVersion: "test-version-2.0.0",
      }))

      jest.resetModules()
      const { hashProduct: hashProductWithNewVersion } = require("./hash")

      const hash2 = hashProductWithNewVersion(baseProduct, baseAPIInformations, [])

      expect(hash1).not.toBe(hash2)
    })

    it("should generate different hashes when information properties change", () => {
      const hash1 = hashProduct(baseProduct, baseAPIInformations, [])
      const hash2 = hashProduct(
        baseProduct,
        [
          {
            ...baseAPIInformations[0],
            mass: 0.25,
          },
        ],
        [],
      )

      expect(hash1).not.toBe(hash2)
    })

    it("should generate different hashes when product properties change", () => {
      const hash1 = hashProduct(baseProduct, baseAPIInformations, [])
      const hash2 = hashProduct({ ...baseProduct, declaredScore: 1600 }, baseAPIInformations, [])

      expect(hash1).not.toBe(hash2)
    })

    it("should include authorized brand information in hash", () => {
      const hash1 = hashProduct(baseProduct, baseAPIInformations, [])
      const hash2 = hashProduct(baseProduct, baseAPIInformations, ["39c78b8a-8e97-4464-96c5-e420820e1c20"])
      const hash3 = hashProduct(baseProduct, baseAPIInformations, ["f05259c6-1599-431a-91ae-e7943405e4d6"])

      expect(hash1).toBe(hash2)
      expect(hash1).not.toBe(hash3)
    })
  })
})
