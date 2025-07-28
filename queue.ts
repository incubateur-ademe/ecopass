import { processExportsQueue } from "./src/utils/queue/exports"
import { processProductsQueue } from "./src/utils/queue/products"
import { processUploadsToQueue } from "./src/utils/queue/uploads"

const sleep = () => new Promise((resolve) => setTimeout(resolve, 2000))

const runQueue = async () => {
  while (true) {
    try {
      console.log("Processing queue...")
      await processUploadsToQueue()
      console.log("Uploads processed.")
      await processProductsQueue()
      console.log("Products processed.")
      await processExportsQueue()
      console.log("Exports processed.")
    } catch (error) {
      console.error("Error processing queue:", error)
    }
    await sleep()
  }
}

runQueue()
