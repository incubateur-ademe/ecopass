import { Status } from "../../prisma/src/prisma"
import { prismaClient } from "./prismaClient"

export const createUpload = async (userId: string, name: string) =>
  prismaClient.$transaction(async (transaction) => {
    const lastVersion = await transaction.version.findFirst({
      orderBy: { createdAt: "desc" },
    })

    if (!lastVersion) {
      throw new Error("No version found")
    }

    return transaction.upload.create({
      data: { userId: userId, name, versionId: lastVersion.id },
      select: { id: true },
    })
  })

const completeUpload = async (id: string) =>
  prismaClient.upload.update({
    where: { id },
    data: { status: Status.Done },
  })

export const failUpload = async (id: string) =>
  prismaClient.upload.update({
    where: { id },
    data: { status: Status.Error },
  })

export const getUploadsByUserId = async (userId: string) => {
  const uploads = await prismaClient.upload.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
      status: true,
      products: {
        select: {
          status: true,
        },
      },
    },
    take: 10,
  })
  return uploads.map((upload) => ({
    ...upload,
    products: undefined,
    total: upload.products.length,
    done: upload.products.filter((product) => product.status === Status.Done || product.status === Status.Error).length,
  }))
}

export const checkUploadsStatus = async (uploadsId: string[]) => {
  const uploads = await prismaClient.upload.findMany({
    where: {
      id: { in: uploadsId },
    },
    select: {
      id: true,
      products: {
        select: { status: true },
      },
    },
  })
  return Promise.all(
    uploads.map(async (upload) => {
      const allDone = upload.products.every((product) => product.status === Status.Done)
      const allError = upload.products.some((product) => product.status === Status.Error)
      if (allDone) {
        return completeUpload(upload.id)
      } else if (allError) {
        return failUpload(upload.id)
      }
    }),
  )
}
