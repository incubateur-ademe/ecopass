import { Status } from "../../../prisma/src/prisma"
import { AccessoryType, Business, Country, MaterialType, ProductCategory } from "../../types/Product"
import { getUserProductValidation } from "./product"
import { expectZodValidationToFail } from "./zodValidationTest"

describe("productValidation", () => {
  const productValidation = getUserProductValidation(["Test Brand", "Test Brand 2"])
  const validProduct = {
    id: "12345",
    uploadId: "upload-123",
    status: Status.Pending,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
    error: null,
    brand: "Test Brand",
    gtins: ["1234567890128"],
    internalReference: "TestRef",
    declaredScore: null,
    category: ProductCategory.Jean,
    mass: 0.5,
    countryDyeing: Country.Chine,
    countryFabric: Country.France,
    countryMaking: Country.RégionEuropeDeLOuest,
    materials: [
      {
        id: "material-1",
        productId: "12345",
        slug: MaterialType.Coton,
        share: 1,
      },
    ],
    accessories: [
      {
        id: "accessory-1",
        slug: AccessoryType.BoutonEnMétal,
        quantity: 4,
        productId: "123",
      },
    ],
  }

  it("allows valid product", () => {
    const result = productValidation.safeParse(validProduct)
    expect(result.success).toEqual(true)
  })

  it("allows valid product without accessories", () => {
    const result = productValidation.safeParse({ ...validProduct, accessories: [] })
    expect(result.success).toEqual(true)
  })

  it("allows full product", () => {
    const result = productValidation.safeParse({
      ...validProduct,
      airTransportRatio: 0.5,
      business: Business.Small,
      countryDyeing: Country.Bangladesh,
      countryFabric: Country.Cambodge,
      countryMaking: Country.Chine,
      countrySpinning: Country.Inde,
      fading: true,
      materials: [
        {
          id: "123",
          slug: MaterialType.Acrylique,
          country: Country.Pakistan,
          share: 0.2,
          productId: "123",
        },
        {
          id: "123",
          slug: MaterialType.Coton,
          country: Country.Myanmar,
          share: 0.8,
          productId: "123",
        },
      ],
      numberOfReferences: 625106,
      price: 50,
      accessories: [
        {
          id: "accessory-1",
          slug: AccessoryType.BoutonEnMétal,
          quantity: 4,
          productId: "123",
        },
      ],
      upcycled: false,
    })
    expect(result.success).toEqual(true)
  })

  it("does not allow valid product with invalid brand", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        brand: "Nop",
      },
      [
        {
          path: ["brand"],
          message: 'Marque invalide. Voici la liste de vos marques : "Test Brand", "Test Brand 2"',
        },
      ],
    )
  })

  it("does not allow valid product with empty brand", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        brand: "",
      },
      [
        {
          path: ["brand"],
          message: 'Marque invalide. Voici la liste de vos marques : "Test Brand", "Test Brand 2"',
        },
      ],
    )
  })

  it("does not allow valid product without category", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        category: undefined,
      },
      [
        {
          path: ["category"],
          message: "Catégorie de produit invalide",
        },
      ],
    )
  })

  it("does not allow valid product without category", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        category: undefined,
      },
      [
        {
          path: ["category"],
          message: "Catégorie de produit invalide",
        },
      ],
    )
  })

  it("does not allow valid product with invalid category", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        category: "Invalid",
      },
      [
        {
          path: ["category"],
          message: "Catégorie de produit invalide",
        },
      ],
    )
  })

  it("does not allow product with invalid GTINs", () => {
    expectZodValidationToFail(productValidation, validProduct, { gtins: ["123"] }, [
      { path: ["gtins", "0"], message: "Le code GTIN doit contenir 8 ou 13 chiffres" },
    ])
  })

  it("does not allow product without GTINs", () => {
    expectZodValidationToFail(productValidation, validProduct, { gtins: undefined }, [
      { path: ["gtins"], message: "Il doit y avoir au moins un GTIN" },
    ])
  })

  it("does not allow product with empty GTINs", () => {
    expectZodValidationToFail(productValidation, validProduct, { gtins: [] }, [
      { path: ["gtins"], message: "Il doit y avoir au moins un GTIN" },
    ])
  })

  it("does not allow product with invalid gtin code control", () => {
    expectZodValidationToFail(productValidation, validProduct, { gtins: ["1234567891012"] }, [
      { path: ["gtins", "0"], message: "Le code GTIN n'est pas valide (somme de contrôle incorrecte)" },
    ])
  })

  it("does not allow product without internal reference", () => {
    expectZodValidationToFail(productValidation, validProduct, { internalReference: [] }, [
      { path: ["internalReference"], message: "La référence interne est obligatoire" },
    ])
  })

  it("does not allow product with mass < 0.01", () => {
    expectZodValidationToFail(productValidation, validProduct, { mass: 0.009 }, [
      { path: ["mass"], message: "La masse doit être supérieure à 0,01 kg" },
    ])
  })

  it("does not allow product without mass", () => {
    expectZodValidationToFail(productValidation, validProduct, { mass: undefined }, [
      { path: ["mass"], message: "Le poids est obligatoire" },
    ])
  })

  it("does not allow product with zero declaredScore", () => {
    expectZodValidationToFail(productValidation, validProduct, { declaredScore: 0 }, [
      { path: ["declaredScore"], message: "Le score doit être un nombre positif" },
    ])
  })

  it("does not allow product with price too low", () => {
    expectZodValidationToFail(productValidation, validProduct, { price: 0 }, [
      { path: ["price"], message: "Le prix doit être supérieur à 1 €" },
    ])
  })

  it("does not allow product with price too high", () => {
    expectZodValidationToFail(productValidation, validProduct, { price: 10001 }, [
      { path: ["price"], message: "Le prix doit être inférieur à 1000 €" },
    ])
  })
  it("does not allow product with invalid price", () => {
    expectZodValidationToFail(productValidation, validProduct, { price: "Une bonne affaire" }, [
      { path: ["price"], message: "Le prix doit être un nombre" },
    ])
  })

  it("does not allow product with too low airTransportRatio", () => {
    expectZodValidationToFail(productValidation, validProduct, { airTransportRatio: -1 }, [
      { path: ["airTransportRatio"], message: "La part de transport aérien doit être supérieure à 0%" },
    ])
  })

  it("does not allow product with too high airTransportRatio", () => {
    expectZodValidationToFail(productValidation, validProduct, { airTransportRatio: 1.1 }, [
      { path: ["airTransportRatio"], message: "La part de transport aérien doit être inférieure à 100%" },
    ])
  })

  it("does not allow product with invalid airTransportRatio", () => {
    expectZodValidationToFail(productValidation, validProduct, { airTransportRatio: "par train" }, [
      { path: ["airTransportRatio"], message: "La part de transport aérien doit être un pourcentage" },
    ])
  })

  it("does not allow product with invalid material share sum", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], share: 0.5 }] },
      [{ path: ["materials"], message: "La somme des parts de matières doit être égale à 100%" }],
    )
  })

  it("does not allow product with invalid accessory quantity", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        accessories: [
          { ...validProduct.materials[0], id: "accessory-1", slug: AccessoryType.BoutonEnMétal, quantity: 0 },
        ],
      },
      [{ path: ["accessories", "0", "quantity"], message: "La quantité de l'accessoire doit être supérieure à 1" }],
    )
  })

  it("does not allow product with invalid upcycled", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        upcycled: "maybe",
      },
      [{ path: ["upcycled"], message: "Remanufacturé doit valoir 'Oui' ou 'Non'" }],
    )
  })

  it("does not allow product with invalid fading", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        fading: "maybe",
      },
      [{ path: ["fading"], message: "Délavage doit valoir 'Oui' ou 'Non'" }],
    )
  })

  it("does not allow product with invalid business", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        business: "Faire de l'argent",
      },
      [{ path: ["business"], message: "Taille de l'entreprise invalide" }],
    )
  })

  it("does not allow product with too low number of references", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        numberOfReferences: 0,
      },
      [{ path: ["numberOfReferences"], message: "Le nombre de références doit être supérieur à 1" }],
    )
  })

  it("does not allow product with too high number of references", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        numberOfReferences: 1000000,
      },
      [{ path: ["numberOfReferences"], message: "Le nombre de références doit être inférieur à 999 999" }],
    )
  })

  it("does not allow product with invalid number of references", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        numberOfReferences: "Beaucoup",
      },
      [{ path: ["numberOfReferences"], message: "Le nombre de références doit être un nombre" }],
    )
  })

  it("does not allow product with invalid countryFabric", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        countryFabric: "Ici",
      },
      [{ path: ["countryFabric"], message: "Origine de tissage/tricotage invalide" }],
    )
  })

  it("does not allow product with invalid countryDyeing", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        countryDyeing: "Ici",
      },
      [{ path: ["countryDyeing"], message: "Origine de l'ennoblissement/impression invalide" }],
    )
  })

  it("does not allow product with invalid countryMaking", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        countryMaking: "Ici",
      },
      [{ path: ["countryMaking"], message: "Origine de confection invalide" }],
    )
  })

  it("does not allow product with invalid countrySpinning", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        countrySpinning: "Ici",
      },
      [{ path: ["countrySpinning"], message: "Origine de filature invalide" }],
    )
  })

  it("does not allow product with invalid impression", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        impression: "Oui",
      },
      [{ path: ["impression"], message: "Type d'impression invalide" }],
    )
  })

  it("does not allow product with invalid impression percentage", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        impressionPercentage: "Tout",
      },
      [
        {
          path: ["impressionPercentage"],
          message: "Le pourcentage d'impression doit valoir 1%, 5%, 20%, 50% ou 80%",
        },
      ],
    )
  })

  it("does not allow product with impression percentage not in range", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        impressionPercentage: 0.4,
      },
      [
        {
          path: ["impressionPercentage"],
          message: "Le pourcentage d'impression doit valoir 1%, 5%, 20%, 50% ou 80%",
        },
      ],
    )
  })

  it("does not allow product with empty materials array", () => {
    expectZodValidationToFail(productValidation, validProduct, { materials: [] }, [
      { path: ["materials"], message: "La somme des parts de matières doit être égale à 100%" },
    ])
  })

  it("does not allow product with material share > 1", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], share: 1.1 }] },
      [
        { path: ["materials.0.share"], message: "La part de la matière doit être inférieure à 100%" },
        { path: ["materials"], message: "La somme des parts de matières doit être égale à 100%" },
      ],
    )
  })

  it("does not allow product with material share < 0", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], share: -0.1 }] },
      [
        { path: ["materials"], message: "La somme des parts de matières doit être égale à 100%" },
        { path: ["materials.0.share"], message: "La part de la matière doit être supérieure à 0%" },
      ],
    )
  })

  it("does not allow product with invalid material type", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], share: "Tout" }] },
      [{ path: ["materials.0.share"], message: "La part de la matière doit être un pourcentage" }],
    )
  })

  it("does not allow product with invalid material type", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], slug: "Papier" }] },
      [{ path: ["materials.0.slug"], message: "Type de matière invalide" }],
    )
  })

  it("does not allow product without material type", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], slug: undefined }] },
      [{ path: ["materials.0.slug"], message: "Type de matière invalide" }],
    )
  })

  it("does not allow product with invalid material country", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      { materials: [{ ...validProduct.materials[0], country: "La bas" }] },
      [{ path: ["materials.0.country"], message: "Origine de la matière invalide" }],
    )
  })

  it("does not allow product with invalid accessory type", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      { accessories: [{ ...validProduct.accessories[0], slug: "Col" }] },
      [{ path: ["accessories.0.slug"], message: "Type d'accessoire invalide" }],
    )
  })

  it("does not allow product with invalid accessory quantity", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      { accessories: [{ ...validProduct.accessories[0], quantity: 0 }] },
      [{ path: ["accessories.0.quantity"], message: "La quantité de l'accessoire doit être supérieure à 1" }],
    )
  })

  it("does not allow product without accessory quantity", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      { accessories: [{ ...validProduct.accessories[0], quantity: undefined }] },
      [{ path: ["accessories.0.quantity"], message: "La quantité de l'accessoire doit être un nombre" }],
    )
  })

  it("does not allow product without countryDyeing", () => {
    expectZodValidationToFail(productValidation, validProduct, { countryDyeing: undefined }, [
      { path: ["countryDyeing"], message: "Origine de l'ennoblissement/impression invalide" },
    ])
  })

  it("does not allow product without countryFabric", () => {
    expectZodValidationToFail(productValidation, validProduct, { countryFabric: undefined }, [
      { path: ["countryFabric"], message: "Origine de tissage/tricotage invalide" },
    ])
  })

  it("does not allow product without countryMaking", () => {
    expectZodValidationToFail(productValidation, validProduct, { countryMaking: undefined }, [
      { path: ["countryMaking"], message: "Origine de confection invalide" },
    ])
  })
})
