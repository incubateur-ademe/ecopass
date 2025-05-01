import { Status } from "../../prisma/src/prisma"
import { prismaClient } from "./prismaClient"

export const createUpload = async () => prismaClient.upload.create({ data: {}, select: { id: true } })

export const completeUpload = async (id: string) =>
  prismaClient.upload.update({
    where: { id },
    data: { status: Status.Done },
  })

export const failUpload = async (id: string) =>
  prismaClient.upload.update({
    where: { id },
    data: { status: Status.Error },
  })
