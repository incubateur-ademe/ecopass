import { processExportsQueue } from "./src/utils/queue/exports"
import { processProductsQueue } from "./src/utils/queue/products"
import { sleep } from "./src/utils/queue/sleep"

const runQueue = async () => {
  while (true) {
    try {
      await processProductsQueue()
      await processExportsQueue()
    } catch (error) {
      console.error("Error processing queue:", error)
      await sleep()
    }
  }
}

runQueue()
