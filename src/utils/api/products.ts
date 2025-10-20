import { NextResponse } from "next/server"
import { getApiUser } from "../../services/auth/auth"
import { computeEcobalyseScore } from "../ecobalyse/api"
import { createScore } from "../../db/score"
import { updateAPIUse } from "../../db/user"
import {
  getUserProductAPIValidation,
  getUserProductsAPIValidation,
  ProductInformationAPI,
  ProductMetadataAPI,
} from "../../services/validation/api"
import { getLastProductByGtin } from "../../db/product"
import { hashProductAPI } from "../encryption/hash"
import { getAuthorizedBrands } from "../organization/brands"
import { scoreIsValid } from "../validation/score"

export async function handleProductPOST(req: Request, batch?: boolean) {
  try {
    const api = await getApiUser(req.headers)
    if (!api || !api.user || !api.user.organization) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await updateAPIUse(api.key)

    const brands = getAuthorizedBrands(api.user.organization)
    const body = await req.json()

    if (body.test) {
      return NextResponse.json(
        "Il n'est plus possible de faire des tests via l'API. Veuillez vous dirigez vers le site de test https://test.ecopass.app",
      )
    }

    let product: ProductMetadataAPI
    let informations: ProductInformationAPI[]

    if (batch) {
      const productValidation = getUserProductsAPIValidation(brands).safeParse({
        ...body,
        brand: (body.brand || api.user.organization.name || "").trim(),
      })

      if (!productValidation.success) {
        return NextResponse.json(productValidation.error.issues, { status: 400 })
      }
      product = {
        gtins: productValidation.data.gtins,
        internalReference: productValidation.data.internalReference,
        declaredScore: productValidation.data.declaredScore,
        brand: productValidation.data.brand,
      }
      informations = productValidation.data.products
    } else {
      const productValidation = getUserProductAPIValidation(brands).safeParse({
        ...body,
        brand: (body.brand || api.user.organization.name || "").trim(),
      })

      if (!productValidation.success) {
        return NextResponse.json(productValidation.error.issues, { status: 400 })
      }

      product = {
        gtins: productValidation.data.gtins,
        internalReference: productValidation.data.internalReference,
        declaredScore: productValidation.data.declaredScore,
        brand: productValidation.data.brand,
      }
      informations = [productValidation.data]
    }

    const lastProduct = await getLastProductByGtin(product.gtins[0])
    const hash = hashProductAPI(product, informations, brands)

    if (lastProduct && lastProduct.hash === hash) {
      return NextResponse.json({ message: "Le produit existe déjà." }, { status: 208 })
    }

    const scores = await Promise.all(informations.map((information) => computeEcobalyseScore(information)))

    const totalScore = scores.reduce((acc, score) => acc + score.score, 0)

    if (product.declaredScore && !scoreIsValid(product.declaredScore, totalScore)) {
      return NextResponse.json(
        [
          {
            code: "invalid_value",
            path: ["declaredScore"],
            message: `Le score déclaré (${product.declaredScore}) ne correspond pas au score calculé (${totalScore})`,
          },
        ],
        { status: 400 },
      )
    }

    await createScore(api.user, product, informations, scores, hash)
    return NextResponse.json({ result: "success" }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error)
    return NextResponse.json({ error: "Erreur lors de la création du produit." }, { status: 500 })
  }
}
