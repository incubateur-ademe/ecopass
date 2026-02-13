import "dotenv/config"
import { prismaClient } from "../db/prismaClient"
import { decryptProductFields } from "../utils/encryption/encryption"
import { computeBatchScore } from "../utils/ecobalyse/batches"
import { getValue } from "../utils/parsing/parsing"
import { AccessoryType, Business, Country, Impression, MaterialType, ProductCategory } from "../types/Product"
import { businesses } from "../utils/types/business"
import { countries } from "../utils/types/country"
import { impressions } from "../utils/types/impression"
import { materials } from "../utils/types/material"
import { accessories } from "../utils/types/accessory"
import { productCategories } from "../utils/types/productCategory"

const getLatestProductIds = async () => {
  const result = await prismaClient.$queryRaw<Array<{ id: string }>>`
    SELECT DISTINCT ON (internal_reference) id
    FROM products
    WHERE status = 'Done'
    ORDER BY internal_reference, created_at DESC
  `
  return result.map((row) => row.id)
}

const main = async (batchSize: number) => {
  console.log("\n🚀 Démarrage du remplissage des tables Anonymized*...\n")

  const ids = await getLatestProductIds()
  console.log(`📦 ${ids.length} produits (dernière version par référence interne) à traiter`)

  console.log("🧹 Nettoyage des tables anonymisées...")
  await prismaClient.anonymizedAccessory.deleteMany()
  await prismaClient.anonymizedMaterial.deleteMany()
  await prismaClient.anonymizedProductInformation.deleteMany()
  await prismaClient.anonymizedProduct.deleteMany()

  let processed = 0
  let index = 0

  while (index < ids.length) {
    const products = await prismaClient.product.findMany({
      where: { id: { in: ids.slice(index, index + batchSize) } },
      include: {
        informations: {
          include: {
            materials: true,
            accessories: true,
            score: true,
          },
        },
      },
    })

    for (const product of products) {
      const batchScore = computeBatchScore(product)

      await prismaClient.anonymizedProduct.create({
        data: {
          score: product.score ? Math.round(product.score) : null,
          standardized: product.standardized ? Math.round(product.standardized) : null,
          durability: batchScore.durability ?? null,
          informations: {
            create: product.informations.map((information) => {
              const decrypted = decryptProductFields(information)
              return {
                category: getValue<ProductCategory>(productCategories, decrypted.category),
                emptyTrims: information.emptyTrims,
                business: getValue<Business>(businesses, decrypted.business),
                countryDyeing: getValue<Country>(countries, decrypted.countryDyeing),
                countryFabric: getValue<Country>(countries, decrypted.countryFabric),
                countryMaking: getValue<Country>(countries, decrypted.countryMaking),
                countrySpinning: getValue<Country>(countries, decrypted.countrySpinning),
                impression: getValue<Impression>(impressions, decrypted.impression),
                mass: decrypted.mass,
                price: decrypted.price,
                airTransportRatio: decrypted.airTransportRatio,
                numberOfReferences: decrypted.numberOfReferences,
                impressionPercentage: decrypted.impressionPercentage,
                fading: decrypted.fading,
                upcycled: decrypted.upcycled,
                materials: {
                  create: (decrypted.materials || []).map((material) => ({
                    slug: getValue<MaterialType>(materials, material.slug),
                    country: getValue<Country>(countries, material.country ?? null),
                    share: material.share,
                  })),
                },
                accessories: {
                  create: (decrypted.accessories || []).map((accessory) => ({
                    slug: getValue<AccessoryType>(accessories, accessory.slug),
                    quantity: accessory.quantity,
                  })),
                },
              }
            }),
          },
        },
      })

      processed += 1
      if (processed % 100 === 0) {
        console.log(`✅ ${processed} produits traités...`)
      }
    }

    index += batchSize
  }

  console.log(`\n✅ Terminé. ${processed} produits anonymisés.`)
}

const batchSizeArg = Number(process.argv[2])
const batchSize = Number.isFinite(batchSizeArg) && batchSizeArg > 0 ? batchSizeArg : 200

main(batchSize)
  .catch((error) => {
    console.error("❌ Erreur lors du remplissage des tables anonymisées:", error)
    process.exit(1)
  })
  .finally(() => prismaClient.$disconnect())
