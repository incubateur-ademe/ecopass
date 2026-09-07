import { handleProductPOST } from "../../../../utils/api/products"

export async function POST(req: Request) {
  console.log(`[POST] /api/produits/lot - Starting`)
  const result = await handleProductPOST(req, "batch")
  console.log(`[POST] /api/produits/lot - Completed`)
  return result
}
