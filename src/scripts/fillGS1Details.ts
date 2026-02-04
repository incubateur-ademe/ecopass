import "dotenv/config"
import { prismaClient } from "../db/prismaClient"

interface GS1JsonData {
  itemOffered?: {
    pip?: string
    netContent?: Array<{
      quantity: number
      unitCode: string
    }>
    tradeItemImageUrl?: Array<{
      url: string
    }>
  }
}

const fillGS1Details = async () => {
  console.log("🔄 Remplissage des détails GS1...")

  try {
    let updated = 0
    let skipped = 0
    let batchNumber = 0
    const batchSize = 100

    let hasMore = true
    while (hasMore) {
      const gs1Records = await prismaClient.gS1.findMany({
        skip: batchNumber * batchSize,
        take: batchSize,
      })

      if (gs1Records.length === 0) {
        hasMore = false
        continue
      }

      console.log(`📊 Traitement du batch ${batchNumber + 1}...`)

      for (const record of gs1Records) {
        try {
          const jsonData = record.jsonData as GS1JsonData

          const website = jsonData.itemOffered?.pip || null
          const image = jsonData.itemOffered?.tradeItemImageUrl?.[0]?.url || null
          const weight = jsonData.itemOffered?.netContent?.find((item) => item.unitCode === "KGM")?.quantity || null

          const hasChanges = website || image || weight
          if (!hasChanges) {
            skipped++
            continue
          }

          await prismaClient.gS1.update({
            where: { id: record.id },
            data: {
              website: website,
              image: image,
              weight: weight,
            },
          })

          updated++
        } catch (error) {
          console.error(`❌ Erreur lors du traitement du GTIN ${record.gtin}:`, error)
        }
      }
      batchNumber++
    }

    console.log(`✅ Mise à jour terminée!`)
    console.log(`   - ${updated} enregistrements mis à jour`)
    console.log(`   - ${skipped} enregistrements inchangés`)

    process.exit(0)
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des détails GS1:", error)
    process.exit(1)
  }
}

fillGS1Details()
