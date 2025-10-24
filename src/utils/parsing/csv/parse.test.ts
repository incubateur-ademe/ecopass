import { FileUpload } from "../../../db/upload"
import { v4 as uuid } from "uuid"
import { parseCSV } from "./parse"
import { Status } from "../../../../prisma/src/prisma"
import { AccessoryType, Business, Country, Impression, MaterialType, ProductCategory } from "../../../types/Product"
import { decryptBoolean, decryptNumber, decryptProductFields } from "../../encryption/encryption"
import { defaultHeaders, defaultProductRow } from "../parsingTest"

describe("parseCSV", () => {
  const header = `"${defaultHeaders.join('","')}"`
  const defaultProducts = `"${defaultProductRow.join('","')}"`

  const upload = {
    id: uuid(),
    name: "test.csv",
    createdAt: new Date(),
    products: [],
    createdBy: {
      email: "test@test.fr",
      organization: {
        name: "TestOrg",
        authorizedBy: [
          {
            from: {
              name: "OtherOrg",
              brands: [{ name: "otherBrand" }],
            },
          },
        ],
        brands: [{ name: "TestBrand" }],
      },
    },
    reUploadProducts: [],
  } satisfies FileUpload

  it("parses a valid CSV", async () => {
    const csv = Buffer.from(`${header}\n${defaultProducts}`)
    const { products, informations, materials, accessories } = await parseCSV(csv, null, upload)
    expect(products).toHaveLength(1)
    expect(materials).toHaveLength(2)
    expect(accessories).toHaveLength(1)

    expect(products[0].status).toBe(Status.Pending)
    expect(products[0].gtins).toEqual(["2234567891001", "3234567891000"])
    expect(products[0].internalReference).toBe("REF-123")
    expect(products[0].brand).toBe("Marque")
    expect(products[0].declaredScore).toBe(2222.63)

    const fullProducts = informations.map((information) => {
      return {
        ...information,
        materials: materials.filter((material) => material.productId === information.id),
        accessories: accessories.filter((accessory) => accessory.productId === information.id),
        upload: {
          createdBy: { organization: { name: "TestOrg", authorizedBy: [], brands: [] } },
        },
      }
    })
    const parsedProduct = decryptProductFields(fullProducts[0])
    expect(parsedProduct.category).toBe(ProductCategory.Pull)
    expect(parsedProduct.airTransportRatio).toBe(0.75)
    expect(parsedProduct.business).toBe(Business.WithoutServices)
    expect(parsedProduct.fading).toBe(false)
    expect(parsedProduct.mass).toBe(0.55)
    expect(parsedProduct.numberOfReferences).toBe(9000)
    expect(parsedProduct.price).toBe(100)
    expect(parsedProduct.countryDyeing).toBe(Country.Chine)
    expect(parsedProduct.countryFabric).toBe(Country.Chine)
    expect(parsedProduct.countryMaking).toBe(Country.Chine)
    expect(parsedProduct.countrySpinning).toBe(Country.Chine)
    expect(parsedProduct.impression).toBe(Impression.Pigmentaire)
    expect(parsedProduct.impressionPercentage).toBe(0.2)
    expect(parsedProduct.upcycled).toBe(false)
    expect(parsedProduct.materials).toHaveLength(2)
    expect(parsedProduct.materials[0].slug).toBe(MaterialType.Viscose)
    expect(parsedProduct.materials[0].country).toBe(Country.Chine)
    expect(parsedProduct.materials[0].share).toBe(0.9)
    expect(parsedProduct.materials[1].slug).toBe(MaterialType.Jute)
    expect(parsedProduct.materials[1].country).toBeUndefined()
    expect(parsedProduct.materials[1].share).toBe(0.1)
    expect(parsedProduct.accessories).toHaveLength(1)
    expect(parsedProduct.accessories[0].slug).toBe(AccessoryType.BoutonEnMétal)
    expect(parsedProduct.accessories[0].quantity).toBe(1)
  })

  it("parse a valid CSV with ecobalyse values", async () => {
    const product = `"2234567891001;3234567891000","REF-123",Marque,"2222,63",chemise,"0,55",false,9000,100,large-business-with-services,ei-pp,"90,00 %",BD,ei-acrylique,"10,00 %",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,BD,BD,BD,substantive,"20,00 %",BD,false,"75,00%",1,,,`

    const csv = Buffer.from(`${header}\n${product}`)
    const { products, informations, materials, accessories } = await parseCSV(csv, null, upload)
    expect(products).toHaveLength(1)
    expect(materials).toHaveLength(2)
    expect(accessories).toHaveLength(1)

    expect(products[0].status).toBe(Status.Pending)
    expect(products[0].gtins).toEqual(["2234567891001", "3234567891000"])
    expect(products[0].internalReference).toBe("REF-123")
    expect(products[0].brand).toBe("Marque")
    expect(products[0].declaredScore).toBe(2222.63)

    const fullProducts = informations.map((information) => {
      return {
        ...information,
        materials: materials.filter((material) => material.productId === information.id),
        accessories: accessories.filter((accessory) => accessory.productId === information.id),
        upload: {
          createdBy: { organization: { name: "TestOrg", authorizedBy: [], brands: [] } },
        },
      }
    })
    const parsedProduct = decryptProductFields(fullProducts[0])
    expect(parsedProduct.category).toBe(ProductCategory.Chemise)
    expect(parsedProduct.airTransportRatio).toBe(0.75)
    expect(parsedProduct.business).toBe(Business.WithServices)
    expect(parsedProduct.fading).toBe(false)
    expect(parsedProduct.mass).toBe(0.55)
    expect(parsedProduct.numberOfReferences).toBe(9000)
    expect(parsedProduct.price).toBe(100)
    expect(parsedProduct.countryDyeing).toBe(Country.Bangladesh)
    expect(parsedProduct.countryFabric).toBe(Country.Bangladesh)
    expect(parsedProduct.countryMaking).toBe(Country.Bangladesh)
    expect(parsedProduct.countrySpinning).toBe(Country.Bangladesh)
    expect(parsedProduct.impression).toBe(Impression.FixéLavé)
    expect(parsedProduct.impressionPercentage).toBe(0.2)
    expect(parsedProduct.upcycled).toBe(false)
    expect(parsedProduct.materials).toHaveLength(2)
    expect(parsedProduct.materials[0].slug).toBe(MaterialType.Polypropylène)
    expect(parsedProduct.materials[0].country).toBe(Country.Bangladesh)
    expect(parsedProduct.materials[0].share).toBe(0.9)
    expect(parsedProduct.materials[1].slug).toBe(MaterialType.Acrylique)
    expect(parsedProduct.materials[1].country).toBeUndefined()
    expect(parsedProduct.materials[1].share).toBe(0.1)
    expect(parsedProduct.accessories).toHaveLength(1)
    expect(parsedProduct.accessories[0].slug).toBe(AccessoryType.BoutonEnMétal)
    expect(parsedProduct.accessories[0].quantity).toBe(1)
  })

  it("parse all unvalid values", async () => {
    const invalidValues = header
      .split(",")
      .slice(0, -1)
      .map(() => "Test")
      .join(",")

    const csv = Buffer.from(`${header}\n${invalidValues}`)
    const { products, informations, materials, accessories } = await parseCSV(csv, null, upload)
    expect(products).toHaveLength(1)
    expect(materials).toHaveLength(16)
    expect(accessories).toHaveLength(4)

    expect(products[0].status).toBe(Status.Pending)
    expect(products[0].gtins).toEqual(["Test"])
    expect(products[0].internalReference).toBe("Test")
    expect(products[0].brand).toBe("Test")
    expect(products[0].declaredScore).toBe(-1)

    const fullProducts = informations.map((information) => {
      return {
        ...information,
        materials: materials.filter((material) => material.productId === information.id),
        accessories: accessories.filter((accessory) => accessory.productId === information.id),
        upload: {
          createdBy: { organization: { name: "TestOrg", authorizedBy: [], brands: [] } },
        },
      }
    })
    const parsedProduct = decryptProductFields(fullProducts[0])
    expect(parsedProduct.category).toBe("Test")
    expect(parsedProduct.airTransportRatio).toBe("Test")
    expect(parsedProduct.business).toBe("Test")
    expect(parsedProduct.fading).toBe("Test")
    expect(parsedProduct.mass).toBe("Test")
    expect(parsedProduct.numberOfReferences).toBe("Test")
    expect(parsedProduct.price).toBe("Test")
    expect(parsedProduct.countryDyeing).toBe("Test")
    expect(parsedProduct.countryFabric).toBe("Test")
    expect(parsedProduct.countryMaking).toBe("Test")
    expect(parsedProduct.countrySpinning).toBe("Test")
    expect(parsedProduct.impression).toBe("Test")
    expect(parsedProduct.impressionPercentage).toBe("Test")
    expect(parsedProduct.upcycled).toBe("Test")
    expect(parsedProduct.materials).toHaveLength(16)
    expect(parsedProduct.materials[0].slug).toBe("Test")
    expect(parsedProduct.materials[0].country).toBe("Test")
    expect(parsedProduct.materials[0].share).toBe("Test")
    expect(parsedProduct.materials[1].slug).toBe("Test")
    expect(parsedProduct.materials[1].country).toBe("Test")
    expect(parsedProduct.materials[1].share).toBe("Test")
    expect(parsedProduct.accessories).toHaveLength(4)
    expect(parsedProduct.accessories[0].quantity).toBe("Test")
  })

  it("parses a valid CSV with Accessoires", async () => {
    const accessoiresHeader =
      "GTINs/EANS;Référence interne;Marque;Score;Catégorie;Masse (en kg);Remanufacturé;Nombre de références;Prix (en euros, TTC);Taille de l'entreprise;Matière 1;Matière 1 pourcentage;Matière 1 origine;Matière 2;Matière 2 pourcentage;Matière 2 origine;Matière 3;Matière 3 pourcentage;Matière 3 origine;Matière 4;Matière 4 pourcentage;Matière 4 origine;Matière 5;Matière 5 pourcentage;Matière 5 origine;Matière 6;Matière 6 pourcentage;Matière 6 origine;Matière 7;Matière 7 pourcentage;Matière 7 origine;Matière 8;Matière 8 pourcentage;Matière 8 origine;Matière 9;Matière 9 pourcentage;Matière 9 origine;Matière 10;Matière 10 pourcentage;Matière 10 origine;Matière 11;Matière 11 pourcentage;Matière 11 origine;Matière 12;Matière 12 pourcentage;Matière 12 origine;Matière 13;Matière 13 pourcentage;Matière 13 origine;Matière 14;Matière 14 pourcentage;Matière 14 origine;Matière 15;Matière 15 pourcentage;Matière 15 origine;Matière 16;Matière 16 pourcentage;Matière 16 origine;Origine de filature;Origine de tissage/tricotage;Origine de l'ennoblissement/impression;Type d'impression;Pourcentage d'impression;Origine de confection;Délavage;Part du transport aérien;Accessoire 1;Accessoire 1 quantité;Accessoire 2;Accessoire 2 quantité;Accessoire 3;Accessoire 3 quantité;Accessoire 4;Accessoire 4 quantité"
    const product = `"2234567891001;3234567891000";"REF-123";"";"2222;63";Pull;"0;55";Non;9000;100;Grande entreprise sans service de réparation;Viscose;"90,00 %";Chine;Jute;"10,00 %";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;Chine;Chine;Chine;Pigmentaire;"20,00 %";Chine;Non;"75,00%";Bouton en métal;1;;;;;;`
    const csv = Buffer.from(`${accessoiresHeader}\n${product}`)
    const { products, informations, materials, accessories } = await parseCSV(csv, null, upload)
    expect(products).toHaveLength(1)
    expect(materials).toHaveLength(2)
    expect(accessories).toHaveLength(1)

    const fullProducts = informations.map((information) => {
      return {
        ...information,
        materials: materials.filter((material) => material.productId === information.id),
        accessories: accessories.filter((accessory) => accessory.productId === information.id),
        upload: {
          createdBy: { organization: { name: "TestOrg", authorizedBy: [], brands: [] } },
        },
      }
    })
    const parsedProduct = decryptProductFields(fullProducts[0])
    expect(parsedProduct.accessories[0].slug).toBe(AccessoryType.BoutonEnMétal)
    expect(parsedProduct.accessories[0].quantity).toBe(1)
  })

  it("parses a valid CSV with empty trims", async () => {
    const product = `"2234567891001;3234567891000","REF-123",Marque,"2222,63",chemise,"0,55",false,9000,100,large-business-with-services,ei-pp,"90,00 %",BD,ei-acrylique,"10,00 %",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,BD,BD,BD,substantive,"20,00 %",BD,false,"75,00%",0,,,`
    const csv = Buffer.from(`${header}\n${product}`)
    const { products, informations, materials, accessories } = await parseCSV(csv, null, upload)
    expect(products).toHaveLength(1)
    expect(informations).toHaveLength(1)
    expect(informations[0].emptyTrims).toBe(false)
    expect(materials).toHaveLength(2)
    expect(accessories).toHaveLength(1)
  })

  it("parses a valid CSV with default trims", async () => {
    const product = `"2234567891001;3234567891000","REF-123",Marque,"2222,63",chemise,"0,55",false,9000,100,large-business-with-services,ei-pp,"90,00 %",BD,ei-acrylique,"10,00 %",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,BD,BD,BD,substantive,"20,00 %",BD,false,"75,00%",,,,`
    const csv = Buffer.from(`${header}\n${product}`)
    const { products, informations, materials, accessories } = await parseCSV(csv, null, upload)
    expect(products).toHaveLength(1)
    expect(informations).toHaveLength(1)
    expect(informations[0].emptyTrims).toBe(true)
    expect(materials).toHaveLength(2)
    expect(accessories).toHaveLength(0)
  })

  it("parses a valid CSV with semi colon", async () => {
    const product = `"2234567891001;3234567891000";"REF-123";"";"2222;63";Pull;"0;55";Non;9000;100;Grande entreprise sans service de réparation;Viscose;"90,00 %";Chine;Jute;"10,00 %";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;Chine;Chine;Chine;Pigmentaire;"20,00 %";Chine;Non;"75,00%";1;;;`
    const csv = Buffer.from(`${header.replaceAll(",", ";")}\n${product}`)
    const { products, materials, accessories } = await parseCSV(csv, null, upload)
    expect(products).toHaveLength(1)
    expect(materials).toHaveLength(2)
    expect(accessories).toHaveLength(1)
  })

  it("parses a valid CSV with tabs", async () => {
    const product = `"2234567891001;3234567891000"\t"REF-123"\t""\t"2222\t63"\tPull\t"0\t55"\tNon\t9000\t100\tGrande entreprise sans service de réparation\tViscose\t"90,00 %"\tChine\tJute\t"10,00 %"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tChine\tChine\tChine\tPigmentaire\t"20,00 %"\tChine\tNon\t"75,00%"\t1\t\t\t`
    const csv = Buffer.from(`${header.replaceAll(",", "\t")}\n${product}`)
    const { products, materials, accessories } = await parseCSV(csv, null, upload)
    expect(products).toHaveLength(1)
    expect(materials).toHaveLength(2)
    expect(accessories).toHaveLength(1)
  })

  it("parse a valid CSV with restricted columns name", async () => {
    const restrictedHeader =
      "gtinseans,referenceinterne,marque,score,categorie,masse,remanufacture,nombredereferences,prix,tailledelentreprise,matiere1,matiere1pourcentage,matiere1origine,matiere2,matiere2pourcentage,matiere2origine,matiere3,matiere3pourcentage,matiere3origine,matiere4,matiere4pourcentage,matiere4origine,matiere5,matiere5pourcentage,matiere5origine,matiere6,matiere6pourcentage,matiere6origine,matiere7,matiere7pourcentage,matiere7origine,matiere8,matiere8pourcentage,matiere8origine,matiere9,matiere9pourcentage,matiere9origine,matiere10,matiere10pourcentage,matiere10origine,matiere11,matiere11pourcentage,matiere11origine,matiere12,matiere12pourcentage,matiere12origine,matiere13,matiere13pourcentage,matiere13origine,matiere14,matiere14pourcentage,matiere14origine,matiere15,matiere15pourcentage,matiere15origine,matiere16,matiere16pourcentage,matiere16origine,originedefilature,originedetissagetricotage,originedelennoblissementimpression,typedimpression,pourcentagedimpression,originedeconfection,delavage,partdutransportaerien,quantitedeboutonenmétal,quantitedeboutonenplastique,quantitedeziplong,quantitedezipcourt"
    const csv = Buffer.from(`${restrictedHeader}\n${defaultProducts}`)
    const { products } = await parseCSV(csv, null, upload)
    expect(products).toHaveLength(1)
  })

  it("parse a valid CSV with multiples products", async () => {
    const csv = Buffer.from(`${header}\n${defaultProducts}\n${defaultProducts}`)
    const { products, materials, accessories } = await parseCSV(csv, null, upload)
    expect(products).toHaveLength(2)
    expect(materials).toHaveLength(4)
    expect(accessories).toHaveLength(2)
  })

  it("ignores materials with empty or whitespace-only values", async () => {
    const csv = Buffer.from(
      `${header}\n${defaultProducts.replace('"Jute","10,00 %"","","","', '"Jute","10,00 %"",""," ","')}`,
    )
    const { products, materials } = await parseCSV(csv, null, upload)

    expect(products).toHaveLength(1)
    expect(materials).toHaveLength(2)
  })

  it("give proper errors on missing header", async () => {
    const csv = Buffer.from(`Test,Header\nValue1,Value2`)
    await expect(parseCSV(csv, null, upload)).rejects.toThrow(
      "Colonne(s) manquante(s): GTINs/Eans, Référence interne, Catégorie, Masse (en kg), Remanufacturé, Nombre de références, Prix (en euros, TTC), Taille de l'entreprise, Matière 1, Matière 1 pourcentage, Matière 1 origine, Origine de filature, Origine de tissage/tricotage, Origine de l'ennoblissement/impression, Type d'impression, Pourcentage d'impression, Origine de confection, Délavage, Part du transport aérien, Quantité de bouton en métal, Quantité de bouton en plastique, Quantité de zip long, Quantité de zip court",
    )
  })

  it("give proper errors on some missing header", async () => {
    const csv = Buffer.from(`GTINs/Eans, Référence interne\nValue1,Value2`)
    await expect(parseCSV(csv, null, upload)).rejects.toThrow(
      "Colonne(s) manquante(s): Catégorie, Masse (en kg), Remanufacturé, Nombre de références, Prix (en euros, TTC), Taille de l'entreprise, Matière 1, Matière 1 pourcentage, Matière 1 origine, Origine de filature, Origine de tissage/tricotage, Origine de l'ennoblissement/impression, Type d'impression, Pourcentage d'impression, Origine de confection, Délavage, Part du transport aérien, Quantité de bouton en métal, Quantité de bouton en plastique, Quantité de zip long, Quantité de zip court",
    )
  })

  it("give proper errors on some missing header and ; delimiter", async () => {
    const csv = Buffer.from(`GTINs/Eans; Référence interne\nValue1;Value2`)
    await expect(parseCSV(csv, null, upload)).rejects.toThrow(
      "Colonne(s) manquante(s): Catégorie, Masse (en kg), Remanufacturé, Nombre de références, Prix (en euros, TTC), Taille de l'entreprise, Matière 1, Matière 1 pourcentage, Matière 1 origine, Origine de filature, Origine de tissage/tricotage, Origine de l'ennoblissement/impression, Type d'impression, Pourcentage d'impression, Origine de confection, Délavage, Part du transport aérien, Quantité de bouton en métal, Quantité de bouton en plastique, Quantité de zip long, Quantité de zip court",
    )
  })

  it("does not fail when missing gtins", async () => {
    const csv = Buffer.from(`${header}\n${defaultProducts.replace('"2234567891001;3234567891000"', '""')}`)
    const { products } = await parseCSV(csv, null, upload)
    expect(products).toHaveLength(1)
    expect(products[0].gtins).toEqual([""])
  })

  it("default brand to user brand", async () => {
    const csv = Buffer.from(`${header}\n${defaultProducts.replace("Marque", "")}`)
    const { products } = await parseCSV(csv, null, upload)
    expect(products).toHaveLength(1)
    expect(products[0].brand).toEqual("TestOrg")
  })

  const trueValues = ["yes", "oui", "true"]
  trueValues.forEach((value) => {
    it(`undersands ${value} as boolean value`, async () => {
      const csv = Buffer.from(`${header}\n${defaultProducts.replaceAll("Non", value)}`)
      const { informations } = await parseCSV(csv, null, upload)
      expect(informations).toHaveLength(1)
      expect(decryptBoolean(informations[0].fading)).toBe(true)
    })
  })

  const falseValues = ["no", "non", "false"]
  falseValues.forEach((value) => {
    it(`undersands ${value} as boolean value`, async () => {
      const csv = Buffer.from(`${header}\n${defaultProducts.replaceAll("Non", value)}`)
      const { informations } = await parseCSV(csv, null, upload)
      expect(informations).toHaveLength(1)
      expect(decryptBoolean(informations[0].fading)).toBe(false)
    })
  })

  it("default declared score to -1", async () => {
    const csv = Buffer.from(`${header}\n${defaultProducts.replace("2222.63", "nimps")}`)
    const { products } = await parseCSV(csv, null, upload)
    expect(products).toHaveLength(1)
    expect(products[0].declaredScore).toBe(-1)
  })

  it("allows non specified %", async () => {
    const csv = Buffer.from(`${header}\n${defaultProducts.replaceAll(",00%", "")}`)
    const { informations } = await parseCSV(csv, null, upload)
    expect(informations).toHaveLength(1)

    expect(decryptNumber(informations[0].airTransportRatio)).toBe(0.75)
  })
})
