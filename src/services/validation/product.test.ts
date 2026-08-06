import { Status } from "@prisma/enums"
import { AccessoryType, Business, Country, Impression, MaterialType, ProductCategory } from "../../types/Product"
import { getUserProductValidation } from "./product"
import { expectZodValidationToFail } from "./zodValidationTest"

describe("productValidation", () => {
  const productValidation = getUserProductValidation([
    "58ca7f37-0c8d-4463-ba40-c244c130192b",
    "cb7fc710-408e-47d1-9655-7c7b57a85118",
  ])
  const validProduct = {
    id: "12345",
    productId: "54321",
    uploadId: "upload-123",
    status: Status.Pending,
    createdAt: new Date("2023-01-01"),
    error: null,
    brandId: "58ca7f37-0c8d-4463-ba40-c244c130192b",
    internalReference: "TestRef",
    declaredScore: null,
    informations: [
      {
        id: "11111",
        productId: "54321",
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
      },
    ],
  }

  it("allows valid product", () => {
    const result = productValidation.safeParse(validProduct)
    expect(result.success).toEqual(true)
  })

  it("allows valid product without accessories", () => {
    const result = productValidation.safeParse({
      ...validProduct,
      informations: [{ ...validProduct.informations[0], accessories: [] }],
    })
    expect(result.success).toEqual(true)
  })

  it("allows full product", () => {
    const result = productValidation.safeParse({
      ...validProduct,
      informations: [
        {
          ...validProduct.informations[0],
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
        },
      ],
    })
    expect(result.success).toEqual(true)
  })

  it("does not allow valid product with invalid brand", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        brandId: "Nop",
      },
      [
        {
          path: ["brandId"],
          message:
            'Marque invalide. Voici la liste de vos marques : "58ca7f37-0c8d-4463-ba40-c244c130192b", "cb7fc710-408e-47d1-9655-7c7b57a85118"',
        },
      ],
    )
  })

  it("does not allow valid product with empty brand", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        brandId: "",
      },
      [
        {
          path: ["brandId"],
          message:
            'Marque invalide. Voici la liste de vos marques : "58ca7f37-0c8d-4463-ba40-c244c130192b", "cb7fc710-408e-47d1-9655-7c7b57a85118"',
        },
      ],
    )
  })

  it("does not allow valid product without category", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            category: undefined,
          },
        ],
      },
      [
        {
          path: ["informations", "0", "category"],
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
        informations: [
          {
            ...validProduct.informations[0],
            category: "Invalid",
          },
        ],
      },
      [
        {
          path: ["informations", "0", "category"],
          message: "Catégorie de produit invalide",
        },
      ],
    )
  })

  it("does not allow product without internal reference", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        internalReference: [],
      },
      [{ path: ["internalReference"], message: "La référence interne est obligatoire" }],
    )
  })

  it("does not allow product with mass < 0.01", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            mass: 0.009,
          },
        ],
      },
      [{ path: ["informations", "0", "mass"], message: "La masse doit être supérieure à 0,01 kg" }],
    )
  })

  it("does not allow product with mass > 10", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            mass: 10.01,
          },
        ],
      },
      [{ path: ["informations", "0", "mass"], message: "La masse doit être inférieure ou égale à 10 kg" }],
    )
  })

  it("does not allow product without mass", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            mass: undefined,
          },
        ],
      },
      [{ path: ["informations", "0", "mass"], message: "Le poids est obligatoire" }],
    )
  })

  it("does not allow product with zero declaredScore", () => {
    expectZodValidationToFail(productValidation, validProduct, { declaredScore: 0 }, [
      { path: ["declaredScore"], message: "Le score doit être un nombre positif" },
    ])
  })

  it("does not allow product with price too low", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            price: 0,
          },
        ],
      },
      [{ path: ["informations", "0", "price"], message: "Le prix doit être supérieur à 1 €" }],
    )
  })

  it("does not allow product with invalid price", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            price: "Une bonne affaire",
          },
        ],
      },
      [{ path: ["informations", "0", "price"], message: "Le prix doit être un nombre" }],
    )
  })

  it("does not allow product with too low airTransportRatio", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            airTransportRatio: -1,
          },
        ],
      },
      [
        {
          path: ["informations", "0", "airTransportRatio"],
          message: "La part de transport aérien doit être supérieure à 0%",
        },
      ],
    )
  })

  it("does not allow product with too high airTransportRatio", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            airTransportRatio: 1.1,
          },
        ],
      },
      [
        {
          path: ["informations", "0", "airTransportRatio"],
          message: "La part de transport aérien doit être inférieure à 100%",
        },
      ],
    )
  })

  it("does not allow product with invalid airTransportRatio", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            airTransportRatio: "par train",
          },
        ],
      },
      [
        {
          path: ["informations", "0", "airTransportRatio"],
          message: "La part de transport aérien doit être un pourcentage",
        },
      ],
    )
  })

  it("does not allow product with invalid material share sum", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            materials: [{ ...validProduct.informations[0].materials[0], share: 0.5 }],
          },
        ],
      },
      [{ path: ["informations", "0", "materials"], message: "La somme des parts de matières doit être égale à 100%" }],
    )
  })

  it("does not allow product with invalid accessory quantity", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            accessories: [
              {
                ...validProduct.informations[0].accessories[0],
                id: "accessory-1",
                slug: AccessoryType.BoutonEnMétal,
                quantity: -1,
              },
            ],
          },
        ],
      },
      [
        {
          path: ["informations", "0", "accessories", "0", "quantity"],
          message: "La quantité de l'accessoire doit être supérieure à 0",
        },
      ],
    )
  })

  it("does not allow product with invalid upcycled", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            upcycled: "maybe",
          },
        ],
      },
      [{ path: ["informations", "0", "upcycled"], message: "Remanufacturé doit valoir 'Oui' ou 'Non'" }],
    )
  })

  it("does not allow product with invalid fading", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            fading: "maybe",
          },
        ],
      },
      [{ path: ["informations", "0", "fading"], message: "Délavage doit valoir 'Oui' ou 'Non'" }],
    )
  })

  it("does not allow product with invalid business", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            business: "Faire de l'argent",
          },
        ],
      },
      [{ path: ["informations", "0", "business"], message: "Taille de l'entreprise invalide" }],
    )
  })

  it("does not allow product with too low number of references", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            numberOfReferences: 0,
          },
        ],
      },
      [
        {
          path: ["informations", "0", "numberOfReferences"],
          message: "Le nombre de références doit être supérieur à 1",
        },
      ],
    )
  })

  it("does not allow product with too high number of references", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            numberOfReferences: 1000000,
          },
        ],
      },
      [
        {
          path: ["informations", "0", "numberOfReferences"],
          message: "Le nombre de références doit être inférieur à 999 999",
        },
      ],
    )
  })

  it("does not allow product with invalid number of references", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            numberOfReferences: "Beaucoup",
          },
        ],
      },
      [{ path: ["informations", "0", "numberOfReferences"], message: "Le nombre de références doit être un nombre" }],
    )
  })

  it("does not allow product with invalid countryFabric", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            countryFabric: "Ici",
          },
        ],
      },
      [{ path: ["informations", "0", "countryFabric"], message: "Origine de tissage/tricotage invalide" }],
    )
  })

  it("does not allow product with invalid countryDyeing", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            countryDyeing: "Ici",
          },
        ],
      },
      [{ path: ["informations", "0", "countryDyeing"], message: "Origine de l'ennoblissement/impression invalide" }],
    )
  })

  it("does not allow product with invalid countryMaking", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            countryMaking: "Ici",
          },
        ],
      },
      [{ path: ["informations", "0", "countryMaking"], message: "Origine de confection invalide" }],
    )
  })

  it("does not allow product with invalid countrySpinning", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            countrySpinning: "Ici",
          },
        ],
      },
      [{ path: ["informations", "0", "countrySpinning"], message: "Origine de filature invalide" }],
    )
  })

  it("does not allow product with invalid impression", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            impression: "Oui",
          },
        ],
      },
      [{ path: ["informations", "0", "impression"], message: "Type d'impression invalide" }],
    )
  })

  it("does not allow product with only impression percentage", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            impressionPercentage: 0.8,
            impression: undefined,
          },
        ],
      },
      [
        {
          path: [],
          message: "Si le type d'impression est spécifié, le pourcentage d'impression doit également être spécifié",
        },
      ],
    )
  })

  it("does not allow product with only impression", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            impression: Impression.FixéLavé,
            impressionPercentage: undefined,
          },
        ],
      },
      [
        {
          path: [],
          message: "Si le type d'impression est spécifié, le pourcentage d'impression doit également être spécifié",
        },
      ],
    )
  })

  it("does not allow product with invalid impression percentage", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            impressionPercentage: "Tout",
          },
        ],
      },
      [
        {
          path: ["informations", "0", "impressionPercentage"],
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
        informations: [
          {
            ...validProduct.informations[0],
            impressionPercentage: 0.4,
          },
        ],
      },
      [
        {
          path: ["informations", "0", "impressionPercentage"],
          message: "Le pourcentage d'impression doit valoir 1%, 5%, 20%, 50% ou 80%",
        },
      ],
    )
  })

  it("does not allow product with empty materials array", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            materials: [],
          },
        ],
      },
      [{ path: ["informations", "0", "materials"], message: "La somme des parts de matières doit être égale à 100%" }],
    )
  })

  it("does not allow product with material share > 1", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            materials: [{ ...validProduct.informations[0].materials[0], share: 1.1 }],
          },
        ],
      },
      [
        {
          path: ["informations", "0", "materials", "0", "share"],
          message: "La part de la matière doit être inférieure à 100%",
        },
        { path: ["informations", "0", "materials"], message: "La somme des parts de matières doit être égale à 100%" },
      ],
    )
  })

  it("does not allow product with material share < 0", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            materials: [{ ...validProduct.informations[0].materials[0], share: -0.1 }],
          },
        ],
      },
      [
        { path: ["informations", "0", "materials"], message: "La somme des parts de matières doit être égale à 100%" },
        {
          path: ["informations", "0", "materials", "0", "share"],
          message: "La part de la matière doit être supérieure à 0%",
        },
      ],
    )
  })

  it("does not allow product with invalid material type", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            materials: [{ ...validProduct.informations[0].materials[0], share: "Tout" }],
          },
        ],
      },
      [
        {
          path: ["informations", "0", "materials", "0", "share"],
          message: "La part de la matière doit être un pourcentage",
        },
      ],
    )
  })

  it("does not allow product with invalid material type", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            materials: [{ ...validProduct.informations[0].materials[0], slug: "Papier" }],
          },
        ],
      },
      [{ path: ["informations", "0", "materials.0.slug"], message: "Type de matière invalide" }],
    )
  })

  it("does not allow product without material type", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            materials: [{ ...validProduct.informations[0].materials[0], slug: undefined }],
          },
        ],
      },
      [{ path: ["informations", "0", "materials.0.slug"], message: "Type de matière invalide" }],
    )
  })

  it("does not allow product with invalid material country", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            materials: [{ ...validProduct.informations[0].materials[0], country: "La bas" }],
          },
        ],
      },
      [{ path: ["informations", "0", "materials", "0", "country"], message: "Origine de la matière invalide" }],
    )
  })

  it("does not allow product with invalid accessory type", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            accessories: [{ ...validProduct.informations[0].accessories[0], slug: "Col" }],
          },
        ],
      },
      [{ path: ["informations", "0", "accessories.0.slug"], message: "Type d'accessoire invalide" }],
    )
  })

  it("does not allow product with invalid accessory quantity", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            accessories: [{ ...validProduct.informations[0].accessories[0], quantity: -1 }],
          },
        ],
      },
      [
        {
          path: ["informations", "0", "accessories", "0", "quantity"],
          message: "La quantité de l'accessoire doit être supérieure à 0",
        },
      ],
    )
  })

  it("does not allow product without accessory quantity", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            accessories: [{ ...validProduct.informations[0].accessories[0], quantity: undefined }],
          },
        ],
      },
      [
        {
          path: ["informations", "0", "accessories", "0", "quantity"],
          message: "La quantité de l'accessoire doit être un nombre entier",
        },
      ],
    )
  })

  it("does not allow product with floating accessory quantity", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            accessories: [{ ...validProduct.informations[0].accessories[0], quantity: 1.5 }],
          },
        ],
      },
      [
        {
          path: ["informations", "0", "accessories", "0", "quantity"],
          message: "La quantité de l'accessoire doit être un nombre entier",
        },
      ],
    )
  })

  it("does not allow product without countryDyeing", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            countryDyeing: undefined,
          },
        ],
      },
      [
        {
          path: [""],
          message:
            "L'origine de l'ennoblissement/impression et l'origine de tissage/tricotage sont requis quand le produit n'est pas remanufacturé",
        },
      ],
    )
  })

  it("does not allow product without countryFabric", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            countryFabric: undefined,
          },
        ],
      },
      [
        {
          path: [""],
          message:
            "L'origine de l'ennoblissement/impression et l'origine de tissage/tricotage sont requis quand le produit n'est pas remanufacturé",
        },
      ],
    )
  })

  it("does not allow product without countryMaking", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            countryMaking: undefined,
          },
        ],
      },
      [{ path: ["informations", "0", "countryMaking"], message: "Origine de confection invalide" }],
    )
  })

  it("allows upcycled product without countryDyeing and countryFabric", () => {
    const result = productValidation.safeParse({
      ...validProduct,

      informations: [
        {
          ...validProduct.informations[0],
          upcycled: true,
          countryDyeing: undefined,
          countryFabric: undefined,
        },
      ],
    })
    expect(result.success).toEqual(true)
  })

  it("allows main component product", () => {
    const result = productValidation.safeParse({
      ...validProduct,

      informations: [
        {
          ...validProduct.informations[0],
          mainComponent: true,
        },
      ],
    })
    expect(result.success).toEqual(true)
  })

  it("allows with null main component product", () => {
    const result = productValidation.safeParse({
      ...validProduct,

      informations: [
        {
          ...validProduct.informations[0],
          mainComponent: null,
        },
      ],
    })
    expect(result.success).toEqual(true)
  })

  it("does not allow product with invalid main component", () => {
    expectZodValidationToFail(
      productValidation,
      validProduct,
      {
        informations: [
          {
            ...validProduct.informations[0],
            mainComponent: "Nimps",
          },
        ],
      },
      [{ path: ["informations", "0", "mainComponent"], message: "Invalid input: expected boolean, received string" }],
    )
  })
})
