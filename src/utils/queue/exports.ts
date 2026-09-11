import { completeExport, failExport, getFirstExport } from "../../db/export"
import { getOrganizationAuthorizedBrands, getProducts, ProductWithScore } from "../../db/product"
import JSZip from "jszip"
import { getSVG } from "../label/simple"
import { uploadFileToS3 } from "../s3/bucket"
import { ExportType, Status } from "@prisma/enums"
import { stringify } from "csv-stringify"

const renderLabelSVG = (product: ProductWithScore) => {
  if (!product.score || !product.standardized) {
    return null
  }

  return getSVG(product.score, product.standardized)
}

const size = 1000

const processExportWithStrategy = async (
  exportToProcess: NonNullable<Awaited<ReturnType<typeof getFirstExport>>>,
  authorizedBrands: Set<string>,
  strategy: {
    getPage(pageNumber: number): number
    onBatch(products: ProductWithScore[], pageNumber: number): Promise<void>
    onFinalize(): Promise<void>
  },
) => {
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
    await strategy.onBatch(products, page)
    page++
  }

  await strategy.onFinalize()
  await completeExport(exportToProcess.id, strategy.getPage(page))
  console.log(`Completed export ${exportToProcess.name}`)
}

const createSVGExportStrategy = (exportName: string) => {
  return {
    async onBatch(products: ProductWithScore[], pageNumber: number) {
      const zip = new JSZip()

      for (const product of products) {
        const svgContent = renderLabelSVG(product)
        if (!svgContent) {
          continue
        }

        zip.file(`${product.internalReference}.svg`, svgContent)
      }

      const zipContent = await zip.generateAsync({ type: "nodebuffer" })
      await uploadFileToS3(`${exportName}${pageNumber > 0 ? `-${pageNumber + 1}` : ""}.zip`, zipContent, "export")
    },
    async onFinalize() {},
    getPage(pageNumber: number) {
      return pageNumber
    },
  }
}

const createCSVExportStrategy = (exportName: string) => {
  const data: (string | number)[][] = []

  return {
    async onBatch(products: ProductWithScore[]) {
      for (const product of products) {
        data.push([product.internalReference, product.score !== null ? Math.round(product.score) : ""])
      }
    },
    async onFinalize() {
      const headers = ["Référence interne", "Score"]
      const csv = stringify(data, {
        header: true,
        columns: headers,
      })

      await uploadFileToS3(`${exportName}.csv`, csv, "export", "text/csv")
    },
    getPage() {
      return 1
    },
  }
}

const exportSVGs = async (
  exportToProcess: NonNullable<Awaited<ReturnType<typeof getFirstExport>>>,
  authorizedBrands: Set<string>,
) => {
  const strategy = createSVGExportStrategy(exportToProcess.name)
  await processExportWithStrategy(exportToProcess, authorizedBrands, strategy)
}

const exportCSVs = async (
  exportToProcess: NonNullable<Awaited<ReturnType<typeof getFirstExport>>>,
  authorizedBrands: Set<string>,
) => {
  const strategy = createCSVExportStrategy(exportToProcess.name)
  await processExportWithStrategy(exportToProcess, authorizedBrands, strategy)
}

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

  if (exportToProcess.type === ExportType.SVG) {
    await exportSVGs(exportToProcess, authorizedBrands)
  } else {
    await exportCSVs(exportToProcess, authorizedBrands)
  }
}
