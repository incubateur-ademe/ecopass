import { getUserProductAPIValidation } from "./api"
import { expectZodValidationToFail } from "./zodValidationTest"

describe("productAPIValidation", () => {
  const productAPIValidation = getUserProductAPIValidation(["Test Brand", "Test Brand 2"])
  const validProduct = {
    gtins: ["12345678"],
    internalReference: "TestRef",
    date: "2024-01-01",
    brand: "Test Brand",
    product: "jean",
    mass: 1.23,
    materials: [
      {
        id: "ei-coton",
        share: 1,
      },
    ],
    trims: [{ id: "86b877ff-0d59-482f-bb34-3ff306b07496", quantity: 2 }],
  }

  it("allows valid product", () => {
    const result = productAPIValidation.safeParse(validProduct)
    expect(result.success).toEqual(true)
  })

  it("allows valid product without trims", () => {
    const result = productAPIValidation.safeParse({ ...validProduct, trims: undefined })
    expect(result.success).toEqual(true)
  })

  it("allows valid product with partial printing", () => {
    const result = productAPIValidation.safeParse({
      ...validProduct,
      printing: {
        kind: "pigment",
        ratio: undefined,
      },
    })
    expect(result.success).toEqual(true)
  })

  it("allows valid full product", () => {
    const result = productAPIValidation.safeParse({
      ...validProduct,
      declaredScore: 85,
      airTransportRatio: 0.5,
      upcycled: true,
      business: "small-business",
      fading: true,
      numberOfReferences: 10,
      price: 100,
      countryDyeing: "CN",
      countryFabric: "CN",
      countryMaking: "CN",
      countrySpinning: "CN",
      printing: {
        kind: "pigment",
        ratio: 0.8,
      },
      materials: [{ ...validProduct.materials[0], country: "FR" }],
    })
    expect(result.success).toEqual(true)
  })

  it("does not allow valid product with invalid brand", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      {
        brand: "Nop",
      },
      [
        {
          path: ["brand"],
          message: "Invalid enum value. Expected 'Test Brand' | 'Test Brand 2', received 'Nop'",
        },
      ],
    )
  })

  it("does not allow valid product with empty brand", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      {
        brand: "",
      },
      [
        {
          path: ["brand"],
          message: "Invalid enum value. Expected 'Test Brand' | 'Test Brand 2', received ''",
        },
      ],
    )
  })

  it("does not allow product without GTINs", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { gtins: undefined },
      [{ path: ["gtins"], message: "Required" }],
    )
  })

  it("does not allow product with invalid GTINs", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { gtins: ["123"] },
      [{ path: ["gtins", 0], message: "Le code GTIN doit contenir 8 ou 13 chiffres" }],
    )
  })

  it("does not allow product with empty GTINs", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { gtins: [] },
      [{ path: ["gtins"], message: "Array must contain at least 1 element(s)" }],
    )
  })

  it("does not allow product without internal reference", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { internalReference: undefined },
      [{ path: ["internalReference"], message: "Required" }],
    )
  })

  it("does not allow product with invalid date", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { date: "not-a-date" },
      [{ path: ["date"], message: "Date de mise sur le marché invalide" }],
    )
  })

  it("does not allow product without date", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { date: undefined },
      [{ path: ["date"], message: "Required" }],
    )
  })

  it("does not allow product without brand", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { brand: undefined },
      [{ path: ["brand"], message: "Required" }],
    )
  })

  it("does not allow product with invalid declaredScore", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { declaredScore: "Parfait" },
      [{ path: ["declaredScore"], message: "Expected number, received string" }],
    )
  })

  it("does not allow product without product category", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { product: undefined },
      [
        {
          path: ["product"],
          message: "Required",
        },
      ],
    )
  })

  it("does not allow product with invalid product category", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { product: "Invalid" },
      [
        {
          path: ["product"],
          message:
            "Invalid enum value. Expected 'chemise' | 'jean' | 'jupe' | 'manteau' | 'pantalon' | 'pull' | 'tshirt' | 'chaussettes' | 'calecon' | 'slip' | 'maillot-de-bain', received 'Invalid'",
        },
      ],
    )
  })

  it("does not allow product with invalid airTransportRatio", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { airTransportRatio: "Train" },
      [{ path: ["airTransportRatio"], message: "Expected number, received string" }],
    )
  })

  it("does not allow product with too low airTransportRatio", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { airTransportRatio: -1 },
      [{ path: ["airTransportRatio"], message: "Number must be greater than or equal to 0" }],
    )
  })

  it("does not allow product with too high airTransportRatio", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { airTransportRatio: 1.1 },
      [{ path: ["airTransportRatio"], message: "Number must be less than or equal to 1" }],
    )
  })

  it("does not allow product with mass < 0.01", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { mass: 0 },
      [{ path: ["mass"], message: "Number must be greater than or equal to 0.01" }],
    )
  })

  it("does not allow product with invalid upcycled", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { upcycled: "Non" },
      [
        {
          path: ["upcycled"],
          message: "Expected boolean, received string",
        },
      ],
    )
  })

  it("does not allow product with invalid business", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { business: "Invalid" },
      [
        {
          path: ["business"],
          message:
            "Invalid enum value. Expected 'small-business' | 'large-business-with-services' | 'large-business-without-services', received 'Invalid'",
        },
      ],
    )
  })

  it("does not allow product with invalid fading", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { fading: "Non" },
      [
        {
          path: ["fading"],
          message: "Expected boolean, received string",
        },
      ],
    )
  })

  it("does not allow product with invalid numberOfReferences", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { numberOfReferences: "Un paquet" },
      [{ path: ["numberOfReferences"], message: "Expected number, received string" }],
    )
  })

  it("does not allow product with too low numberOfReferences", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { numberOfReferences: 0 },
      [{ path: ["numberOfReferences"], message: "Number must be greater than or equal to 1" }],
    )
  })

  it("does not allow product with too high numberOfReferences", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { numberOfReferences: 1000000 },
      [{ path: ["numberOfReferences"], message: "Number must be less than or equal to 999999" }],
    )
  })

  it("does not allow product with invalid price", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { price: "Cher" },
      [{ path: ["price"], message: "Expected number, received string" }],
    )
  })

  it("does not allow product with too low price", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { price: 0 },
      [{ path: ["price"], message: "Number must be greater than or equal to 1" }],
    )
  })

  it("does not allow product with too high price", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { price: 1001 },
      [{ path: ["price"], message: "Number must be less than or equal to 1000" }],
    )
  })

  it("does not allow product with invalid countryDyeing", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { countryDyeing: "Ici" },
      [
        {
          path: ["countryDyeing"],
          message:
            "Invalid enum value. Expected 'REO' | 'REE' | 'RAS' | 'RAF' | 'RME' | 'RLA' | 'RNA' | 'ROC' | 'MM' | 'BD' | 'CN' | 'FR' | 'IN' | 'KH' | 'MA' | 'PK' | 'TN' | 'TR' | 'VN', received 'Ici'",
        },
      ],
    )
  })
  it("does not allow product with invalid countryFabric", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { countryFabric: "Ici" },
      [
        {
          path: ["countryFabric"],
          message:
            "Invalid enum value. Expected 'REO' | 'REE' | 'RAS' | 'RAF' | 'RME' | 'RLA' | 'RNA' | 'ROC' | 'MM' | 'BD' | 'CN' | 'FR' | 'IN' | 'KH' | 'MA' | 'PK' | 'TN' | 'TR' | 'VN', received 'Ici'",
        },
      ],
    )
  })

  it("does not allow product with invalid countryMaking", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { countryMaking: "Ici" },
      [
        {
          path: ["countryMaking"],
          message:
            "Invalid enum value. Expected 'REO' | 'REE' | 'RAS' | 'RAF' | 'RME' | 'RLA' | 'RNA' | 'ROC' | 'MM' | 'BD' | 'CN' | 'FR' | 'IN' | 'KH' | 'MA' | 'PK' | 'TN' | 'TR' | 'VN', received 'Ici'",
        },
      ],
    )
  })

  it("does not allow product with invalid countrySpinning", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { countrySpinning: "Ici" },
      [
        {
          path: ["countrySpinning"],
          message:
            "Invalid enum value. Expected 'REO' | 'REE' | 'RAS' | 'RAF' | 'RME' | 'RLA' | 'RNA' | 'ROC' | 'MM' | 'BD' | 'CN' | 'FR' | 'IN' | 'KH' | 'MA' | 'PK' | 'TN' | 'TR' | 'VN', received 'Ici'",
        },
      ],
    )
  })

  it("does not allow product with invalid printing kind", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { printing: { kind: "Pigmen" } },
      [
        {
          path: ["printing", "kind"],
          message: "Invalid enum value. Expected 'pigment' | 'substantive', received 'Pigmen'",
        },
      ],
    )
  })

  it("does not allow product without printing kind", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { printing: { ratio: 0.2 } },
      [
        {
          path: ["printing", "kind"],
          message: "Required",
        },
      ],
    )
  })

  it("does not allow product with invalid printing ratio", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { printing: { kind: "pigment", ratio: "Tout" } },
      [
        {
          path: ["printing", "ratio"],
          message: "Expected number, received string",
        },
      ],
    )
  })

  it("does not allow product with invalid material share sum", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], share: 0.5 }] },
      [{ path: ["materials"], message: "La somme des parts de matières doit être égale à 100%" }],
    )
  })

  it("does not allow product with too low material share", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], share: -0.5 }] },
      [
        { path: ["materials"], message: "La somme des parts de matières doit être égale à 100%" },
        { path: ["materials", 0, "share"], message: "Number must be greater than or equal to 0" },
      ],
    )
  })

  it("does not allow product with too high material share", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], share: 1.5 }] },
      [
        { path: ["materials"], message: "La somme des parts de matières doit être égale à 100%" },
        { path: ["materials", 0, "share"], message: "Number must be less than or equal to 1" },
      ],
    )
  })

  it("does not allow product with invalid material country", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], country: "Mars" }] },
      [
        {
          path: ["materials", 0, "country"],
          message:
            "Invalid enum value. Expected 'REO' | 'REE' | 'RAS' | 'RAF' | 'RME' | 'RLA' | 'RNA' | 'ROC' | 'MM' | 'BD' | 'CN' | 'FR' | 'IN' | 'KH' | 'MA' | 'PK' | 'TN' | 'TR' | 'VN', received 'Mars'",
        },
      ],
    )
  })
  it("does not allow product with invalid material type", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], id: "Invalid" }] },
      [
        {
          path: ["materials", 0, "id"],
          message:
            "Invalid enum value. Expected 'elasthane' | 'ei-acrylique' | 'ei-jute-kenaf' | 'ei-pp' | 'ei-pet' | 'ei-pet-r' | 'ei-pa' | 'ei-lin' | 'ei-laine-par-defaut' | 'ei-laine-nouvelle-filiere' | 'ei-coton' | 'ei-coton-organic' | 'ei-chanvre' | 'ei-viscose' | 'coton-rdpc' | 'coton-rdp', received 'Invalid'",
        },
      ],
    )
  })

  it("does not allow product with invalid trim type", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { trims: [{ ...validProduct.trims[0], id: "Invalid" }] },
      [
        {
          path: ["trims", 0, "id"],
          message:
            "Invalid enum value. Expected '86b877ff-0d59-482f-bb34-3ff306b07496' | '0e8ea799-9b06-490c-a925-37564746c454' | 'd56bb0d5-7999-4b8b-b076-94d79099b56a' | '0c903fc7-279b-4375-8cfa-ca8133b8e973', received 'Invalid'",
        },
      ],
    )
  })

  it("does not allow product with invalid trim quantity", () => {
    expectZodValidationToFail(
      // @ts-expect-error: Zod too complex
      productAPIValidation,
      validProduct,
      { trims: [{ ...validProduct.trims[0], quantity: 0 }] },
      [{ path: ["trims", 0, "quantity"], message: "Number must be greater than or equal to 1" }],
    )
  })
})
