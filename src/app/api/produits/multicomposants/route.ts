import { handleProductPOST } from "../../../../utils/api/products"

export async function POST(req: Request) {
  console.log(`[POST] /api/produits/multicomposants - Starting`)
  const result = await handleProductPOST(req, "multicomponents")
  console.log(`[POST] /api/produits/multicomposants - Completed`)
  return result
}
