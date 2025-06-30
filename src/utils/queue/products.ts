import { failProducts, getProductsToProcess } from "../../db/product"
import { checkUploadsStatus } from "../../db/upload"
import { getUserProductValidation } from "../../services/validation/product"
import { saveEcobalyseResults } from "../ecobalyse/api"
import { sleep } from "./sleep"

const batchSize = parseInt(process.env.BATCH_SIZE || "10", 10)

export const processProductsQueue = async () => {
  const products = await getProductsToProcess(batchSize)
  if (products.length === 0) {
    await sleep()
  } else {
    console.log(`Processing ${products.length} products...`)
    const validatedProducts = products.map((product) => {
      const userProductValidation = getUserProductValidation([
        product.upload.createdBy.organization.name,
        ...product.upload.createdBy.organization.brands.map(({ name }) => name),
      ])
      return {
        id: product.id,
        ...userProductValidation.safeParse(product),
      }
    })

    await Promise.all([
      saveEcobalyseResults(validatedProducts.filter((result) => result.success).map((result) => result.data)),
      failProducts(
        validatedProducts
          .filter((result) => !result.success)
          .map((result) => ({
            id: result.id,
            error: result.error.issues.map((issue) => issue.message).join(", "),
          })),
      ),
    ])
    await checkUploadsStatus(products.map((product) => product.uploadId))
  }
}
