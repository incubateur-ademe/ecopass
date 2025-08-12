import { NextResponse } from "next/server"
import { getApiUser } from "../../../services/auth/auth"
import { computeEcobalyseScore } from "../../../utils/ecobalyse/api"
import { createScore } from "../../../db/score"
import { updateAPIUse } from "../../../db/user"
import { getUserProductAPIValidation } from "../../../services/validation/api"
import { getLastProductByGtin } from "../../../db/product"
import { hashProduct } from "../../../utils/encryption/hash"

export async function POST(req: Request) {
  try {
    const api = await getApiUser(req.headers)
    if (!api || !api.user || !api.user.organization) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await updateAPIUse(api.key)

    const body = await req.json()
    const product = getUserProductAPIValidation([
      api.user.organization.name,
      ...api.user.organization.brands.map(({ name }) => name),
      ...api.user.organization.authorizedBy.map((authorization) => authorization.from.name),
      ...api.user.organization.authorizedBy.flatMap((authorization) =>
        authorization.from.brands.map(({ name }) => name),
      ),
    ]).safeParse({ ...body, brand: body.brand || api.user.organization.name || "" })

    if (!product.success) {
      return NextResponse.json(product.error.issues, { status: 400 })
    }
    const lastProduct = await getLastProductByGtin(product.data.gtins[0])
    const hash = hashProduct(product.data)

    if (lastProduct && lastProduct.hash === hash) {
      return NextResponse.json({ error: "Le produit existe déjà." }, { status: 208 })
    }

    const score = await computeEcobalyseScore(product.data)
    if (product.data.declaredScore && Math.round(score.score) !== product.data.declaredScore) {
      return NextResponse.json({ error: "Le score déclaré ne correspond pas au score calculé." }, { status: 400 })
    }
    await createScore(api.user, product.data, { ...score, standardized: (score.score / product.data.mass) * 0.1 }, hash)
    return NextResponse.json({ result: "success" }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error)
    return NextResponse.json({ error: "Erreur lors de la création du produit." }, { status: 500 })
  }
}
