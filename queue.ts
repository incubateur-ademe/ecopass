import { failProducts, getProductsToProcess } from "./src/db/product"
import { checkUploadsStatus } from "./src/db/upload"
import { productValidation } from "./src/services/validation/product"
import { saveEcobalyseResults } from "./src/utils/ecobalyse/api"

const sleep = () => new Promise((resolve) => setTimeout(resolve, 2000))

const runQueue = async () => {
  while (true) {
    try {
      const products = await getProductsToProcess()
      if (products.length === 0) {
        await sleep()
      } else {
        console.log(`Processing ${products.length} products...`)
        const validatedProducts = products.map((product) => ({
          id: product.id,
          ...productValidation.safeParse(product),
        }))
        await Promise.all([
          saveEcobalyseResults(validatedProducts.filter((result) => result.success).map((result) => result.data)),
          failProducts(validatedProducts.filter((result) => !result.success).map((result) => result.id)),
        ])
        await checkUploadsStatus(products.map((product) => product.uploadId))
      }
    } catch (error) {
      console.error("Error processing queue:", error)
      await sleep()
    }
  }
}

runQueue()
