import { Status } from "../../prisma/src/prisma"
import { prismaClient } from "./prismaClient"

export const createExport = async (userId: string) =>
  prismaClient.export.create({
    data: {
      userId,
      name: `affichage-environnemental-${new Date().toISOString()}`,
      status: Status.Pending,
    },
  })

export const getExportsByUserId = async (userId: string) => {
  const date = new Date()
  date.setDate(date.getDate() - 30)
  return prismaClient.export.findMany({
    where: { userId, createdAt: { gte: date } },
    orderBy: { createdAt: "desc" },
  })
}

export const getFirstExport = async () =>
  prismaClient.export.findFirst({
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
