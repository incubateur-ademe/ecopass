import { ExportType, Status } from "@prisma/enums"
import { prismaClient } from "./prismaClient"
import { ProductFilters } from "./product"
import { getUser } from "./user"

export const createExport = async (userId: string, filter: ProductFilters, type: ExportType) =>
  prismaClient.export.create({
    data: {
      userId,
      name: `affichage-environnemental-${new Date().toISOString()}`,
      status: Status.Pending,
      type,
      brand: filter.brandId,
      category: filter.category,
      declarant: filter.declarant,
      dateFrom: filter.dateFrom,
      dateTo: filter.dateTo,
      search: filter.search,
    },
  })

export const getExportsByUserId = async (userId: string, admin?: boolean) => {
  const date = new Date()
  date.setDate(date.getDate() - 30)
  return prismaClient.export.findMany({
    where: { userId, createdAt: { gte: date }, type: admin ? ExportType.ADMIN : { not: ExportType.ADMIN } },
    orderBy: { createdAt: "desc" },
  })
}

export const getFirstExport = async () => {
  const firstExport = await prismaClient.export.findFirst({
    where: { status: Status.Pending },
    orderBy: { createdAt: "asc" },
  })

  if (!firstExport) {
    return null
  }
  const user = await getUser(firstExport.userId)
  if (!user) {
    return null
  }
  return { ...firstExport, user }
}

export const completeExport = async (exportId: string, page: number) =>
  prismaClient.export.update({
    where: { id: exportId },
    data: { status: Status.Done, count: page },
  })

export const failExport = async (exportId: string) =>
  prismaClient.export.update({
    where: { id: exportId },
    data: { status: Status.Error },
  })

export const getExportByName = async (userId: string, name: string) =>
  prismaClient.export.findFirst({
    where: {
      userId,
      name,
    },
  })
