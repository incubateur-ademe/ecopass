import { NextResponse } from "next/server"
import { getApiUser } from "../../../services/auth/auth"
import { productAPIValidation } from "../../../services/validation/api"
import { computeEcobalyseScore } from "../../../utils/ecobalyse/api"
import { createScore } from "../../../db/score"
import { updateAPIUse } from "../../../db/user"

export async function POST(req: Request) {
  try {
    const api = await getApiUser(req.headers)
    if (!api) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await updateAPIUse(api.key)

    const body = await req.json()
    const product = productAPIValidation.safeParse({ ...body, brand: body.brand || api.user.brand?.name || "" })
    if (!product.success) {
      return NextResponse.json(product.error.issues, { status: 400 })
    }

    const score = await computeEcobalyseScore(product.data)
    if (product.data.declaredScore && Math.round(score.score) !== product.data.declaredScore) {
      return NextResponse.json({ error: "Le score déclaré ne correspond pas au score calculé." }, { status: 400 })
    }
    await createScore(api.user, product.data, score.score)
    return NextResponse.json({ result: "success" }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error)
    return NextResponse.json({ error: "Erreur lors de la création du produit." }, { status: 500 })
  }
}
