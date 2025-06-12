import { completeExport, getFirstExport } from "../../db/export"
import { getProductsByUserIdBefore, ProductWithScore } from "../../db/product"
import JSZip from "jszip"
import fs from "fs/promises"
import path from "path"
import { getSVG } from "../label/svg"

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
  const exportName = exportToProcess.name || `export_${exportToProcess.id}`
  const exportDir = path.join(process.cwd(), "exports")
  await fs.mkdir(exportDir, { recursive: true })
  const zipPath = path.join(exportDir, `${exportName}.zip`)
  await fs.writeFile(zipPath, zipContent)

  await completeExport(exportToProcess.id)
  console.log(`${products.length} products processed and export completed`)
}
