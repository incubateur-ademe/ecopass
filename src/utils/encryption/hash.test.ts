import { hashProduct } from "./hash"
import { ProductAPIValidation } from "../../services/validation/api"

jest.mock("../ecobalyse/config", () => ({
  ecobalyseVersion: "test-version-1.0.0",
}))

describe("hashProduct", () => {
  const baseProduct: ProductAPIValidation = {
    gtins: ["1234567890123"],
    internalReference: "REF-TEST",
    brand: "TestBrand",
    mass: 0.17,
    materials: [
      {
        id: "ei-coton",
        share: 0.8,
        country: "FR",
      },
      {
        id: "ei-pet",
        share: 0.2,
        country: "CN",
      },
    ],
    product: "tshirt",
    countrySpinning: "FR",
    countryFabric: "FR",
    countryDyeing: "FR",
    countryMaking: "FR",
    business: "small-business",
    declaredScore: 1500,
  }

  it("should generate different hashes when materials change", () => {
    const hash1 = hashProduct(baseProduct, [])
    const hash2 = hashProduct(
      {
        ...baseProduct,
        materials: [
          {
            id: "ei-coton",
            share: 0.6,
            country: "FR",
          },
          {
            id: "ei-pet",
            share: 0.4,
            country: "CN",
          },
        ],
      },
      [],
    )

    expect(hash1).not.toBe(hash2)
  })

  it("should not generate different hash when materials order changes", () => {
    const productWithReorderedMaterials: ProductAPIValidation = {
      ...baseProduct,
      materials: [baseProduct.materials[1], baseProduct.materials[0]],
    }

    const hash1 = hashProduct(baseProduct, [])
    const hash2 = hashProduct(productWithReorderedMaterials, [])

    expect(hash1).toBe(hash2)
  })

  it("should include ecobalyse version in hash calculation", () => {
    const hash1 = hashProduct(baseProduct, [])

    jest.doMock("../ecobalyse/config", () => ({
      ecobalyseVersion: "test-version-2.0.0",
    }))

    jest.resetModules()
    const { hashProduct: hashProductWithNewVersion } = require("./hash")

    const hash2 = hashProductWithNewVersion(baseProduct, [])

    expect(hash1).not.toBe(hash2)
  })

  it("should generate different hashes when properties change", () => {
    const hash1 = hashProduct(baseProduct, [])
    const hash2 = hashProduct(
      {
        ...baseProduct,
        mass: 0.25,
      },
      [],
    )

    expect(hash1).not.toBe(hash2)
  })

  it("should include authorized brand information in hash", () => {
    const hash1 = hashProduct(baseProduct, [])
    const hash2 = hashProduct(baseProduct, ["ExternalBrand"])
    const hash3 = hashProduct(baseProduct, ["TestBrand"])

    expect(hash1).toBe(hash2)
    expect(hash1).not.toBe(hash3)
  })
})
