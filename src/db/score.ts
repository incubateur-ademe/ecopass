import { Prisma, Status, UploadType } from "../../prisma/src/prisma"
import { APIUser } from "../services/auth/auth"
import { ProductAPIValidation } from "../services/validation/api"
import { encryptProductFields } from "./encryption"
import { prismaClient } from "./prismaClient"

export const createScores = async (scores: Prisma.ScoreCreateManyInput[]) =>
  prismaClient.score.createMany({
    data: scores,
  })

export const createScore = async (user: Exclude<APIUser, null>["user"], product: ProductAPIValidation, score: number) =>
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
            brand: encrypted.product.brand || user.brand?.name || "",
            status: Status.Done,
            upload: {
              create: {
                createdById: user.id,
                brandId: user.brand.id,
                versionId: lastVersion.id,
                type: UploadType.API,
                status: Status.Done,
              },
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
