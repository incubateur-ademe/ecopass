import { imageValidation } from "./image"

describe("imageValidation", () => {
  describe("type: score", () => {
    it("should validate with number values", () => {
      const result = imageValidation.safeParse({
        type: "score",
        score: 85.5,
        masse: 250,
        model: "simple",
      })

      expect(result.success).toBe(true)
      expect(result.data?.type).toBe("score")
      if (result.success && result.data.type === "score") {
        expect(result.data.score).toBe(85.5)
        expect(result.data.masse).toBe(250)
      }
    })

    it("should validate and convert string values to numbers", () => {
      const result = imageValidation.safeParse({
        type: "score",
        score: "85.5",
        masse: "250",
        model: "simple",
      })

      expect(result.success).toBe(true)
      expect(result.data?.type).toBe("score")
      if (result.success && result.data.type === "score") {
        expect(result.data.score).toBe(85.5)
        expect(result.data.masse).toBe(250)
        expect(typeof result.data.score).toBe("number")
        expect(typeof result.data.masse).toBe("number")
      }
    })

    it("should reject negative score", () => {
      const result = imageValidation.safeParse({
        type: "score",
        score: "-10",
        masse: "250",
        model: "simple",
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Too small: expected number to be >0")
    })

    it("should reject zero or negative masse", () => {
      const result = imageValidation.safeParse({
        type: "score",
        score: "85.5",
        masse: "0",
        model: "simple",
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Too small: expected number to be >0")
    })

    it("should reject invalid string numbers", () => {
      const result = imageValidation.safeParse({
        type: "score",
        score: "invalid",
        masse: "250",
        model: "simple",
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Invalid input: expected number, received NaN")
    })

    it("should reject missing required fields", () => {
      const result = imageValidation.safeParse({
        type: "score",
        score: "85.5",
        model: "simple",
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Invalid input: expected number, received NaN")
    })
  })

  describe("type: gtin", () => {
    it("should validate 8-digit GTIN", () => {
      const result = imageValidation.safeParse({
        type: "gtin",
        gtin: "12345678",
        model: "simple",
      })

      expect(result.success).toBe(true)
      expect(result.data?.type).toBe("gtin")
      if (result.success && result.data.type === "gtin") {
        expect(result.data.gtin).toBe("12345678")
      }
    })

    it("should validate 13-digit GTIN", () => {
      const result = imageValidation.safeParse({
        type: "gtin",
        gtin: "1234567890123",
        model: "simple",
      })

      expect(result.success).toBe(true)
      expect(result.data?.type).toBe("gtin")
      if (result.success && result.data.type === "gtin") {
        expect(result.data.gtin).toBe("1234567890123")
      }
    })

    it("should reject invalid GTIN length", () => {
      const result = imageValidation.safeParse({
        type: "gtin",
        gtin: "12345",
        model: "simple",
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Le GTIN doit contenir 8 ou 13 chiffres")
    })

    it("should reject GTIN with non-numeric characters", () => {
      const result = imageValidation.safeParse({
        type: "gtin",
        gtin: "1234567A",
        model: "simple",
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Le GTIN doit contenir 8 ou 13 chiffres")
    })
  })

  describe("discriminated union", () => {
    it("should reject invalid type", () => {
      const result = imageValidation.safeParse({
        type: "invalid",
        score: "85.5",
        model: "simple",
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Invalid discriminator value. Expected 'score' | 'gtin'")
    })

    it("should reject missing type", () => {
      const result = imageValidation.safeParse({
        score: "85.5",
        masse: "250",
        model: "simple",
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Invalid discriminator value. Expected 'score' | 'gtin'")
    })

    it("should validate comparison model with category", () => {
      const result = imageValidation.safeParse({
        type: "score",
        score: "85.5",
        masse: "250",
        model: "withComparison",
        category: "jean",
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.model).toBe("withComparison")
        if (result.data.model === "withComparison") {
          expect(result.data.category).toBe("jean")
        }
      }
    })

    it("should reject comparison model without category", () => {
      const result = imageValidation.safeParse({
        type: "score",
        score: "85.5",
        masse: "250",
        model: "withSimpleComparison",
      })

      expect(result.success).toBe(false)
    })
  })
})
