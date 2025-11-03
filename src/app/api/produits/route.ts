import { NextResponse } from "next/server"
import { getApiUser } from "../../../services/auth/auth"
import { computeEcobalyseScore } from "../../../utils/ecobalyse/api"
import { createScore } from "../../../db/score"
import { updateAPIUse } from "../../../db/user"
import { getUserProductAPIValidation, productsListValidation } from "../../../services/validation/api"
import { getLastProductByGtin, getOrganizationProductsByUserIdAndBrand } from "../../../db/product"
import { hashProduct } from "../../../utils/encryption/hash"
import { getAuthorizedBrands } from "../../../utils/organization/brands"
import { scoreIsValid } from "../../../utils/validation/score"

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
  try {
    const api = await getApiUser(req.headers)
    if (!api || !api.user || !api.user.organization) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await updateAPIUse(api.key)

    const body = await req.json()
    const brands = getAuthorizedBrands(api.user.organization)
    const product = getUserProductAPIValidation(brands).safeParse({
      ...body,
      brand: (body.brand || api.user.organization.name || "").trim(),
    })

    if (!product.success) {
      return NextResponse.json(product.error.issues, { status: 400 })
    }
    const lastProduct = await getLastProductByGtin(product.data.gtins[0])
    const hash = hashProduct(product.data, brands)

    if (body.test) {
      return NextResponse.json(
        "Il n'est plus possible de faire des tests via l'API. Veuillez vous dirigez vers le site de test https://test-affichage-environnemental.ecobalyse.beta.gouv.fr",
      )
    }

    if (lastProduct && lastProduct.hash === hash) {
      return NextResponse.json({ message: "Le produit existe déjà." }, { status: 208 })
    }

    const score = await computeEcobalyseScore(product.data)
    if (product.data.declaredScore && !scoreIsValid(product.data.declaredScore, score.score)) {
      return NextResponse.json(
        [
          {
            code: "invalid_value",
            path: ["declaredScore"],
            message: `Le score déclaré (${product.data.declaredScore}) ne correspond pas au score calculé (${score.score})`,
          },
        ],
        { status: 400 },
      )
    }

    await createScore(api.user, product.data, { ...score, standardized: (score.score / product.data.mass) * 0.1 }, hash)
    return NextResponse.json({ result: "success" }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error)
    return NextResponse.json({ error: "Erreur lors de la création du produit." }, { status: 500 })
  }
}
