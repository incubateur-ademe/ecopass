import { prismaClient } from "../db/prismaClient"
import { ProductCategory } from "../types/Product"
import { decryptProductFields } from "../utils/encryption/encryption"
import { hashParsedProduct } from "../utils/encryption/hash"
import { getAuthorizedBrands } from "../utils/organization/brands"

const recalculateHashes = async () => {
  console.log("🔍 Récupération de tous les produits...")

  const products = await prismaClient.product.findMany({
    where: {
      status: "Done",
    },
    include: {
      informations: {
        include: {
          materials: true,
          accessories: true,
        },
      },
      upload: {
        include: {
          createdBy: {
            include: {
              organization: {
                include: {
                  brands: true,
                  authorizedBy: {
                    include: {
                      from: {
                        include: {
                          brands: true,
                        },
                      },
                    },
                    where: {
                      active: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  console.log(`📊 ${products.length} produits trouvés`)

  let updatedCount = 0
  let errorCount = 0

  for (const product of products) {
    try {
      if (!product.upload.createdBy.organization) {
        console.log(`⚠️  Produit ${product.id} sans organisation, ignoré`)
        continue
      }

      const brands = getAuthorizedBrands(product.upload.createdBy.organization)

      const decryptedInformations = product.informations.map((info) => decryptProductFields(info))

      if (decryptedInformations.length === 0) {
        console.log(`⚠️  Produit ${product.id} sans informations, ignoré`)
        continue
      }

      const productMetadata = {
        gtins: product.gtins,
        internalReference: product.internalReference,
        declaredScore: product.declaredScore || undefined,
        brandId: product.brandId || "",
      }
      const information = decryptedInformations[0]
      const newHash = hashParsedProduct(
        productMetadata,
        {
          airTransportRatio: information.airTransportRatio,
          business: information.business,
          fading: information.fading,
          mass: information.mass,
          numberOfReferences: information.numberOfReferences,
          price: information.price,
          countryDyeing: information.countryDyeing,
          countryFabric: information.countryFabric,
          countryMaking: information.countryMaking,
          countrySpinning: information.countrySpinning,
          upcycled: information.upcycled,
          materials: information.materials.map((material) => ({
            id: material.slug,
            share: material.share,
            country: material.country,
          })),
          product: information.category as ProductCategory,
          trims: information.accessories?.map((accessory) => ({
            id: accessory.slug,
            quantity: accessory.quantity,
          })),
          printing: information.impression
            ? { kind: information.impression, ratio: information.impressionPercentage }
            : undefined,
        },
        brands,
      )

      // Mettre à jour le hash si différent
      if (product.hash !== newHash) {
        await prismaClient.product.update({
          where: { id: product.id },
          data: { hash: newHash },
        })

        console.log(`✅ Produit ${product.internalReference} (${product.id}) - Hash mis à jour`)
        console.log(`   Ancien: ${product.hash}`)
        console.log(`   Nouveau: ${newHash}`)
        updatedCount++
      } else {
        console.log(`✔️  Produit ${product.internalReference} (${product.id}) - Hash inchangé`)
      }
    } catch (error) {
      console.error(`❌ Erreur pour le produit ${product.id}:`, error)
      errorCount++
    }
  }

  console.log("\n📈 Résumé:")
  console.log(`   Produits traités: ${products.length}`)
  console.log(`   Hashs mis à jour: ${updatedCount}`)
  console.log(`   Erreurs: ${errorCount}`)
  console.log(`   Inchangés: ${products.length - updatedCount - errorCount}`)
}

recalculateHashes()
