import { Prisma, Status, UploadType } from "../../prisma/src/prisma"
import { ProductAPIValidation } from "../services/validation/api"
import { encryptProductFields } from "./encryption"
import { prismaClient } from "./prismaClient"

export const createScores = async (scores: Prisma.ScoreCreateManyInput[]) =>
  prismaClient.score.createMany({
    data: scores,
  })

export const createScore = async (userId: string, product: ProductAPIValidation, score: number) =>
  prismaClient.$transaction(async (transaction) => {
    const lastVersion = await transaction.version.findFirst({
      orderBy: { createdAt: "desc" },
    })

    if (!lastVersion) {
      throw new Error("No version found")
    }

    const encrypted = encryptProductFields(product)

    return transaction.score.create({
      data: {
        score: score,
        standardized: (score / product.mass) * 0.1,
        product: {
          create: {
            ...encrypted.product,
            status: Status.Done,
            upload: {
              create: { userId: userId, versionId: lastVersion.id, type: UploadType.API },
            },
            materials: {
              createMany: {
                data: encrypted.materials,
              },
            },
            accessories: encrypted.accessories
              ? {
                  createMany: {
                    data: encrypted.accessories,
                  },
                }
              : undefined,
          },
        },
      },
    })
  })
