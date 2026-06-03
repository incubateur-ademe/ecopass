import { Status } from "@prisma/enums"
import { prismaClient } from "./prismaClient"

export const createExport = async (userId: string, brand?: string) =>
  prismaClient.export.create({
    data: {
      userId,
      name: `affichage-environnemental-${new Date().toISOString()}`,
      status: Status.Pending,
      brand,
    },
  })

export const getExportsByUserIdAndBrand = async (userId: string, brand?: string) => {
  const date = new Date()
  date.setDate(date.getDate() - 30)
  return prismaClient.export.findMany({
    where: { userId, createdAt: { gte: date }, brand: brand || null },
    orderBy: { createdAt: "desc" },
  })
}

export const getFirstExport = async () =>
  prismaClient.export.findFirst({
    include: { user: { select: { organizationId: true } } },
    where: { status: Status.Pending },
    orderBy: { createdAt: "asc" },
  })

export const completeExport = async (exportId: string) =>
  prismaClient.export.update({
    where: { id: exportId },
    data: { status: Status.Done },
  })

export const getExportByName = async (userId: string, name: string) =>
  prismaClient.export.findFirst({
    where: {
      userId,
      name,
    },
  })
