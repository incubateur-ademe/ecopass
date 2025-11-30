import { NextResponse } from "next/server"
import { getApiUser } from "../../../services/auth/auth"
import { productsListValidation } from "../../../services/validation/api"
import { getOrganizationProductsByUserIdAndBrand } from "../../../db/product"
import { handleProductPOST } from "../../../utils/api/products"

export async function GET(req: Request) {
  const api = await getApiUser(req.headers)
  if (!api || !api.user || !api.user.organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)

  const validationResult = productsListValidation.safeParse({
    page: parseInt(searchParams.get("page") || "0", 10),
    size: parseInt(searchParams.get("size") || "10", 10),
    brand: searchParams.get("brand") || undefined,
  })

  if (!validationResult.success) {
    return NextResponse.json(validationResult.error.issues, { status: 400 })
  }

  const products = await getOrganizationProductsByUserIdAndBrand(
    api.user.id,
    validationResult.data.page,
    validationResult.data.size,
    validationResult.data.brand,
  )

  return NextResponse.json(products)
}

export async function POST(req: Request) {
  return handleProductPOST(req)
}
