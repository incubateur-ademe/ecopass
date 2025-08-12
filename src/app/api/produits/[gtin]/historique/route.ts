import { NextRequest, NextResponse } from "next/server"
import { getProductWithScoreHistory } from "../../../../../db/product"
import { paginationValidation } from "../../../../../services/validation/api"

export async function GET(request: NextRequest, { params }: { params: Promise<{ gtin: string }> }) {
  const { gtin } = await params
  const { searchParams } = new URL(request.url)

  const validationResult = paginationValidation.safeParse({
    page: parseInt(searchParams.get("page") || "0", 10),
    size: parseInt(searchParams.get("size") || "10", 10),
  })

  if (!validationResult.success) {
    return NextResponse.json(validationResult.error.issues, { status: 400 })
  }

  const products = await getProductWithScoreHistory(gtin, validationResult.data.page, validationResult.data.size)
  return NextResponse.json(products)
}
