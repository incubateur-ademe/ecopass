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
      productAPIValidation,
      validProduct,
      {
        brand: "Nop",
      },
      [
        {
          path: ["brand"],
          message: 'Invalid option: expected one of "Test Brand"|"Test Brand 2"',
        },
      ],
    )
  })

  it("does not allow valid product with empty brand", () => {
    expectZodValidationToFail(
      productAPIValidation,
      validProduct,
      {
        brand: "",
      },
      [
        {
          path: ["brand"],
          message: 'Invalid option: expected one of "Test Brand"|"Test Brand 2"',
        },
      ],
    )
  })

  it("does not allow product without GTINs", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { gtins: undefined }, [
      { path: ["gtins"], message: "Invalid input: expected array, received undefined" },
    ])
  })

  it("does not allow product with invalid GTINs", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { gtins: ["123"] }, [
      { path: ["gtins", "0"], message: "Le code GTIN doit contenir 8 ou 13 chiffres" },
    ])
  })

  it("does not allow product with empty GTINs", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { gtins: [] }, [
      { path: ["gtins"], message: "Too small: expected array to have >=1 items" },
    ])
  })

  it("does not allow product without internal reference", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { internalReference: undefined }, [
      { path: ["internalReference"], message: "Invalid input: expected string, received undefined" },
    ])
  })

  it("does not allow product with invalid date", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { date: "not-a-date" }, [
      { path: ["date"], message: "Date de mise sur le marché invalide" },
    ])
  })

  it("does not allow product without date", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { date: undefined }, [
      { path: ["date"], message: "Invalid input: expected string, received undefined" },
    ])
  })

  it("does not allow product without brand", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { brand: undefined }, [
      { path: ["brand"], message: 'Invalid option: expected one of "Test Brand"|"Test Brand 2"' },
    ])
  })

  it("does not allow product with invalid declaredScore", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { declaredScore: "Parfait" }, [
      { path: ["declaredScore"], message: "Invalid input: expected number, received string" },
    ])
  })

  it("does not allow product without product category", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { product: undefined }, [
      {
        path: ["product"],
        message:
          'Invalid option: expected one of "chemise"|"jean"|"jupe"|"manteau"|"pantalon"|"pull"|"tshirt"|"chaussettes"|"calecon"|"slip"|"maillot-de-bain"',
      },
    ])
  })

  it("does not allow product with invalid product category", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { product: "Invalid" }, [
      {
        path: ["product"],
        message:
          'Invalid option: expected one of "chemise"|"jean"|"jupe"|"manteau"|"pantalon"|"pull"|"tshirt"|"chaussettes"|"calecon"|"slip"|"maillot-de-bain"',
      },
    ])
  })

  it("does not allow product with invalid airTransportRatio", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { airTransportRatio: "Train" }, [
      { path: ["airTransportRatio"], message: "Invalid input: expected number, received string" },
    ])
  })

  it("does not allow product with too low airTransportRatio", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { airTransportRatio: -1 }, [
      { path: ["airTransportRatio"], message: "Too small: expected number to be >=0" },
    ])
  })

  it("does not allow product with too high airTransportRatio", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { airTransportRatio: 1.1 }, [
      { path: ["airTransportRatio"], message: "Too big: expected number to be <=1" },
    ])
  })

  it("does not allow product with mass < 0.01", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { mass: 0 }, [
      { path: ["mass"], message: "Too small: expected number to be >=0.01" },
    ])
  })

  it("does not allow product with invalid upcycled", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { upcycled: "Non" }, [
      {
        path: ["upcycled"],
        message: "Invalid input: expected boolean, received string",
      },
    ])
  })

  it("does not allow product with invalid business", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { business: "Invalid" }, [
      {
        path: ["business"],
        message:
          'Invalid option: expected one of \"small-business\"|\"large-business-with-services\"|\"large-business-without-services\"',
      },
    ])
  })

  it("does not allow product with invalid fading", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { fading: "Non" }, [
      {
        path: ["fading"],
        message: "Invalid input: expected boolean, received string",
      },
    ])
  })

  it("does not allow product with invalid numberOfReferences", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { numberOfReferences: "Un paquet" }, [
      { path: ["numberOfReferences"], message: "Invalid input: expected number, received string" },
    ])
  })

  it("does not allow product with too low numberOfReferences", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { numberOfReferences: 0 }, [
      { path: ["numberOfReferences"], message: "Too small: expected number to be >=1" },
    ])
  })

  it("does not allow product with too high numberOfReferences", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { numberOfReferences: 1000000 }, [
      { path: ["numberOfReferences"], message: "Too big: expected number to be <=999999" },
    ])
  })

  it("does not allow product with invalid price", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { price: "Cher" }, [
      { path: ["price"], message: "Invalid input: expected number, received string" },
    ])
  })

  it("does not allow product with too low price", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { price: 0 }, [
      { path: ["price"], message: "Too small: expected number to be >=1" },
    ])
  })

  it("does not allow product with too high price", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { price: 1001 }, [
      { path: ["price"], message: "Too big: expected number to be <=1000" },
    ])
  })

  it("does not allow product with invalid countryDyeing", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { countryDyeing: "Ici" }, [
      {
        path: ["countryDyeing"],
        message:
          'Invalid option: expected one of \"REO\"|\"REE\"|\"RAS\"|\"RAF\"|\"RME\"|\"RLA\"|\"RNA\"|\"ROC\"|\"MM\"|\"BD\"|\"CN\"|\"FR\"|\"IN\"|\"KH\"|\"MA\"|\"PK\"|\"TN\"|\"TR\"|\"VN\"',
      },
    ])
  })
  it("does not allow product with invalid countryFabric", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { countryFabric: "Ici" }, [
      {
        path: ["countryFabric"],
        message:
          'Invalid option: expected one of \"REO\"|\"REE\"|\"RAS\"|\"RAF\"|\"RME\"|\"RLA\"|\"RNA\"|\"ROC\"|\"MM\"|\"BD\"|\"CN\"|\"FR\"|\"IN\"|\"KH\"|\"MA\"|\"PK\"|\"TN\"|\"TR\"|\"VN\"',
      },
    ])
  })

  it("does not allow product with invalid countryMaking", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { countryMaking: "Ici" }, [
      {
        path: ["countryMaking"],
        message:
          'Invalid option: expected one of \"REO\"|\"REE\"|\"RAS\"|\"RAF\"|\"RME\"|\"RLA\"|\"RNA\"|\"ROC\"|\"MM\"|\"BD\"|\"CN\"|\"FR\"|\"IN\"|\"KH\"|\"MA\"|\"PK\"|\"TN\"|\"TR\"|\"VN\"',
      },
    ])
  })

  it("does not allow product with invalid countrySpinning", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { countrySpinning: "Ici" }, [
      {
        path: ["countrySpinning"],
        message:
          'Invalid option: expected one of \"REO\"|\"REE\"|\"RAS\"|\"RAF\"|\"RME\"|\"RLA\"|\"RNA\"|\"ROC\"|\"MM\"|\"BD\"|\"CN\"|\"FR\"|\"IN\"|\"KH\"|\"MA\"|\"PK\"|\"TN\"|\"TR\"|\"VN\"',
      },
    ])
  })

  it("does not allow product with invalid printing kind", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { printing: { kind: "Pigmen" } }, [
      {
        path: ["printing", "kind"],
        message: 'Invalid option: expected one of "pigment"|"substantive"',
      },
    ])
  })

  it("does not allow product without printing kind", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { printing: { ratio: 0.2 } }, [
      {
        path: ["printing", "kind"],
        message: 'Invalid option: expected one of "pigment"|"substantive"',
      },
    ])
  })

  it("does not allow product with invalid printing ratio", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { printing: { kind: "pigment", ratio: "Tout" } }, [
      {
        path: ["printing", "ratio"],
        message: "Invalid input: expected number, received string",
      },
    ])
  })

  it("does not allow product with invalid material share sum", () => {
    expectZodValidationToFail(
      productAPIValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], share: 0.5 }] },
      [{ path: ["materials"], message: "La somme des parts de matières doit être égale à 100%" }],
    )
  })

  it("does not allow product with too low material share", () => {
    expectZodValidationToFail(
      productAPIValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], share: -0.5 }] },
      [
        { path: ["materials"], message: "La somme des parts de matières doit être égale à 100%" },
        { path: ["materials", "0", "share"], message: "Too small: expected number to be >=0" },
      ],
    )
  })

  it("does not allow product with too high material share", () => {
    expectZodValidationToFail(
      productAPIValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], share: 1.5 }] },
      [
        { path: ["materials"], message: "La somme des parts de matières doit être égale à 100%" },
        { path: ["materials", "0", "share"], message: "Too big: expected number to be <=1" },
      ],
    )
  })

  it("does not allow product with invalid material country", () => {
    expectZodValidationToFail(
      productAPIValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], country: "Mars" }] },
      [
        {
          path: ["materials", "0", "country"],
          message:
            'Invalid option: expected one of "REO"|"REE"|"RAS"|"RAF"|"RME"|"RLA"|"RNA"|"ROC"|"MM"|"BD"|"CN"|"FR"|"IN"|"KH"|"MA"|"PK"|"TN"|"TR"|"VN"',
        },
      ],
    )
  })
  it("does not allow product with invalid material type", () => {
    expectZodValidationToFail(
      productAPIValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], id: "Invalid" }] },
      [
        {
          path: ["materials", "0", "id"],
          message:
            'Invalid option: expected one of "elasthane"|"ei-acrylique"|"ei-jute-kenaf"|"ei-pp"|"ei-pet"|"ei-pet-r"|"ei-pa"|"ei-lin"|"ei-laine-par-defaut"|"ei-laine-nouvelle-filiere"|"ei-coton"|"ei-coton-organic"|"ei-chanvre"|"ei-viscose"|"coton-rdpc"|"coton-rdp"',
        },
      ],
    )
  })

  it("does not allow product with invalid trim type", () => {
    expectZodValidationToFail(
      productAPIValidation,
      validProduct,
      { trims: [{ ...validProduct.trims[0], id: "Invalid" }] },
      [
        {
          path: ["trims", "0", "id"],
          message:
            'Invalid option: expected one of "86b877ff-0d59-482f-bb34-3ff306b07496"|"0e8ea799-9b06-490c-a925-37564746c454"|"d56bb0d5-7999-4b8b-b076-94d79099b56a"|"0c903fc7-279b-4375-8cfa-ca8133b8e973"',
        },
      ],
    )
  })

  it("does not allow product with invalid trim quantity", () => {
    expectZodValidationToFail(
      productAPIValidation,
      validProduct,
      { trims: [{ ...validProduct.trims[0], quantity: 0 }] },
      [{ path: ["trims", "0", "quantity"], message: "Too small: expected number to be >=1" }],
    )
  })
})
