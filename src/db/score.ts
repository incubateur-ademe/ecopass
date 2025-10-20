import { Prisma, Status, UploadType } from "../../prisma/src/prisma"
import { APIUser } from "../services/auth/auth"
import { ProductInformationAPI, ProductMetadataAPI } from "../services/validation/api"
import { ecobalyseVersion } from "../utils/ecobalyse/config"
import { encryptProductFields } from "../utils/encryption/encryption"
import { prismaClient } from "./prismaClient"

export const createScores = async (scores: Prisma.ScoreCreateManyInput[]) =>
  prismaClient.score.createMany({
    data: scores,
  })

export const createScore = async (
  user: NonNullable<APIUser>["user"],
  product: ProductMetadataAPI,
  informations: ProductInformationAPI[],
  scores: Omit<Prisma.ScoreCreateInput, "product" | "standardized">[],
  hash: string,
) =>
  prismaClient.$transaction(
    async (transaction) => {
      if (!user.organization) {
        throw new Error("User organization not found")
      }

      const score = scores.reduce((acc, value) => acc + value.score, 0)
      const mass = informations.map((info) => info.mass).reduce((acc, value) => acc + value, 0)

      const createdBatch = await transaction.product.create({
        data: {
          status: Status.Done,
          hash,
          brand: product.brand || user.organization.name,
          gtins: product.gtins,
          declaredScore: product.declaredScore || null,
          internalReference: product.internalReference,
          score,
          standardized: (score / mass) * 0.1,
          upload: {
            create: {
              createdById: user.id,
              organizationId: user.organization.id,
              version: ecobalyseVersion,
              type: UploadType.API,
              status: Status.Done,
            },
          },
        },
      })

      await Promise.all(
        informations.map((product, index) => {
          const encrypted = encryptProductFields(product)
          const score = scores[index]
          return transaction.productInformation.create({
            data: {
              ...encrypted.product,
              productId: createdBatch.id,
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
              score: {
                create: { ...score, standardized: (score.score / product.mass) * 0.1 },
              },
            },
          })
        }),
      )
    },
    { timeout: 180000 },
  )
