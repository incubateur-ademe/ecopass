import "dotenv/config"
import axios from "axios"
import { prismaClient } from "../db/prismaClient"

const username = process.env.GS1_USERNAME
const password = process.env.GS1_PASSWORD
const subscriptionKey = process.env.GS1_SUBSCRIPTION_KEY

if (!username || !password || !subscriptionKey) {
  throw new Error("GS1_USERNAME, GS1_PASSWORD et GS1_SUBSCRIPTION_KEY sont requis dans les variables d'environnement")
}

const getGS1Token = async (): Promise<string> => {
  console.log("🔑 Récupération du token GS1...")

  try {
    const response = await axios.post<{ access_token: string }>(
      "https://api.gs1.fr/auth/connect/token",
      new URLSearchParams({
        scope: "Products.Read",
        grant_type: "client_credentials",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username,
          password,
        },
      },
    )

    console.log("✅ Token récupéré avec succès")
    return response.data.access_token
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Erreur lors de la récupération du token: ${error.response?.status} ${error.message}`)
    }
    throw error
  }
}

const getGS1ProductInfo = async (gtin: string, token: string) => {
  try {
    const result = await axios.get<{
      itemOffered: {
        brand: {
          brandName: {
            value: string
            lang: string
          }[]
        }
        brandOwner: {
          companyName: string
        }
        gpcDescription?: string
        additionalPartyIdentificationValue?: string
        pip?: string
        netContent?: Array<{
          quantity: number
          unitCode: string
        }>
        tradeItemImageUrl?: Array<{
          url: string
        }>
      }
    }>(`https://api.gs1.fr/products/${gtin}?api-version=v2`, {
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    return result.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.warn(`⚠️  GTIN ${gtin} non trouvé sur GS1`)
        return null
      }
      console.error(`❌ Erreur lors de la récupération du produit ${gtin}: ${error.response?.status} ${error.message}`)
    } else {
      console.error(`❌ Erreur lors de la récupération du produit ${gtin}:`, error)
    }
  }
}

const getRandomGTINs = async (limit: number): Promise<string[]> => {
  console.log(`📦 Récupération de ${limit} GTINs aléatoires...`)

  const result = await prismaClient.$queryRaw<Array<{ gtin: string }>>`
    WITH all_gtins AS (
      SELECT DISTINCT unnest(gtins) as gtin
      FROM products
      WHERE status = 'Done'
    )
    SELECT gtin
    FROM all_gtins
    WHERE gtin NOT IN (SELECT gtin FROM gs1)
    ORDER BY RANDOM()
    LIMIT ${limit}
  `

  if (result.length === 0) {
    console.warn("⚠️  Aucun GTIN nouveau à traiter (tous sont déjà dans GS1)")
    return []
  }

  console.log(`📊 ${result.length} GTINs nouveaux sélectionnés`)
  return result.map((r) => r.gtin)
}

const main = async (limit: number) => {
  console.log(`\n🚀 Démarrage du script getGS1Informations (limite: ${limit})...\n`)
  try {
    const token = await getGS1Token()
    const gtins = await getRandomGTINs(limit)

    if (gtins.length === 0) {
      console.log("\n✅ Aucun GTIN à traiter")
      return
    }

    console.log(`\n🔄 Traitement de ${gtins.length} GTINs...\n`)

    let successCount = 0
    let errorCount = 0
    let skippedCount = 0

    for (let i = 0; i < gtins.length; i++) {
      const gtin = gtins[i]
      console.log(`[${i + 1}/${gtins.length}] Traitement du GTIN: ${gtin}`)

      const productInfo = await getGS1ProductInfo(gtin, token)

      try {
        if (!productInfo) {
          await prismaClient.gS1.create({
            data: {
              gtin,
              jsonData: {},
              siren: null,
              category: null,
            },
          })
          console.log(`  ✅ GTIN ${gtin} créé avec données vides`)
          successCount++
          continue
        }

        await prismaClient.gS1.create({
          data: {
            gtin,
            jsonData: productInfo,
            siren: productInfo.itemOffered.additionalPartyIdentificationValue,
            category: productInfo.itemOffered.gpcDescription,
            brandName:
              productInfo.itemOffered.brand?.brandName.find((brand) => brand.lang === "fr")?.value ||
              productInfo.itemOffered.brandOwner.companyName,
            website: productInfo.itemOffered.pip,
            image: productInfo.itemOffered.tradeItemImageUrl?.[0]?.url,
            weight: productInfo.itemOffered.netContent?.find((item) => item.unitCode === "KGM")?.quantity,
          },
        })
        console.log(`  ✅ GTIN ${gtin} créé avec succès`)
        successCount++
      } catch (error) {
        if (error instanceof Error && error.message.includes("Unique constraint failed")) {
          console.log(`  ℹ️  GTIN ${gtin} déjà présent en base de données`)
          skippedCount++
        } else {
          console.error(`  ❌ Erreur lors de la création du GTIN ${gtin}:`, error)
          errorCount++
        }
      }
    }

    console.log(`\n📊 Résumé:`)
    console.log(`  ✅ Créés: ${successCount}`)
    console.log(`  ⚠️  Ignorés: ${skippedCount}`)
    console.log(`  ❌ Erreurs: ${errorCount}`)
    console.log(`  📈 Total traité: ${successCount + skippedCount + errorCount}/${gtins.length}\n`)
  } catch (error) {
    console.error("❌ Erreur fatale:", error)
    process.exit(1)
  } finally {
    await prismaClient.$disconnect()
  }
}

const limit = parseInt(process.argv[2] || "10", 10)

if (isNaN(limit) || limit <= 0) {
  throw new Error(
    "Argument invalide: le nombre de GTINs doit être un nombre positif\nUsage: tsx src/scripts/getGS1Informations.ts <nombre_de_gtins>",
  )
}
main(limit)
