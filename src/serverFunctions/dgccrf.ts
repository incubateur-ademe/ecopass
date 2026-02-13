"use server"

import { stringify } from "csv-stringify/sync"
import { UserRole } from "@prisma/enums"
import { auth } from "../services/auth/auth"
import { getLatestProductsByBrandIdForExport } from "../db/product"
import { decryptProductFields } from "../utils/encryption/encryption"
import { AccessoryType } from "../types/Product"

const formatBoolean = (value: boolean | string | undefined) => {
  if (value === undefined || value === null || value === "") {
    return ""
  }
  if (value === true || value === "true") {
    return "Oui"
  }
  if (value === false || value === "false") {
    return "Non"
  }
  return String(value)
}

const formatNumber = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === "") {
    return ""
  }
  return String(value)
}

const formatPercent = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === "") {
    return ""
  }
  const numeric = typeof value === "number" ? value : Number.parseFloat(String(value))
  if (Number.isNaN(numeric)) {
    return String(value)
  }
  return (numeric * 100).toFixed(2)
}

const materialColumns = Array.from({ length: 16 }, (_, index) => [
  `Matière ${index + 1}`,
  `Matière ${index + 1} pourcentage`,
  `Matière ${index + 1} origine`,
]).flat()

const headers = [
  "GTINs/EANS",
  "Référence interne",
  "Marque ID",
  "Marque",
  "Score déclaré",
  "Score calculé",
  "Score standardisé",
  "Catégorie",
  "Masse (en kg)",
  "Remanufacturé",
  "Nombre de références",
  "Prix (en euros, TTC)",
  "Taille de l'entreprise",
  ...materialColumns,
  "Origine de filature",
  "Origine de tissage/tricotage",
  "Origine de l'ennoblissement/impression",
  "Type d'impression",
  "Pourcentage d'impression",
  "Origine de confection",
  "Délavage",
  "Part du transport aérien",
  "Quantité de bouton en métal",
  "Quantité de bouton en plastique",
  "Quantité de zip long",
  "Quantité de zip court",
]

export const exportDgccrfBrandProducts = async (brandId: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return { error: "Utilisateur non authentifié" }
  }

  if (session.user.role !== UserRole.DGCCRF && session.user.role !== UserRole.ADMIN) {
    return { error: "Vous n'êtes pas autorisé à exporter ces produits" }
  }

  if (!brandId) {
    return { error: "Marque invalide" }
  }

  const products = await getLatestProductsByBrandIdForExport(brandId)
  if (products.length === 0) {
    return { error: "Aucun produit trouvé pour cette marque" }
  }
  const rows = products
    .filter((product) => product.informations.length === 1)
    .map((product) => {
      const decryptedProduct = decryptProductFields({
        ...product.informations[0],
        materials: product.informations[0].materials,
        accessories: product.informations[0].accessories,
      })

      const accessoryQuantities = {
        metal: "",
        plastic: "",
        zipLong: "",
        zipShort: "",
      }

      for (const accessory of decryptedProduct.accessories) {
        const quantity = formatNumber(accessory.quantity)
        switch (accessory.slug) {
          case AccessoryType.BoutonEnMétal:
            accessoryQuantities.metal = quantity
            break
          case AccessoryType.BoutonEnPlastique:
            accessoryQuantities.plastic = quantity
            break
          case AccessoryType.ZipLong:
            accessoryQuantities.zipLong = quantity
            break
          case AccessoryType.ZipCourt:
            accessoryQuantities.zipShort = quantity
            break
          default:
            break
        }
      }

      const materialValues = Array.from({ length: 16 }, (_, index) => {
        const material = decryptedProduct.materials[index]
        if (!material) {
          return ["", "", ""]
        }
        return [material.slug || "", formatPercent(material.share), material.country || ""]
      }).flat()

      return [
        product.gtins.join(";"),
        product.internalReference,
        product.brand?.id || "",
        product.brand?.name || "",
        formatNumber(product.declaredScore ?? ""),
        formatNumber(product.score ?? ""),
        formatNumber(product.standardized ?? ""),
        decryptedProduct.categorySlug || decryptedProduct.category,
        formatNumber(decryptedProduct.mass),
        formatBoolean(decryptedProduct.upcycled),
        formatNumber(decryptedProduct.numberOfReferences),
        formatNumber(decryptedProduct.price),
        decryptedProduct.business || "",
        ...materialValues,
        decryptedProduct.countrySpinning || "",
        decryptedProduct.countryFabric || "",
        decryptedProduct.countryDyeing || "",
        decryptedProduct.impression || "",
        formatPercent(decryptedProduct.impressionPercentage),
        decryptedProduct.countryMaking || "",
        formatBoolean(decryptedProduct.fading),
        formatPercent(decryptedProduct.airTransportRatio),
        accessoryQuantities.metal,
        accessoryQuantities.plastic,
        accessoryQuantities.zipLong,
        accessoryQuantities.zipShort,
      ]
    })

  return stringify(rows, {
    header: true,
    columns: headers,
  })
}
