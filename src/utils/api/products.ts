import { NextResponse } from "next/server"
import { getApiUser } from "../../services/auth/auth"
import { computeBatchInformations, computeEcobalyseScore } from "../ecobalyse/api"
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
import { organizationTypesAllowedToDeclare } from "../organization/canDeclare"

export async function handleProductPOST(req: Request, batch?: boolean) {
  try {
    const api = await getApiUser(req.headers)
    if (
      !api ||
      !api.user ||
      !api.user.organization ||
      !api.user.organization.type ||
      !organizationTypesAllowedToDeclare.includes(api.user.organization.type)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await updateAPIUse(api.key)

    const brands = getAuthorizedBrands(api.user.organization)
    const body = await req.json()

    if (body.test) {
      return NextResponse.json(
        "Il n'est plus possible de faire des tests via l'API. Veuillez vous diriger vers le site de test https://test-affichage-environnemental.ecobalyse.beta.gouv.fr/",
      )
    }

    if (body.brand) {
      return NextResponse.json(
        "Attention, le champ 'brand' a été remplacé par 'brandId'. Veuillez mettre à jour votre requête.",
      )
    }

    let product: ProductMetadataAPI
    let informations: ProductInformationAPI[]

    if (batch) {
      const productValidation = getUserProductsAPIValidation(brands).safeParse({
        ...body,
        brandId: (body.brandId || api.user.organization.brands.find((b) => b.default)?.id || "").trim(),
      })

      if (!productValidation.success) {
        return NextResponse.json(productValidation.error.issues, { status: 400 })
      }
      product = {
        gtins: productValidation.data.gtins,
        internalReference: productValidation.data.internalReference,
        declaredScore: productValidation.data.declaredScore,
        brandId: productValidation.data.brandId,
      }
      informations = computeBatchInformations(
        productValidation.data.price,
        productValidation.data.numberOfReferences,
        productValidation.data.products,
      )
    } else {
      const productValidation = getUserProductAPIValidation(brands).safeParse({
        ...body,
        brandId: (body.brandId || api.user.organization.brands.find((b) => b.default)?.id || "").trim(),
      })

      if (!productValidation.success) {
        return NextResponse.json(productValidation.error.issues, { status: 400 })
      }

      product = {
        gtins: productValidation.data.gtins,
        internalReference: productValidation.data.internalReference,
        declaredScore: productValidation.data.declaredScore,
        brandId: productValidation.data.brandId,
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
