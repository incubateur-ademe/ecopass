import "dotenv/config"
import { prismaClient } from "../db/prismaClient"
import { stringify } from "csv-stringify/sync"
import fs from "fs"
import path from "path"
import { BATCH_CATEGORY } from "../utils/types/productCategory"
import { computeBatchScore } from "../utils/ecobalyse/batches"

const getDataGouvCSV = async () => {
  console.log("Fetching all Done products...")

  const products = await prismaClient.product.findMany({
    where: {
      status: "Done",
    },
    include: {
      brand: { select: { name: true } },
      informations: { select: { categorySlug: true }, include: { score: true } },
      upload: {
        include: {
          createdBy: {
            select: {
              email: true,
              nom: true,
              prenom: true,
            },
          },
          organization: {
            select: {
              name: true,
              siret: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  console.log(`Found ${products.length} products`)

  const uniqueProducts = new Map<string, (typeof products)[0]>()

  for (const product of products) {
    for (const gtin of product.gtins) {
      const existing = uniqueProducts.get(gtin)
      if (!existing || product.createdAt > existing.createdAt) {
        uniqueProducts.set(gtin, product)
      }
    }
  }

  console.log(`Unique products by GTIN: ${uniqueProducts.size}`)

  const csvData = Array.from(uniqueProducts.entries()).map(([gtin, product]) => {
    const totalScore = computeBatchScore(product)
    return [
      product.brand,
      product.informations.length === 1 ? product.informations[0].categorySlug : BATCH_CATEGORY,
      gtin,
      product.internalReference,
      totalScore.score ?? "",
      totalScore.standardized ?? "",
      totalScore.durability ?? "",
      totalScore.acd ?? "",
      totalScore.cch ?? "",
      totalScore.etf ?? "",
      totalScore.fru ?? "",
      totalScore.fwe ?? "",
      totalScore.htc ?? "",
      totalScore.htn ?? "",
      totalScore.ior ?? "",
      totalScore.ldu ?? "",
      totalScore.mru ?? "",
      totalScore.ozd ?? "",
      totalScore.pco ?? "",
      totalScore.pma ?? "",
      totalScore.swe ?? "",
      totalScore.tre ?? "",
      totalScore.wtu ?? "",
      totalScore.microfibers ?? "",
      totalScore.outOfEuropeEOL ?? "",
      product.createdAt.toISOString(),
    ]
  })

  const csvContent = stringify(csvData, {
    header: true,
    columns: [
      "Marque",
      "Catégorie",
      "GTINs",
      "Référence interne",
      "Score",
      "Score standardisé",
      "Durabilité",
      "Acidification",
      "Changement climatique",
      "Écotoxicité de l'eau douce, corrigée",
      "Utilisation de ressources fossiles",
      "Eutrophisation eaux douces",
      "Toxicité humaine - cancer, corrigée",
      "Toxicité humaine - non-cancer, corrigée",
      "Radiations ionisantes",
      "Utilisation des sols",
      "Utilisation de ressources minérales et métalliques",
      "Appauvrissement de la couche d'ozone",
      "Formation d'ozone photochimique",
      "Particules",
      "Eutrophisation marine",
      "Eutrophisation terrestre",
      "Utilisation de ressources en eau",
      "Complément microfibres",
      "Complément export hors-Europe",
      "Date de création",
    ],
  })

  const exportDir = path.join(process.cwd(), "exports")
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
  const filePath = path.join(exportDir, `products-done-${timestamp}.csv`)

  fs.writeFileSync(filePath, csvContent, "utf-8")

  console.log(`✅ Export completed: ${filePath}`)
}

getDataGouvCSV()
