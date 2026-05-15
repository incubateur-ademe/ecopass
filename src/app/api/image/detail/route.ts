import { NextRequest, NextResponse } from "next/server"
import { getDetailedSVG } from "../../../../utils/label/detailedSvg"
import { imageDetailValidation } from "../../../../services/validation/image"
import { getProductWithScore } from "../../../../db/product"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const validationResult = imageDetailValidation.safeParse({
      type: searchParams.get("type"),
      score: searchParams.get("score"),
      masse: searchParams.get("masse"),
      gtin: searchParams.get("gtin"),
      moyenne: searchParams.get("moyenne"),
      min: searchParams.get("min"),
      max: searchParams.get("max"),
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
          return NextResponse.json({ error: "Produit non trouve ou sans score pour ce GTIN" }, { status: 404 })
        }
        productScore = product.score
        productStandardized = product.standardized
        break
      }
    }

    const svgContent = getDetailedSVG(
      productScore,
      productStandardized,
      validatedData.moyenne,
      validatedData.min,
      validatedData.max,
    )

    return new NextResponse(svgContent, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=2592000",
      },
    })
  } catch (error) {
    console.error("Erreur lors de la generation du SVG detail:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
