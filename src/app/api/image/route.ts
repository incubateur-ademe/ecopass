import { NextRequest, NextResponse } from "next/server"
import { getSVG } from "../../../utils/label/svg"
import { imageValidation } from "../../../services/validation/image"
import { getProductWithScore } from "../../../db/product"

export async function GET(request: NextRequest) {
  try {
    console.log("[MEMORY][image/GET][start]", process.memoryUsage())
    const { searchParams } = new URL(request.url)

    const validationResult = imageValidation.safeParse({
      type: searchParams.get("type"),
      score: searchParams.get("score"),
      masse: searchParams.get("masse"),
      gtin: searchParams.get("gtin"),
      internalreference: searchParams.get("internalreference"),
    })

    if (!validationResult.success) {
      return NextResponse.json(validationResult.error.issues, { status: 400 })
    }

    const validatedData = validationResult.data

    let productScore: number
    let productStandardized: number

    switch (validatedData.type) {
      case "score": {
        productScore = validatedData.score
        productStandardized = validatedData.score / (validatedData.masse * 10)
        break
      }

      case "gtin": {
        const product = await getProductWithScore(validatedData.gtin)
        if (!product || !product.score || !product.standardized) {
          return NextResponse.json({ error: "Produit non trouvé ou sans score pour ce GTIN" }, { status: 404 })
        }
        productScore = product.score
        productStandardized = product.standardized
        break
      }
    }

    const svgContent = getSVG(productScore, productStandardized)
    const result = new NextResponse(svgContent, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=2592000",
      },
    })
    console.log("[MEMORY][image/GET][end]", process.memoryUsage())
    return result
  } catch (error) {
    console.error("Erreur lors de la génération du SVG:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
