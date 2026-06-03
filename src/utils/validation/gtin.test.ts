jest.mock("uuid", () => ({
  v4: () => "12345678-1234-1234-1234-123456789abc",
}))

import { getDefaultGTINs, isValidGtin } from "./gtin"

describe("isValidGtin", () => {
  it("should validate  GTIN-13 codes", () => {
    expect(isValidGtin("1234567890128")).toBe(true)
    expect(isValidGtin("0123456789012")).toBe(true)
    expect(isValidGtin("3050123456786")).toBe(true)

    expect(isValidGtin("1234567890129")).toBe(false)
  })

  it("should validate  GTIN-8 codes", () => {
    expect(isValidGtin("12345670")).toBe(true)
    expect(isValidGtin("01234565")).toBe(true)

    expect(isValidGtin("12345671")).toBe(false)
  })
})

describe("getDefaultGTINs", () => {
  it("should use siret when available", () => {
    const result = getDefaultGTINs(
      { id: "organization_id", siret: "12345678901234", uniqueId: "abcdefgh-ijkl" },
      "REF-001",
    )

    expect(result).toEqual(["REF-001-12345678901234"])
  })

  it("should fallback to first 8 chars of uniqueId when siret is missing", () => {
    const result = getDefaultGTINs({ id: "organization_id", siret: null, uniqueId: "abcdefgh-ijkl" }, "REF-001")

    expect(result).toEqual(["REF-001-abcdefgh"])
  })

  it("should fallback to first 8 chars of organization_id when siret and uniqueId are missing", () => {
    const result = getDefaultGTINs({ id: "organization_id", siret: null, uniqueId: null }, "REF-001")

    expect(result).toEqual(["REF-001-organiza"])
  })
})
