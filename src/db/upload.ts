import { Status, UploadType } from "../../prisma/src/prisma"
import { completeUpload, failUpload } from "../services/upload"
import { ecobalyseVersion } from "../utils/ecobalyse/config"
import { prismaClient } from "./prismaClient"

export const getUploadById = async (id: string) =>
  prismaClient.upload.findUnique({
    where: { id },
    select: {
      id: true,
      createdById: true,
      status: true,
      error: true,
    },
  })

export const createUpload = async (userId: string, uploadType: UploadType, name?: string, id?: string) =>
  prismaClient.$transaction(async (transaction) => {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { id: true, organizationId: true },
    })

    if (!user || !user.organizationId) {
      throw new Error("No user found")
    }

    return transaction.upload.create({
      data: {
        id,
        createdById: user.id,
        organizationId: user.organizationId,
        name,
        version: ecobalyseVersion,
        type: uploadType,
      },
      select: {
        id: true,
        createdBy: { select: { email: true } },
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

export const updateUploadToPending = async (id: string) =>
  prismaClient.upload.update({
    where: { id },
    data: { status: Status.Processing },
  })

export const getuploadsCountByUserId = async (userId: string) =>
  prismaClient.upload.count({
    where: { createdById: userId, type: UploadType.FILE },
  })

export const getUploadsByUserId = async (userId: string, skip?: number, take?: number) => {
  const uploads = await prismaClient.upload.findMany({
    where: { createdById: userId, type: UploadType.FILE },
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
      reUploadProducts: {
        select: {
          product: {
            select: {
              status: true,
            },
          },
        },
      },
    },
    take: take || 10,
    skip: (skip || 0) * (take || 10),
  })
  return uploads.map((upload) => ({
    ...upload,
    products: undefined,
    total: upload.products.length + upload.reUploadProducts.length,
    success:
      upload.products.filter((product) => product.status === Status.Done).length +
      upload.reUploadProducts.filter((p) => p.product.status === Status.Done).length,
    done:
      upload.products.filter((product) => product.status === Status.Done || product.status === Status.Error).length +
      upload.reUploadProducts.filter((p) => p.product.status === Status.Done || p.product.status === Status.Error)
        .length,
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
      createdBy: { select: { email: true } },
      products: {
        select: { status: true },
      },
      reUploadProducts: {
        select: {
          product: {
            select: {
              status: true,
            },
          },
        },
      },
    },
  })

  return Promise.all(
    uploads
      .filter(
        (upload) =>
          upload.products.every((product) => product.status === Status.Done || product.status === Status.Error) &&
          upload.reUploadProducts.every(
            (product) => product.product.status === Status.Done || product.product.status === Status.Error,
          ),
      )
      .map(async (upload) => {
        const allDone =
          upload.products.every((product) => product.status === Status.Done) &&
          upload.reUploadProducts.every((product) => product.product.status === Status.Done)
        if (allDone) {
          return completeUpload(upload)
        } else {
          return failUpload(upload)
        }
      }),
  )
}

export const getFirstFileUpload = async () =>
  prismaClient.upload.findFirst({
    select: {
      id: true,
      name: true,
      createdAt: true,
      createdBy: { select: { email: true, organization: { select: { name: true } } } },
      products: { select: { status: true } },
      reUploadProducts: { select: { product: { select: { status: true } } } },
    },
    where: { status: Status.Pending, type: UploadType.FILE },
    orderBy: { createdAt: "asc" },
  })

export type FileUpload = Awaited<ReturnType<typeof getFirstFileUpload>>

export const getDoneFileUploadCount = async () =>
  prismaClient.upload.count({ where: { status: Status.Done, type: UploadType.FILE } })

export const getDoneAPIUploadCount = async () =>
  prismaClient.upload.count({ where: { status: Status.Done, type: UploadType.API } })
