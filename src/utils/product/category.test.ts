import { ProductCategory } from "../../types/Product"
import { BATCH_CATEGORY, getProductCategory, getProductIcon } from "./category"

describe("category", () => {
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

  describe("getProductIcon", () => {
    it("should return undefined when categorySlug is null", () => {
      const result = getProductIcon(null)
      expect(result).toBeUndefined()
    })

    it("should return batch icon for batch category", () => {
      const result = getProductIcon(BATCH_CATEGORY)
      expect(result).toBe("batch")
    })

    it("should return icon from mapping for known category", () => {
      const result = getProductIcon(ProductCategory.Jean)
      expect(result).toBe("jean")
    })

    it("should return undefined for unknown category", () => {
      const result = getProductIcon("unknown-category")
      expect(result).toBeUndefined()
    })
  })
})
