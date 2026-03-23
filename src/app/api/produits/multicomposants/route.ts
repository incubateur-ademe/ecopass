import { handleProductPOST } from "../../../../utils/api/products"

export async function POST(req: Request) {
  if (process.env.NEXT_PUBLIC_TEST !== "true") {
    return new Response("Cette route n'est disponible que sur l'environnement de test.", { status: 404 })
  }

  return handleProductPOST(req, "multicomponents")
}
