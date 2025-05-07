import { getProductsToProcess } from "./src/db/product"
import { checkUploadsStatus } from "./src/db/upload"
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
        await saveEcobalyseResults(products)
        await checkUploadsStatus(products.map((product) => product.uploadId))
      }
    } catch (error) {
      console.error("Error processing queue:", error)
      await sleep()
    }
  }
}

runQueue()
