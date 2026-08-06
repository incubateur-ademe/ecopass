import { ConfidenceLevel, Prisma } from "@prisma/client"
import { Status, UploadType } from "@prisma/enums"
import { ProductInformationAPI, ProductMetadataAPI } from "../services/validation/api"
import { ecobalyseVersion } from "../utils/ecobalyse/config"
import { encryptProductFields } from "../utils/encryption/encryption"
import { applyMeanScoreToProduct } from "./product"
import { prismaClient } from "./prismaClient"
import { FullUser } from "./user"

export const createScore = async (
  user: FullUser,
  product: ProductMetadataAPI,
  informations: ProductInformationAPI[],
  scores: Omit<Prisma.ScoreCreateInput, "product" | "standardized">[],
  hash: string,
  type: UploadType,
  confidenceLevel: ConfidenceLevel,
) =>
  prismaClient
    .$transaction(
      async (transaction) => {
        const score = scores.reduce((acc, value) => acc + value.score, 0)
        const mass = informations.map((info) => info.mass).reduce((acc, value) => acc + value, 0)

        const createdBatch = await transaction.product.create({
          data: {
            status: Status.Done,
            confidenceLevel,
            hash,
            brand: { connect: { id: product.brandId } },
            gtins: product.gtins,
            declaredScore: product.declaredScore || null,
            internalReference: product.internalReference,
            score,
            standardized: (score / mass) * 0.1,
            upload: {
              create: {
                createdById: user.id,
                organizationId: user.organization ? user.organization.id : null,
                version: ecobalyseVersion,
                type,
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
                emptyTrims: product.trims === undefined,
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

        return createdBatch.id
      },
      { timeout: 180000 },
    )
    .then((productId) => applyMeanScoreToProduct(productId))
