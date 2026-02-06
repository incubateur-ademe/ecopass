import "dotenv/config"
import { prismaClient } from "../db/prismaClient"
import { decryptProductFields } from "../utils/encryption/encryption"
import { computeBatchScore } from "../utils/ecobalyse/batches"

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
                category: decrypted.category ?? information.category,
                emptyTrims: information.emptyTrims,
                business: decrypted.business,
                countryDyeing: decrypted.countryDyeing,
                countryFabric: decrypted.countryFabric,
                countryMaking: decrypted.countryMaking,
                countrySpinning: decrypted.countrySpinning,
                impression: decrypted.impression,
                mass: decrypted.mass,
                price: decrypted.price,
                airTransportRatio: decrypted.airTransportRatio,
                numberOfReferences: decrypted.numberOfReferences,
                impressionPercentage: decrypted.impressionPercentage,
                fading: decrypted.fading,
                upcycled: decrypted.upcycled,
                materials: {
                  create: (decrypted.materials || []).map((material) => ({
                    slug: material.slug,
                    country: material.country ?? null,
                    share: material.share,
                  })),
                },
                accessories: {
                  create: (decrypted.accessories || []).map((accessory) => ({
                    slug: accessory.slug,
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
