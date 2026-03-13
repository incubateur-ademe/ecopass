import { getBrandsByIds } from "../../db/brands"
import { failProducts, getProductsToProcess } from "../../db/product"
import { checkUploadsStatus } from "../../db/upload"
import { gtinsValidation } from "../../services/validation/gtins"
import { getUserProductValidation } from "../../services/validation/product"
import { saveEcobalyseResults } from "../ecobalyse/api"
import { getAuthorizedBrands } from "../organization/brands"
import { getDefaultGTINs } from "../validation/gtin"

const batchSize = parseInt(process.env.BATCH_SIZE || "10", 10)

export const processProductsQueue = async () => {
  const products = await getProductsToProcess(batchSize)
  if (products.length === 0) {
    return
  }

  console.log(`Processing ${products.length} products...`)
  const brands = await getBrandsByIds(products.map((product) => product.brandId).filter((id) => id !== null))
  const brandsMap = new Map(brands.map((brand) => [brand.id, brand]))
  const validatedProducts = products.map((product) => {
    const organization = product.upload.createdBy.organization
    if (!organization) {
      return {
        id: product.id,
        product: {
          success: false as const,
          error: {
            issues: [{ message: "Organisation non trouvée" }],
          },
        },
        gtins: { success: true as const, data: [], error: undefined },
      }
    }
    const authorizedBrands = getAuthorizedBrands(organization)
    const userProductValidation = getUserProductValidation(authorizedBrands)
    const brand = product.brandId ? brandsMap.get(product.brandId) : null
    if (!brand) {
      return {
        id: product.id,
        product: {
          success: false as const,
          error: {
            issues: [
              {
                message: `Marque invalide. Voici la liste de vos marques : ${authorizedBrands.map((brand) => `"${brand}"`).join(", ")}`,
              },
            ],
          },
        },
        gtins: { success: true as const, data: [], error: undefined },
      }
    }

    return {
      product: userProductValidation.safeParse({ ...product, ...product.informations[0] }),
      gtins: brand.organization.noGTIN
        ? product.gtins.filter((gtin) => gtin).length > 0
          ? {
              success: false as const,
              error: {
                issues: [
                  {
                    message:
                      "Votre organisation n'utilise pas de GTIN, le champ 'GTINs/EANs' ne doit pas être renseigné",
                  },
                ],
              },
            }
          : { success: true as const, data: getDefaultGTINs(brand.organization, product.internalReference) }
        : gtinsValidation.safeParse(product.gtins),
      id: product.id,
    }
  })

  await Promise.all([
    saveEcobalyseResults(
      validatedProducts
        .map((result) => {
          if (result.product.success && result.gtins.success) {
            return {
              ...result.product.data,
              gtins: result.gtins.data,
            }
          }
          return null
        })
        .filter((result) => result !== null),
    ),
    failProducts(
      validatedProducts
        .filter((result) => !result.product.success || !result.gtins.success)
        .map((result) => ({
          productId: result.id,
          error: [...(result.product.error?.issues || []), ...(result.gtins.error?.issues || [])]
            .map((issue) => issue.message)
            .join(", "),
        })),
    ),
  ])
  await checkUploadsStatus(products.map((product) => product.uploadId))
}
