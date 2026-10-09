import { completeExport, failExport, getFirstExport } from "../../db/export"
import { getProducts, getProductsBaseWhere, ProductWithScore } from "../../db/product"
import JSZip from "jszip"
import { getSVG } from "../label/simple"
import { uploadFileToS3 } from "../s3/bucket"
import { ExportType } from "@prisma/enums"
import { stringify } from "csv-stringify/sync"
import { exportDgccrfBrandProducts } from "./dgccrf"
import { encryptAndZipFile } from "../encryption/encryption"
import { canExportFullProducts } from "../authorization/authorizations"
import { getMeanScores } from "../../db/score"

const renderLabelSVG = (product: ProductWithScore) => {
  if (!product.score || !product.standardized) {
    return null
  }

  return getSVG(product.score, product.standardized)
}

const size = 1000

const getExportFilters = (exportToProcess: NonNullable<Awaited<ReturnType<typeof getFirstExport>>>) => {
  return {
    brandId: exportToProcess.brand || undefined,
    category: exportToProcess.category || undefined,
    declarant: exportToProcess.declarant || undefined,
    dateFrom: exportToProcess.dateFrom || undefined,
    dateTo: exportToProcess.dateTo || exportToProcess.createdAt,
    search: exportToProcess.search || undefined,
  }
}

const processExportWithStrategy = async (
  exportToProcess: NonNullable<Awaited<ReturnType<typeof getFirstExport>>>,
  strategy: {
    getPage(pageNumber: number): number
    onBatch(products: ProductWithScore[], pageNumber: number): Promise<void>
    onFinalize(): Promise<void>
  },
) => {
  let products: ProductWithScore[] = []
  let page = 0

  const baseWhere = await getProductsBaseWhere(exportToProcess.user, getExportFilters(exportToProcess))
  while (page === 0 || products.length > 0) {
    products = await getProducts(baseWhere, size * page, size)

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
        const meanScores = await getMeanScores(product)
        data.push([
          product.gtins.join(";"),
          product.internalReference,
          meanScores.score ?? "",
          meanScores.standardized ?? "",
          meanScores.durability ?? "",
          meanScores.acd ?? "",
          meanScores.cch ?? "",
          meanScores.etf ?? "",
          meanScores.fru ?? "",
          meanScores.fwe ?? "",
          meanScores.ior ?? "",
          meanScores.ldu ?? "",
          meanScores.mru ?? "",
          meanScores.ozd ?? "",
          meanScores.pco ?? "",
          meanScores.pma ?? "",
          meanScores.swe ?? "",
          meanScores.tre ?? "",
          meanScores.wtu ?? "",
          meanScores.microfibers ?? "",
          meanScores.outOfEuropeEOL ?? "",
          meanScores.trims ?? "",
          meanScores.materials ?? "",
          meanScores.spinning ?? "",
          meanScores.fabric ?? "",
          meanScores.dyeing ?? "",
          meanScores.making ?? "",
          meanScores.transport ?? "",
          meanScores.usage ?? "",
          meanScores.endOfLife ?? "",
        ])
      }
    },
    async onFinalize() {
      const headers = [
        "GTIN",
        "Référence interne",
        "Score",
        "Score standardisé",
        "Durabilité",
        "Impact - Acidification",
        "Impact - Changement climatique",
        "Impact - Écotoxicité de l'eau douce, corrigée",
        "Impact - Utilisation de ressources fossiles",
        "Impact - Eutrophisation eaux douces",
        "Impact - Radiations ionisantes",
        "Impact - Utilisation des sols",
        "Impact - Utilisation de ressources minérales et métalliques",
        "Impact - Appauvrissement de la couche d'ozone",
        "Impact - Formation d'ozone photochimique",
        "Impact - Particules",
        "Impact - Eutrophisation marine",
        "Impact - Eutrophisation terrestre",
        "Impact - Utilisation de ressources en eau",
        "Impact - Complément microfibres",
        "Impact - Complément export hors-Europe",
        "Cycle de vie - Accessoires",
        "Cycle de vie - Matières premières",
        "Cycle de vie - Filature",
        "Cycle de vie - Tissage & Tricotage",
        "Cycle de vie - Ennoblissement",
        "Cycle de vie - Confection",
        "Cycle de vie - Transport",
        "Cycle de vie - Utilisation",
        "Cycle de vie - Fin de vie",
      ]
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

const exportSVGs = async (exportToProcess: NonNullable<Awaited<ReturnType<typeof getFirstExport>>>) => {
  const strategy = createSVGExportStrategy(exportToProcess.name)
  await processExportWithStrategy(exportToProcess, strategy)
}

const exportCSVs = async (exportToProcess: NonNullable<Awaited<ReturnType<typeof getFirstExport>>>) => {
  const strategy = createCSVExportStrategy(exportToProcess.name)
  await processExportWithStrategy(exportToProcess, strategy)
}

const exportAdmins = async (exportToProcess: NonNullable<Awaited<ReturnType<typeof getFirstExport>>>) => {
  const result = await exportDgccrfBrandProducts(exportToProcess.user.id, getExportFilters(exportToProcess))
  if (typeof result !== "string") {
    await failExport(exportToProcess.id)
    return
  }
  const csvBuffer = Buffer.from(result, "utf-8")
  const zip = await encryptAndZipFile(csvBuffer, `${exportToProcess.name}.csv`)

  await uploadFileToS3(`${exportToProcess.name}.zip`, zip, "export")
  await completeExport(exportToProcess.id, 1)
}

export const processExportsQueue = async () => {
  const exportToProcess = await getFirstExport()
  if (!exportToProcess) {
    return
  }

  console.log(`Processing export ${exportToProcess.name}`)
  if (!exportToProcess.user.organization?.id) {
    await failExport(exportToProcess.id)
    return
  }

  if (
    exportToProcess.type === ExportType.ADMIN &&
    !(exportToProcess.user.role && canExportFullProducts(exportToProcess.user.role, exportToProcess.brand || undefined))
  ) {
    await failExport(exportToProcess.id)
    return
  }

  switch (exportToProcess.type) {
    case ExportType.SVG:
      await exportSVGs(exportToProcess)
      break
    case ExportType.CSV:
      await exportCSVs(exportToProcess)
      break
    case ExportType.ADMIN:
      await exportAdmins(exportToProcess)
      break
  }
}
