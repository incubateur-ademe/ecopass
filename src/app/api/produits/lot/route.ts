import { NextResponse } from "next/server"
import { handleProductPOST } from "../../../../utils/api/products"
import { isTestEnvironment } from "../../../../utils/test"

export async function POST(req: Request) {
  if (!isTestEnvironment()) {
    return NextResponse.json(
      "Cette route est uniquement disponible en environnement de test: https://test-affichage-environnemental.ecobalyse.beta.gouv.fr/.",
      { status: 404 },
    )
  }

  return handleProductPOST(req, true)
}
