import "dotenv/config"
import { processExportsQueue } from "./src/utils/queue/exports"
import { processProductsQueue } from "./src/utils/queue/products"
import { processUploadsToQueue } from "./src/utils/queue/uploads"

const sleep = () => new Promise((resolve) => setTimeout(resolve, 2000))

const runQueue = async () => {
  while (true) {
    try {
      await processUploadsToQueue()
      await processProductsQueue()
      await processExportsQueue()
    } catch (error) {
      console.log("Error processing queue:", error)
    }
    await sleep()
  }
}

runQueue()
