import z from "zod"
import { gtinsValidation } from "./gtins"
import { expectZodValidationToFail } from "./zodValidationTest"
describe("GTINsValidation", () => {
  const validGTINs = { gtins: ["12345670"] }
  const validation = z.object({
    gtins: gtinsValidation,
  })

  it("allows 8 digits gtin", () => {
    const result = validation.safeParse(validGTINs)
    expect(result.success).toEqual(true)
  })

  it("allows 13 digits gtin", () => {
    const result = validation.safeParse({ gtins: ["1234567890128"] })
    expect(result.success).toEqual(true)
  })

  it("allows multiples gtins", () => {
    const result = validation.safeParse({ gtins: ["1234567890128", "12345670"] })
    expect(result.success).toEqual(true)
  })

  it("does not allow product without GTINs", () => {
    expectZodValidationToFail(validation, validGTINs, { gtins: undefined }, [
      { path: ["gtins"], message: "Il doit y avoir au moins un GTIN" },
    ])
  })

  it("does not allow product with invalid GTINs", () => {
    expectZodValidationToFail(validation, validGTINs, { gtins: ["123"] }, [
      { path: ["gtins", "0"], message: "Le code GTIN doit contenir 8 ou 13 chiffres" },
    ])
  })

  it("does not allow product with empty GTINs", () => {
    expectZodValidationToFail(validation, validGTINs, { gtins: [] }, [
      { path: ["gtins"], message: "Il doit y avoir au moins un GTIN" },
    ])
  })

  it("does not allow product with invalid gtin code control", () => {
    expectZodValidationToFail(validation, validGTINs, { gtins: ["1234567891012", "12345670", "12345678", "123"] }, [
      { path: ["gtins", "0"], message: "Le code GTIN n'est pas valide (somme de contrôle incorrecte)" },
      { path: ["gtins", "2"], message: "Le code GTIN n'est pas valide (somme de contrôle incorrecte)" },
      { path: ["gtins", "3"], message: "Le code GTIN doit contenir 8 ou 13 chiffres" },
    ])
  })
})
