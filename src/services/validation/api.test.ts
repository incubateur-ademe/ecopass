import {
  getUserMultiComponentProductAPIValidation,
  getUserProductAPIValidation,
  getUserProductsAPIValidation,
} from "./api"
import { expectZodValidationToFail } from "./zodValidationTest"

describe("productAPIValidation", () => {
  const productAPIValidation = getUserProductAPIValidation(["Test Brand", "Test Brand 2"])
  const validProduct = {
    internalReference: "TestRef",
    brandId: "Test Brand",
    product: "jean",
    mass: 1.23,
    materials: [
      {
        id: "ei-coton",
        share: 1,
      },
    ],
    countryDyeing: "CN",
    countryFabric: "FR",
    countryMaking: "ROC",
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

  it("allows valid full product", () => {
    const result = productAPIValidation.safeParse({
      ...validProduct,
      declaredScore: 85,
      airTransportRatio: 0.5,
      upcycled: false,
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
        brandId: "Nop",
      },
      [
        {
          path: ["brandId"],
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
        brandId: "",
      },
      [
        {
          path: ["brandId"],
          message: 'Invalid option: expected one of "Test Brand"|"Test Brand 2"',
        },
      ],
    )
  })

  it("does not allow product without internal reference", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { internalReference: undefined }, [
      { path: ["internalReference"], message: "Invalid input: expected string, received undefined" },
    ])
  })

  it("does not allow product without brand", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { brandId: undefined }, [
      { path: ["brandId"], message: 'Invalid option: expected one of "Test Brand"|"Test Brand 2"' },
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
    expectZodValidationToFail(productAPIValidation, validProduct, { printing: { kind: "Pigmen", ratio: 0.5 } }, [
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

  it("does not allow product with printing ratio not in allowed values", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { printing: { kind: "pigment", ratio: 0.4 } }, [
      {
        path: ["printing", "ratio"],
        message: "Invalid option: expected one of 0.01|0.05|0.2|0.5|0.8",
      },
    ])
  })

  it("does not allow product with partial printing", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { printing: { kind: "pigment" } }, [
      {
        path: ["printing", "ratio"],
        message: "Invalid option: expected one of 0.01|0.05|0.2|0.5|0.8",
      },
    ])
  })

  it("does not allow product with invalid printing ratio", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { printing: { kind: "pigment", ratio: "Tout" } }, [
      {
        path: ["printing", "ratio"],
        message: "Invalid option: expected one of 0.01|0.05|0.2|0.5|0.8",
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

  it("does not allow product without countryDyeing", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { countryDyeing: undefined }, [
      {
        path: [""],
        message: "countryDyeing et countryFabric sont requis quand upcycled n'est pas true",
      },
    ])
  })

  it("does not allow product without countryFabric", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { countryFabric: undefined }, [
      {
        path: [""],
        message: "countryDyeing et countryFabric sont requis quand upcycled n'est pas true",
      },
    ])
  })

  it("does not allow product without countryMaking", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { countryMaking: undefined }, [
      {
        path: ["countryMaking"],
        message:
          'Invalid option: expected one of "REO"|"REE"|"RAS"|"RAF"|"RME"|"RLA"|"RNA"|"ROC"|"MM"|"BD"|"CN"|"FR"|"IN"|"KH"|"MA"|"PK"|"TN"|"TR"|"VN"',
      },
    ])
  })

  it("allows upcycled product without countryDyeing and countryFabric", () => {
    const result = productAPIValidation.safeParse({
      ...validProduct,
      upcycled: true,
      countryDyeing: undefined,
      countryFabric: undefined,
    })
    expect(result.success).toEqual(true)
  })

  it("does not allow product with main component", () => {
    expectZodValidationToFail(productAPIValidation, validProduct, { mainComponent: true }, [
      { path: ["mainComponent"], message: "Invalid input: expected undefined, received boolean" },
    ])
  })
})

describe("productsAPIValidation", () => {
  const productsAPIValidation = getUserProductsAPIValidation(["Test Brand", "Test Brand 2"])
  const validProductBase = {
    product: "jean",
    mass: 1.23,
    materials: [
      {
        id: "ei-coton",
        share: 1,
      },
    ],
    countryDyeing: "CN",
    countryFabric: "FR",
    countryMaking: "ROC",
    trims: [{ id: "86b877ff-0d59-482f-bb34-3ff306b07496", quantity: 2 }],
  }

  const validProducts = {
    internalReference: "TestRef",
    brandId: "Test Brand",
    products: [validProductBase, { ...validProductBase, mass: 2.45 }],
  }

  it("allows valid products", () => {
    const result = productsAPIValidation.safeParse(validProducts)
    expect(result.success).toEqual(true)
  })

  it("allows valid products without trims", () => {
    const result = productsAPIValidation.safeParse({
      ...validProducts,
      products: validProducts.products.map((p) => ({ ...p, trims: undefined })),
    })
    expect(result.success).toEqual(true)
  })

  it("allows valid full products", () => {
    const result = productsAPIValidation.safeParse({
      ...validProducts,
      declaredScore: 85,
      numberOfReferences: 10,
      price: 100,
      products: validProducts.products.map((p) => ({
        ...p,
        airTransportRatio: 0.5,
        upcycled: false,
        business: "small-business",
        fading: true,
        countryDyeing: "CN",
        countryFabric: "CN",
        countryMaking: "CN",
        countrySpinning: "CN",
        printing: {
          kind: "pigment",
          ratio: 0.8,
        },
        materials: [{ ...validProductBase.materials[0], country: "FR" }],
      })),
    })
    expect(result.success).toEqual(true)
  })

  it("does not allow valid products with invalid brand", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      {
        brandId: "Nop",
      },
      [
        {
          path: ["brandId"],
          message: 'Invalid option: expected one of "Test Brand"|"Test Brand 2"',
        },
      ],
    )
  })

  it("does not allow valid products with empty brand", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      {
        brandId: "",
      },
      [
        {
          path: ["brandId"],
          message: 'Invalid option: expected one of "Test Brand"|"Test Brand 2"',
        },
      ],
    )
  })

  it("does not allow products without internal reference", () => {
    expectZodValidationToFail(productsAPIValidation, validProducts, { internalReference: undefined }, [
      { path: ["internalReference"], message: "Invalid input: expected string, received undefined" },
    ])
  })

  it("does not allow products without brand", () => {
    expectZodValidationToFail(productsAPIValidation, validProducts, { brandId: undefined }, [
      { path: ["brandId"], message: 'Invalid option: expected one of "Test Brand"|"Test Brand 2"' },
    ])
  })

  it("does not allow products with invalid declaredScore", () => {
    expectZodValidationToFail(productsAPIValidation, validProducts, { declaredScore: "invalid" }, [
      { path: ["declaredScore"], message: "Invalid input: expected number, received string" },
    ])
  })

  it("does not allow products without product category", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      { products: [validProductBase, { ...validProductBase, product: undefined }] },
      [
        {
          path: ["products", "1", "product"],
          message:
            'Invalid option: expected one of "chemise"|"jean"|"jupe"|"manteau"|"pantalon"|"pull"|"tshirt"|"chaussettes"|"calecon"|"slip"|"maillot-de-bain"',
        },
      ],
    )
  })

  it("does not allow products with invalid product category", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      { products: [validProductBase, { ...validProductBase, product: "invalid" }] },
      [
        {
          path: ["products", "1", "product"],
          message:
            'Invalid option: expected one of "chemise"|"jean"|"jupe"|"manteau"|"pantalon"|"pull"|"tshirt"|"chaussettes"|"calecon"|"slip"|"maillot-de-bain"',
        },
      ],
    )
  })

  it("does not allow products with invalid airTransportRatio", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      { products: [validProductBase, { ...validProductBase, airTransportRatio: "invalid" }] },
      [{ path: ["products", "1", "airTransportRatio"], message: "Invalid input: expected number, received string" }],
    )
  })

  it("does not allow products with too low airTransportRatio", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      { products: [validProductBase, { ...validProductBase, airTransportRatio: -0.1 }] },
      [{ path: ["products", "1", "airTransportRatio"], message: "Too small: expected number to be >=0" }],
    )
  })

  it("does not allow products with too high airTransportRatio", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      { products: [validProductBase, { ...validProductBase, airTransportRatio: 1.1 }] },
      [{ path: ["products", "1", "airTransportRatio"], message: "Too big: expected number to be <=1" }],
    )
  })

  it("does not allow products with mass < 0.01", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      { products: [validProductBase, { ...validProductBase, mass: 0.001 }] },
      [{ path: ["products", "1", "mass"], message: "Too small: expected number to be >=0.01" }],
    )
  })

  it("does not allow products with invalid upcycled", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      { products: [validProductBase, { ...validProductBase, upcycled: "invalid" }] },
      [
        {
          path: ["products", "1", "upcycled"],
          message: "Invalid input: expected boolean, received string",
        },
      ],
    )
  })

  it("does not allow products with invalid business", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      { products: [validProductBase, { ...validProductBase, business: "invalid" }] },
      [
        {
          path: ["products", "1", "business"],
          message:
            'Invalid option: expected one of "small-business"|"large-business-with-services"|"large-business-without-services"',
        },
      ],
    )
  })

  it("does not allow products with invalid fading", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      { products: [validProductBase, { ...validProductBase, fading: "invalid" }] },
      [
        {
          path: ["products", "1", "fading"],
          message: "Invalid input: expected boolean, received string",
        },
      ],
    )
  })

  it("does allow products with only one product", () => {
    const result = productsAPIValidation.safeParse({ ...validProducts, products: [validProductBase] })
    expect(result.success).toEqual(true)
  })

  it("does not allow products without any product", () => {
    expectZodValidationToFail(productsAPIValidation, validProducts, { products: [] }, [
      { path: ["products"], message: "Veuillez remplir au moins un produit." },
    ])
  })

  it("does not allow products without countryDyeing", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      { products: [{ ...validProductBase, countryDyeing: undefined }, validProductBase] },
      [
        {
          path: ["products"],
          message: "countryDyeing et countryFabric sont requis pour chaque produit quand upcycled n'est pas true",
        },
      ],
    )
  })

  it("does not allow products without countryFabric", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      { products: [{ ...validProductBase, countryFabric: undefined }, validProductBase] },
      [
        {
          path: ["products"],
          message: "countryDyeing et countryFabric sont requis pour chaque produit quand upcycled n'est pas true",
        },
      ],
    )
  })

  it("does not allow products without countryMaking", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      { products: [validProductBase, { ...validProductBase, countryMaking: undefined }] },
      [
        {
          path: ["products", "1", "countryMaking"],
          message:
            'Invalid option: expected one of "REO"|"REE"|"RAS"|"RAF"|"RME"|"RLA"|"RNA"|"ROC"|"MM"|"BD"|"CN"|"FR"|"IN"|"KH"|"MA"|"PK"|"TN"|"TR"|"VN"',
        },
      ],
    )
  })

  it("allows upcycled products without countryDyeing and countryFabric", () => {
    const result = productsAPIValidation.safeParse({
      ...validProducts,
      products: validProducts.products.map((p) => ({
        ...p,
        upcycled: true,
        countryDyeing: undefined,
        countryFabric: undefined,
      })),
    })
    expect(result.success).toEqual(true)
  })

  it("does not allow product with invalid numberOfReferences", () => {
    expectZodValidationToFail(productsAPIValidation, validProducts, { numberOfReferences: "Un paquet" }, [
      { path: ["numberOfReferences"], message: "Invalid input: expected number, received string" },
    ])
  })

  it("does not allow product with too low numberOfReferences", () => {
    expectZodValidationToFail(productsAPIValidation, validProducts, { numberOfReferences: 0 }, [
      { path: ["numberOfReferences"], message: "Too small: expected number to be >=1" },
    ])
  })

  it("does not allow product with too high numberOfReferences", () => {
    expectZodValidationToFail(productsAPIValidation, validProducts, { numberOfReferences: 1000000 }, [
      { path: ["numberOfReferences"], message: "Too big: expected number to be <=999999" },
    ])
  })

  it("does not allow product with invalid price", () => {
    expectZodValidationToFail(productsAPIValidation, validProducts, { price: "Cher" }, [
      { path: ["price"], message: "Invalid input: expected number, received string" },
    ])
  })

  it("does not allow product with too low price", () => {
    expectZodValidationToFail(productsAPIValidation, validProducts, { price: 0 }, [
      { path: ["price"], message: "Too small: expected number to be >=1" },
    ])
  })

  it("does not allow product with main component", () => {
    expectZodValidationToFail(
      productsAPIValidation,
      validProducts,
      {
        products: [
          { ...validProductBase, mainComponent: true },
          { ...validProductBase, mainComponent: false },
        ],
      },
      [
        { path: ["products", "0", "mainComponent"], message: "Invalid input: expected undefined, received boolean" },
        { path: ["products", "1", "mainComponent"], message: "Invalid input: expected undefined, received boolean" },
      ],
    )
  })
})

describe("multiComponentProductAPIValidation", () => {
  const multiComponentProductAPIValidation = getUserMultiComponentProductAPIValidation(["Test Brand", "Test Brand 2"])

  const validComponent = {
    mass: 1.23,
    materials: [
      {
        id: "ei-coton",
        share: 1,
      },
    ],
    countryDyeing: "CN",
    countryFabric: "FR",
    countryMaking: "REO",
    mainComponent: false,
  }

  const validMultiComponentProduct = {
    internalReference: "TestRef",
    brandId: "Test Brand",
    product: "jean",
    components: [validComponent, { ...validComponent, mass: 2.45, mainComponent: true }],
  }

  it("allows valid multi-component product", () => {
    const result = multiComponentProductAPIValidation.safeParse(validMultiComponentProduct)
    expect(result.success).toEqual(true)
  })

  it("allows multi-component product with no country making on secondary component", () => {
    const result = multiComponentProductAPIValidation.safeParse({
      ...validMultiComponentProduct,
      components: [
        { ...validComponent, mainComponent: true },
        { ...validComponent, mass: 2.45, mainComponent: false, countryMaking: undefined },
      ],
    })
    expect(result.success).toEqual(true)
  })

  it("does not allow multi-component product without components", () => {
    expectZodValidationToFail(multiComponentProductAPIValidation, validMultiComponentProduct, { components: [] }, [
      { path: ["components"], message: "Veuillez remplir au moins un composant." },
      { path: ["components"], message: "Il doit y avoir exactement un composant principal." },
    ])
  })

  it("does not allow multi-component product with no main component", () => {
    expectZodValidationToFail(
      multiComponentProductAPIValidation,
      validMultiComponentProduct,
      {
        components: [
          { ...validComponent, mainComponent: false },
          { ...validComponent, mass: 2.45, mainComponent: false },
        ],
      },
      [{ path: ["components"], message: "Il doit y avoir exactement un composant principal." }],
    )
  })

  it("does not allow multi-component product with two main components", () => {
    expectZodValidationToFail(
      multiComponentProductAPIValidation,
      validMultiComponentProduct,
      {
        components: [
          { ...validComponent, mainComponent: true },
          { ...validComponent, mass: 2.45, mainComponent: true },
        ],
      },
      [{ path: ["components"], message: "Il doit y avoir exactement un composant principal." }],
    )
  })

  it("does not allow main component without countryMaking", () => {
    expectZodValidationToFail(
      multiComponentProductAPIValidation,
      validMultiComponentProduct,
      {
        components: [
          { ...validComponent, mainComponent: false },
          { ...validComponent, mass: 2.45, mainComponent: true, countryMaking: undefined },
        ],
      },
      [
        {
          path: ["components", "1", "countryMaking"],
          message: "Le composant principal doit avoir un countryMaking spécifié.",
        },
      ],
    )
  })

  it("does not allow non-upcycled component without countryDyeing", () => {
    expectZodValidationToFail(
      multiComponentProductAPIValidation,
      validMultiComponentProduct,
      {
        components: [
          { ...validComponent, countryDyeing: undefined, mainComponent: true },
          { ...validComponent, mass: 2.45, mainComponent: false },
        ],
      },
      [
        {
          path: ["components"],
          message: "countryDyeing et countryFabric sont requis pour chaque composant quand upcycled n'est pas true",
        },
      ],
    )
  })

  it("allows upcycled components without countryDyeing and countryFabric", () => {
    const result = multiComponentProductAPIValidation.safeParse({
      ...validMultiComponentProduct,
      components: [
        {
          ...validComponent,
          upcycled: true,
          countryDyeing: undefined,
          countryFabric: undefined,
          mainComponent: true,
        },
        {
          ...validComponent,
          mass: 2.45,
          upcycled: true,
          countryDyeing: undefined,
          countryFabric: undefined,
          mainComponent: false,
        },
      ],
    })
    expect(result.success).toEqual(true)
  })

  it("does not allow multi-component product with invalid brand", () => {
    expectZodValidationToFail(multiComponentProductAPIValidation, validMultiComponentProduct, { brandId: "Nop" }, [
      {
        path: ["brandId"],
        message: 'Invalid option: expected one of "Test Brand"|"Test Brand 2"',
      },
    ])
  })
})
