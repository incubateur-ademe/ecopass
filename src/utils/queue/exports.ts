import { completeExport, getFirstExport } from "../../db/export"
import { getProductsByUserIdBefore, ProductWithScore } from "../../db/product"
import JSZip from "jszip"
import { getSVG } from "../label/svg"
import { uploadFileToS3 } from "../s3/bucket"

const renderLabelSVG = (product: ProductWithScore) => {
  if (!product.score) {
    return null
  }
  return getSVG(product.score.score, product.score.standardized)
}

export const processExportsQueue = async () => {
  const exportToProcess = await getFirstExport()
  if (!exportToProcess) {
    return
  }

  console.log(`Processing export ${exportToProcess.name}`)
  const products = await getProductsByUserIdBefore(exportToProcess.userId, exportToProcess.createdAt)
  if (!products.length) return

  const zip = new JSZip()

  for (const product of products) {
    const svgContent = renderLabelSVG(product)
    if (!svgContent) {
      continue
    }

    zip.file(`${product.gtin}.svg`, svgContent)
  }

  const zipContent = await zip.generateAsync({ type: "nodebuffer" })
  await uploadFileToS3(`exports/${exportToProcess.name}.zip`, zipContent, "export")

  await completeExport(exportToProcess.id)
  console.log(`${products.length} products processed and export completed`)
}
