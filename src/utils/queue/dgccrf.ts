import { stringify } from "csv-stringify/sync"
import { forEachLatestProductsByBrandIdForExport, ProductFilters } from "../../db/product"
import { decryptProductFields } from "../../utils/encryption/encryption"
import { AccessoryType } from "../../types/Product"
import { formatDate } from "../../services/format"
import { BATCH_CATEGORY } from "../../utils/product/category"
import { canExportFullProducts } from "../../utils/authorization/authorizations"
import { getUser } from "../../db/user"
import { getMeanScores } from "../../db/score"

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
  "Date de la dernière déclaration",
  "GTINs/EANs",
  "Référence interne",
  "Marque déclarée",
  "SIRET",
  "Score déclaré par la marque",
  "Score calculé pour la marque",
  "Score standardisé",
  "Coefficient de durabilité",
  "Catégorie",
  "Élément",
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

export const exportDgccrfBrandProducts = async (userId: string, filters: ProductFilters) => {
  console.log(`[exportDgccrfBrandProducts] Starting - filters: ${JSON.stringify(filters)}`)

  const user = await getUser(userId)
  if (!user) {
    return { error: "Utilisateur non authentifié" }
  }

  if (!canExportFullProducts(user.role, filters.brandId)) {
    if (filters.brandId) {
      return { error: "Vous n'êtes pas autorisé à exporter ces produits" }
    }

    return { error: "Marque invalide" }
  }

  let csv = ""
  let hasRows = false

  const processedProducts = await forEachLatestProductsByBrandIdForExport(
    async (products) => {
      const rows = await Promise.all(
        products.map(async (product) => {
          const sortedInformations = [...product.informations].sort((a, b) => {
            if (a.mainComponent && !b.mainComponent) {
              return -1
            }
            if (!a.mainComponent && b.mainComponent) {
              return 1
            }
            return 0
          })

          const total = sortedInformations.length
          const hasMainComponent = sortedInformations.some((info) => info.mainComponent)

          const totalScore = await getMeanScores(product)
          return sortedInformations.map((information, index) => {
            const decryptedProduct = decryptProductFields({
              ...information,
              materials: information.materials,
              accessories: information.accessories,
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
              formatDate(product.createdAt),
              product.gtins.join(";"),
              product.internalReference,
              product.brand?.name || "",
              product.upload?.organization?.siret || "",
              formatNumber(product.declaredScore !== null ? Math.round(product.declaredScore) : ""),
              formatNumber(Math.round(totalScore.score)),
              formatNumber(Math.round(totalScore.standardized)),
              formatNumber(Math.round(totalScore.durability * 100) / 100),
              total > 1 && !hasMainComponent
                ? BATCH_CATEGORY
                : decryptedProduct.categorySlug || decryptedProduct.category,
              `${index + 1}/${total}`,
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
        }),
      )

      const content = rows.flatMap((row) => row)
      if (content.length === 0) {
        return
      }

      csv = csv.concat(
        stringify(content, {
          header: !hasRows,
          columns: headers,
        }),
      )
      hasRows = true
    },
    user,
    filters,
  )

  if (processedProducts === 0 || !hasRows) {
    console.error(`[exportDgccrfBrandProducts] Error - No products found for brandId: ${filters.brandId}`)
    return { error: "Aucun produit trouvé pour cette marque" }
  }

  console.log(`[exportDgccrfBrandProducts] Completed - processedProducts: ${processedProducts}`)
  return csv
}
