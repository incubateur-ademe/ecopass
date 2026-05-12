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

const formatDuration = (start: number) => `${((Date.now() - start) / 1000).toFixed(1)}s`

const main = async (batchSize: number, concurrency: number) => {
  const startedAt = Date.now()
  console.log("\n🚀 Démarrage du remplissage des tables Anonymized*...\n")

  const ids = await getLatestProductIds()
  console.log(`📦 ${ids.length} produits (dernière version par référence interne) à traiter`)

  console.log("🧹 Nettoyage des tables anonymisées...")
  await prismaClient.$executeRawUnsafe(`
    TRUNCATE TABLE
      anonymized_accessories,
      anonymized_materials,
      anonymized_product_informations,
      anonymized_products
  `)
  console.log("✅ Tables anonymisées nettoyées")

  let processed = 0
  let index = 0

  while (index < ids.length) {
    const batchStartedAt = Date.now()
    const idsBatch = ids.slice(index, index + batchSize)

    const products = await prismaClient.product.findMany({
      where: { id: { in: idsBatch } },
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

    for (let i = 0; i < products.length; i += concurrency) {
      const productsChunk = products.slice(i, i + concurrency)

      await Promise.all(
        productsChunk.map(async (product) => {
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
                    mainComponent: decrypted.mainComponent,
                  }
                }),
              },
            },
          })

          processed += 1
          if (processed % 100 === 0) {
            console.log(`✅ ${processed} produits traités...`)
          }
        }),
      )
    }

    console.log(
      `📚 Batch ${Math.floor(index / batchSize) + 1}: ${products.length} produits en ${formatDuration(batchStartedAt)}`,
    )
    index += batchSize
  }

  console.log(`\n✅ Terminé. ${processed} produits anonymisés en ${formatDuration(startedAt)}.`)
}

const batchSizeArg = Number(process.argv[2])
const batchSize = Number.isFinite(batchSizeArg) && batchSizeArg > 0 ? batchSizeArg : 1000
const concurrencyArg = Number(process.argv[3])
const concurrency = Number.isFinite(concurrencyArg) && concurrencyArg > 0 ? concurrencyArg : 10

main(batchSize, concurrency)
  .catch((error) => {
    console.error("❌ Erreur lors du remplissage des tables anonymisées:", error)
    process.exit(1)
  })
  .finally(() => prismaClient.$disconnect())
