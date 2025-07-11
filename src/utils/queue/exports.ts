import { completeExport, getFirstExport } from "../../db/export"
import { getProductsByOrganizationIdAndBrandBefore, ProductWithScore } from "../../db/product"
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

  if (!exportToProcess.user.organizationId) {
    completeExport(exportToProcess.id)
    return
  }

  console.log(`Processing export ${exportToProcess.name}`)
  const products = await getProductsByOrganizationIdAndBrandBefore(
    exportToProcess.user.organizationId,
    exportToProcess.createdAt,
    exportToProcess.brand,
  )

  if (!products.length) {
    completeExport(exportToProcess.id)
    return
  }

  const zip = new JSZip()

  for (const product of products) {
    const svgContent = renderLabelSVG(product)
    if (!svgContent) {
      continue
    }

    zip.file(`${product.internalReference}.svg`, svgContent)
  }

  const zipContent = await zip.generateAsync({ type: "nodebuffer" })
  await uploadFileToS3(`${exportToProcess.name}.zip`, zipContent, "export")

  await completeExport(exportToProcess.id)
  console.log(`${products.length} products processed and export completed`)
}
