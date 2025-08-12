import { Prisma, Status, UploadType } from "../../prisma/src/prisma"
import { APIUser } from "../services/auth/auth"
import { ProductAPIValidation } from "../services/validation/api"
import { ecobalyseVersion } from "../utils/ecobalyse/config"
import { encryptProductFields } from "../utils/encryption/encryption"
import { prismaClient } from "./prismaClient"

export const createScores = async (scores: Prisma.ScoreCreateManyInput[]) =>
  prismaClient.score.createMany({
    data: scores,
  })

export const createScore = async (
  user: NonNullable<APIUser>["user"],
  product: ProductAPIValidation,
  score: Omit<Prisma.ScoreCreateInput, "product">,
  hash: string,
) =>
  prismaClient.$transaction(async (transaction) => {
    if (!user.organization) {
      throw new Error("User organization not found")
    }

    const encrypted = encryptProductFields(product)

    return transaction.score.create({
      data: {
        ...score,
        product: {
          create: {
            ...encrypted.product,
            hash,
            brand: encrypted.product.brand || user.organization.name,
            status: Status.Done,
            upload: {
              create: {
                createdById: user.id,
                organizationId: user.organization.id,
                version: ecobalyseVersion,
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
