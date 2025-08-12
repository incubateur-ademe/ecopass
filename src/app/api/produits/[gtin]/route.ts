import { NextRequest, NextResponse } from "next/server"
import { getProductWithScore } from "../../../../db/product"

export async function GET(request: NextRequest, { params }: { params: Promise<{ gtin: string }> }) {
  const { gtin } = await params
  const product = await getProductWithScore(gtin)

  if (!product) {
    return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
  }

  return NextResponse.json(product)
}
