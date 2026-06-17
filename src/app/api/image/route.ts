import { NextRequest, NextResponse } from "next/server"
import { getSVG } from "../../../utils/label/simple"
import { getEtiquetteSVG } from "../../../utils/label/withComparison"
import { imageValidation } from "../../../services/validation/image"
import { getProductWithScore } from "../../../db/product"
import { productMapping } from "../../../utils/ecobalyse/mappings"
import { ProductCategory } from "../../../types/Product"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const validationResult = imageValidation.safeParse({
      type: searchParams.get("type"),
      score: searchParams.get("score"),
      masse: searchParams.get("masse"),
      gtin: searchParams.get("gtin"),
      internalreference: searchParams.get("internalreference"),
      modele: searchParams.get("modele") || "simple",
      categorie: searchParams.get("categorie"),
    })

    if (!validationResult.success) {
      return NextResponse.json(validationResult.error.issues, { status: 400 })
    }

    const validatedData = validationResult.data

    let productScore: number
    let productStandardized: number
    let productCategory: string | undefined | null = undefined

    switch (validatedData.type) {
      case "score": {
        productScore = validatedData.score
        productStandardized = validatedData.score / (validatedData.masse * 10)
        break
      }

      case "gtin": {
        const product = await getProductWithScore(validatedData.gtin)
        if (!product || product.score == null || product.standardized == null) {
          return NextResponse.json({ error: "Produit non trouvé ou sans score pour ce GTIN" }, { status: 404 })
        }
        productScore = product.score
        productStandardized = product.standardized
        if (validatedData.modele === "avecComparaison" || validatedData.modele === "avecComparaisonSimple") {
          if (product.informations.length > 1) {
            return NextResponse.json(
              { error: "Impossible de générer une étiquette avec comparaison pour ce produit" },
              { status: 400 },
            )
          }
          productCategory = productMapping[product.informations[0].categorySlug as ProductCategory]
        }
        break
      }
    }

    let svgContent: string
    if (validatedData.modele === "avecComparaison" || validatedData.modele === "avecComparaisonSimple") {
      if (process.env.ALLOW_COMPARISON !== "true") {
        return NextResponse.json(
          {
            error: "La génération d'étiquettes avec comparaison est uniquement disponible sur l'environnement de test",
          },
          { status: 403 },
        )
      }
      if (!productCategory) {
        productCategory = validatedData.categorie
        if (!productCategory) {
          return NextResponse.json(
            { error: "La catégorie est requise pour les modèles de comparaison avec un score." },
            { status: 400 },
          )
        }
      }

      svgContent = getEtiquetteSVG(
        productScore,
        productStandardized,
        productCategory,
        validatedData.modele === "avecComparaison",
      )
    } else {
      svgContent = getSVG(productScore, productStandardized)
    }

    return new NextResponse(svgContent, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=2592000",
      },
    })
  } catch (error) {
    console.error("Erreur lors de la génération du SVG:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
