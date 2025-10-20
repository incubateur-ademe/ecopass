import { handleProductPOST } from "../../../../utils/api/products"

export async function POST(req: Request) {
  return handleProductPOST(req, true)
}
