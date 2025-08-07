import { imageValidation } from "./image"

describe("imageValidation", () => {
  describe("type: score", () => {
    it("should validate with number values", () => {
      const result = imageValidation.safeParse({
        type: "score",
        score: 85.5,
        masse: 250,
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
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Too small: expected number to be >0")
    })

    it("should reject zero or negative masse", () => {
      const result = imageValidation.safeParse({
        type: "score",
        score: "85.5",
        masse: "0",
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Too small: expected number to be >0")
    })

    it("should reject invalid string numbers", () => {
      const result = imageValidation.safeParse({
        type: "score",
        score: "invalid",
        masse: "250",
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Invalid input: expected number, received NaN")
    })

    it("should reject missing required fields", () => {
      const result = imageValidation.safeParse({
        type: "score",
        score: "85.5",
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
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Le GTIN doit contenir 8 ou 13 chiffres")
    })

    it("should reject GTIN with non-numeric characters", () => {
      const result = imageValidation.safeParse({
        type: "gtin",
        gtin: "1234567A",
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
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Invalid input")
    })

    it("should reject missing type", () => {
      const result = imageValidation.safeParse({
        score: "85.5",
        masse: "250",
      })

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe("Invalid input")
    })
  })
})
