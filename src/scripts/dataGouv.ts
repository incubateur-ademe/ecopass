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
      informations: { select: { categorySlug: true, score: true } },
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
      product.brand?.name ?? "",
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
      totalScore.trims ?? "",
      totalScore.materials ?? "",
      totalScore.spinning ?? "",
      totalScore.fabric ?? "",
      totalScore.dyeing ?? "",
      totalScore.making ?? "",
      totalScore.transport ?? "",
      totalScore.usage ?? "",
      totalScore.endOfLife ?? "",
      product.createdAt.toISOString(),
    ]
  })

  const csvContent = stringify(csvData, {
    header: true,
    columns: [
      "Marque",
      "Catégorie",
      "GTIN",
      "Référence interne",
      "Score",
      "Score standardisé",
      "Durabilité",
      "Impact - Acidification",
      "Impact - Changement climatique",
      "Impact - Écotoxicité de l'eau douce, corrigée",
      "Impact - Utilisation de ressources fossiles",
      "Impact - Eutrophisation eaux douces",
      "Impact - Radiations ionisantes",
      "Impact - Utilisation des sols",
      "Impact - Utilisation de ressources minérales et métalliques",
      "Impact - Appauvrissement de la couche d'ozone",
      "Impact - Formation d'ozone photochimique",
      "Impact - Particules",
      "Impact - Eutrophisation marine",
      "Impact - Eutrophisation terrestre",
      "Impact - Utilisation de ressources en eau",
      "Impact - Complément microfibres",
      "Impact - Complément export hors-Europe",
      "Cycle de vie - Accessoires",
      "Cycle de vie - Matières premières",
      "Cycle de vie - Filature",
      "Cycle de vie - Tissage & Tricotage",
      "Cycle de vie - Ennoblissement",
      "Cycle de vie - Confection",
      "Cycle de vie - Transport",
      "Cycle de vie - Utilisation",
      "Cycle de vie - Fin de vie",
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
