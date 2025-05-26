import { Status } from "../../prisma/src/prisma"
import { completeUpload, failUpload } from "../services/upload"
import { prismaClient } from "./prismaClient"

export const getUploadById = async (id: string) =>
  prismaClient.upload.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      error: true,
    },
  })

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
      select: {
        id: true,
        user: { select: { email: true } },
        name: true,
        createdAt: true,
        products: { select: { status: true } },
      },
    })
  })

export const updateUploadToDone = async (id: string) =>
  prismaClient.upload.update({
    where: { id },
    data: { status: Status.Done },
  })

export const updateUploadToError = async (id: string, message?: string) =>
  prismaClient.upload.update({
    where: { id },
    data: { status: Status.Error, error: message },
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
    success: upload.products.filter((product) => product.status === Status.Done).length,
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
      name: true,
      createdAt: true,
      user: { select: { email: true } },
      products: {
        select: { status: true },
      },
    },
  })

  return Promise.all(
    uploads
      .filter((upload) =>
        upload.products.every((product) => product.status === Status.Done || product.status === Status.Error),
      )
      .map(async (upload) => {
        const allDone = upload.products.every((product) => product.status === Status.Done)
        if (allDone) {
          return completeUpload(upload)
        } else {
          return failUpload(upload)
        }
      }),
  )
}
