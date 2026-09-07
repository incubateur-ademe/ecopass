import { NextRequest, NextResponse } from "next/server"
import { getProductWithScore } from "../../../../db/product"

export async function GET(request: NextRequest, { params }: { params: Promise<{ gtin: string }> }) {
  const { gtin } = await params
  console.log(`[GET] /api/produits/${gtin} - Starting`)
  const product = await getProductWithScore(gtin)

  if (!product) {
    console.error(`[GET] /api/produits/${gtin} - Product not found`)
    return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
  }

  console.log(`[GET] /api/produits/${gtin} - Completed`)
  return NextResponse.json(product)
}
