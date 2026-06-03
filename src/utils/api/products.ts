import { NextResponse } from "next/server"
import { getApiUser } from "../../services/auth/auth"
import { computeBatchInformations, computeEcobalyseScore } from "../ecobalyse/api"
import { createScore } from "../../db/score"
import { updateAPIUse } from "../../db/user"
import {
  getUserMultiComponentProductAPIValidation,
  getUserProductAPIValidation,
  getUserProductsAPIValidation,
  ProductInformationAPI,
  ProductMetadataAPI,
} from "../../services/validation/api"
import { getAuthorizedBrands } from "../organization/brands"
import { scoreIsValid } from "../validation/score"
import { organizationTypesAllowedToDeclare } from "../organization/canDeclare"
import { organizationTypes } from "../organization/types"
import { checkOldProduct, ProductCheckResult } from "../../services/validation/oldProduct"
import { hashProduct } from "../encryption/hash"
import { getBrandById } from "../../db/brands"
import { getDefaultGTINs } from "../validation/gtin"
import { gtinsValidation } from "../../services/validation/gtins"

type ProductAndInformations = {
  product: ProductMetadataAPI & { gtins: string[] }
  informations: ProductInformationAPI[]
}

type GtinsResult = { success: true; data: string[] } | { success: false; error: { issues: unknown[] } }

const parseMultiComponentProduct = (
  body: Record<string, unknown>,
  brands: ReturnType<typeof getAuthorizedBrands>,
  brandId: string,
  gtins: GtinsResult,
) => {
  const productValidation = getUserMultiComponentProductAPIValidation(brands).safeParse({
    ...body,
    brandId,
  })

  if (!productValidation.success || !gtins.success) {
    return NextResponse.json(
      [
        ...(productValidation.success ? [] : productValidation.error.issues),
        ...(gtins.success ? [] : gtins.error.issues),
      ],
      { status: 400 },
    )
  }

  const mainComponentCountryMaking = productValidation.data.components.find((component) => component.mainComponent)
    ?.countryMaking as string

  return {
    product: {
      internalReference: productValidation.data.internalReference,
      declaredScore: productValidation.data.declaredScore,
      brandId: productValidation.data.brandId,
      gtins: gtins.data,
    },
    informations: productValidation.data.components.map((component) => ({
      ...component,
      countryMaking: component.countryMaking || mainComponentCountryMaking,
      product: productValidation.data.product,
      price: productValidation.data.price,
      numberOfReferences: productValidation.data.numberOfReferences,
      business: productValidation.data.business,
      mainComponent: component.mainComponent || false,
      trims: component.mainComponent ? productValidation.data.trims : [],
    })),
  }
}

const parseBatchProduct = (
  body: Record<string, unknown>,
  brands: ReturnType<typeof getAuthorizedBrands>,
  brandId: string,
  gtins: GtinsResult,
) => {
  const productValidation = getUserProductsAPIValidation(brands).safeParse({
    ...body,
    brandId,
  })

  if (!productValidation.success || !gtins.success) {
    return NextResponse.json(
      [
        ...(productValidation.success ? [] : productValidation.error.issues),
        ...(gtins.success ? [] : gtins.error.issues),
      ],
      { status: 400 },
    )
  }

  return {
    product: {
      internalReference: productValidation.data.internalReference,
      declaredScore: productValidation.data.declaredScore,
      brandId: productValidation.data.brandId,
      gtins: gtins.data,
    },
    informations: computeBatchInformations(
      productValidation.data.price,
      productValidation.data.numberOfReferences,
      productValidation.data.products,
    ),
  }
}

const parseSingleProduct = (
  body: Record<string, unknown>,
  brands: ReturnType<typeof getAuthorizedBrands>,
  brandId: string,
  gtins: GtinsResult,
) => {
  const productValidation = getUserProductAPIValidation(brands).safeParse({
    ...body,
    brandId,
  })

  if (!productValidation.success || !gtins.success) {
    return NextResponse.json(
      [
        ...(productValidation.success ? [] : productValidation.error.issues),
        ...(gtins.success ? [] : gtins.error.issues),
      ],
      { status: 400 },
    )
  }

  return {
    product: {
      internalReference: productValidation.data.internalReference,
      declaredScore: productValidation.data.declaredScore,
      brandId: productValidation.data.brandId,
      gtins: gtins.data,
    },
    informations: [productValidation.data],
  }
}

export async function handleProductPOST(req: Request, type: "single" | "batch" | "multicomponents") {
  try {
    const api = await getApiUser(req.headers)
    if (!api || !api.user || !api.user.organization) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!api.user.organization.type || !organizationTypesAllowedToDeclare.includes(api.user.organization.type)) {
      return NextResponse.json(
        {
          error:
            "Votre organisation n'est pas autorisée à déclarer des produits. Si vous pensez que c'est une erreur, veuillez contacter le support.",
          organizationType: api.user.organization.type ? organizationTypes[api.user.organization.type] : "Non défini",
        },
        { status: 403 },
      )
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

    const invalidBrandIdKey = Object.keys(body).find(
      (key) => key !== "brandId" && key.replace(/_/g, "").toLowerCase() === "brandid",
    )
    if (invalidBrandIdKey) {
      return NextResponse.json(
        `Attention, le champ '${invalidBrandIdKey}' n'est pas reconnu. Veuillez utiliser 'brandId'.`,
      )
    }

    const brandId = (body.brandId || api.user.organization.brands.find((b) => b.default)?.id || "").trim()
    const brand = await getBrandById(brandId)

    if (!brand) {
      return NextResponse.json(
        { error: "La marque spécifiée n'existe pas ou n'est pas autorisée pour votre organisation." },
        { status: 400 },
      )
    }

    if (brand.organization.noGTIN && body.gtins) {
      return NextResponse.json(
        { error: "Votre organisation n'utilise pas de GTIN, le champ 'gtins' ne doit pas être renseigné." },
        { status: 400 },
      )
    }

    const gtins = brand.organization.noGTIN
      ? {
          success: true,
          error: {
            issues: [],
          },
          data: getDefaultGTINs(brand.organization, body.internalReference),
        }
      : gtinsValidation.safeParse(body.gtins)

    let parseResult: NextResponse | ProductAndInformations
    switch (type) {
      case "batch":
        parseResult = parseBatchProduct(body, brands, brandId, gtins)
        break
      case "single":
        parseResult = parseSingleProduct(body, brands, brandId, gtins)
        break
      case "multicomponents":
        parseResult = parseMultiComponentProduct(body, brands, brandId, gtins)
        break
    }

    if (parseResult instanceof NextResponse) {
      return parseResult
    }

    const { product, informations } = parseResult

    const hash = hashProduct(product, informations, brands)
    const oldProductCheck = await checkOldProduct(product.gtins, hash)

    if (oldProductCheck.result === ProductCheckResult.Unchanged) {
      return NextResponse.json({ message: "Le produit existe déjà." }, { status: 208 })
    }

    if (oldProductCheck.result === ProductCheckResult.TooRecent) {
      return NextResponse.json(
        { message: "Un produit avec le même GTIN a été déclaré trop récemment." },
        { status: 400 },
      )
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
