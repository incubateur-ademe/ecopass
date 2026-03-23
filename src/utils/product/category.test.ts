import { BATCH_CATEGORY, getProductCategory } from "./category"

describe("getProductCategory", () => {
  it("should return categorySlug when only one information is provided", () => {
    const result = getProductCategory([{ categorySlug: "jean", mainComponent: false }])
    expect(result).toBe("jean")
  })

  it("should return null when only one information is provided with null category", () => {
    const result = getProductCategory([{ categorySlug: null, mainComponent: false }])
    expect(result).toBeNull()
  })

  it("should return main component category when multiple informations are provided", () => {
    const result = getProductCategory([
      { categorySlug: "pull", mainComponent: false },
      { categorySlug: "jean", mainComponent: true },
      { categorySlug: "chemise", mainComponent: false },
    ])
    expect(result).toBe("jean")
  })

  it("should return first main component category when multiple main components exist", () => {
    const result = getProductCategory([
      { categorySlug: "jean", mainComponent: true },
      { categorySlug: "pull", mainComponent: true },
    ])
    expect(result).toBe("jean")
  })

  it("should return batch category when no main component is found", () => {
    const result = getProductCategory([
      { categorySlug: "jean", mainComponent: false },
      { categorySlug: "pull", mainComponent: null },
    ])
    expect(result).toBe(BATCH_CATEGORY)
  })

  it("should return batch category when no main component are specified", () => {
    const result = getProductCategory([
      { categorySlug: "jean", mainComponent: null },
      { categorySlug: "pull", mainComponent: null },
    ])
    expect(result).toBe(BATCH_CATEGORY)
  })

  it("should return null when main component category is null", () => {
    const result = getProductCategory([
      { categorySlug: "jean", mainComponent: false },
      { categorySlug: null, mainComponent: true },
    ])
    expect(result).toBeNull()
  })
})
