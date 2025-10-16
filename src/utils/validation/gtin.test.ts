import { isValidGtin } from "./gtin"

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
