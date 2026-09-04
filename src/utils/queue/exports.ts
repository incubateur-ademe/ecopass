import { completeExport, failExport, getFirstExport } from "../../db/export"
import { getOrganizationAuthorizedBrands, getProducts, ProductWithScore } from "../../db/product"
import JSZip from "jszip"
import { getSVG } from "../label/simple"
import { uploadFileToS3 } from "../s3/bucket"
import { Status } from "@prisma/enums"

const renderLabelSVG = (product: ProductWithScore) => {
  if (!product.score || !product.standardized) {
    return null
  }

  return getSVG(product.score, product.standardized)
}

const size = 1000

export const processExportsQueue = async () => {
  const exportToProcess = await getFirstExport()
  if (!exportToProcess) {
    return
  }
  if (!exportToProcess.user.organizationId) {
    await failExport(exportToProcess.id)
    return
  }

  console.log(`Processing export ${exportToProcess.name}`)
  const authorizedBrands = await getOrganizationAuthorizedBrands(exportToProcess.user.organizationId)

  if (exportToProcess.brand && !authorizedBrands.has(exportToProcess.brand)) {
    await failExport(exportToProcess.id)
    return
  }

  let products: ProductWithScore[] = []
  let page = 0

  while (page === 0 || products.length > 0) {
    products = await getProducts(
      {
        brandId: exportToProcess.brand ? exportToProcess.brand : { in: Array.from(authorizedBrands) },
        status: Status.Done,
        createdAt: { lt: exportToProcess.createdAt },
      },
      size * page,
      size,
    )

    if (!products.length) {
      if (page === 0) {
        await failExport(exportToProcess.id)
        return
      }

      continue
    }

    console.log(`exporting page ${page} : ${products.length} products`)
    const zip = new JSZip()

    for (const product of products) {
      const svgContent = renderLabelSVG(product)
      if (!svgContent) {
        continue
      }

      zip.file(`${product.internalReference}.svg`, svgContent)
    }

    const zipContent = await zip.generateAsync({ type: "nodebuffer" })
    await uploadFileToS3(`${exportToProcess.name}${page > 0 ? `-${page + 1}` : ""}.zip`, zipContent, "export")
    page++
  }

  await completeExport(exportToProcess.id, page)
  console.log(`Completed export ${exportToProcess.name}`)
}
