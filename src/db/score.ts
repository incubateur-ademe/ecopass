import { ConfidenceLevel, Prisma } from "@prisma/client"
import { Status, UploadType } from "@prisma/enums"
import { ProductInformationAPI, ProductMetadataAPI } from "../services/validation/api"
import { ecobalyseVersion } from "../utils/ecobalyse/config"
import { encryptProductFields } from "../utils/encryption/encryption"
import { applyMeanScoreToProduct, productWithScoreSelect, ProductWithScore } from "./product"
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
            url: product.url,
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

const computeBatchScore = (product: Pick<ProductWithScore, "informations" | "score" | "standardized">) => {
  const scores = product.informations.reduce(
    (acc, value) => {
      if (value.score) {
        return {
          scoreWithoutDurability: acc.scoreWithoutDurability + value.score.score * value.score.durability,
          acd: acc.acd + value.score.acd,
          cch: acc.cch + value.score.cch,
          etf: acc.etf + value.score.etf,
          fru: acc.fru + value.score.fru,
          fwe: acc.fwe + value.score.fwe,
          ior: acc.ior + value.score.ior,
          ldu: acc.ldu + value.score.ldu,
          microfibers: acc.microfibers + value.score.microfibers,
          mru: acc.mru + value.score.mru,
          outOfEuropeEOL: acc.outOfEuropeEOL + value.score.outOfEuropeEOL,
          ozd: acc.ozd + value.score.ozd,
          pco: acc.pco + value.score.pco,
          pma: acc.pma + value.score.pma,
          swe: acc.swe + value.score.swe,
          tre: acc.tre + value.score.tre,
          wtu: acc.wtu + value.score.wtu,
          materials: acc.materials + (value.score.materials || 0),
          spinning: acc.spinning + (value.score.spinning || 0),
          fabric: acc.fabric + (value.score.fabric || 0),
          dyeing: acc.dyeing + (value.score.dyeing || 0),
          making: acc.making + (value.score.making || 0),
          usage: acc.usage + (value.score.usage || 0),
          endOfLife: acc.endOfLife + (value.score.endOfLife || 0),
          transport: acc.transport + (value.score.transport || 0),
          trims: acc.trims + (value.score.trims || 0),
          htc: acc.htc + (value.score.htc || 0),
          htn: acc.htn + (value.score.htn || 0),
        }
      }
      return acc
    },
    {
      scoreWithoutDurability: 0,
      acd: 0,
      cch: 0,
      etf: 0,
      fru: 0,
      fwe: 0,
      ior: 0,
      ldu: 0,
      microfibers: 0,
      mru: 0,
      outOfEuropeEOL: 0,
      ozd: 0,
      pco: 0,
      pma: 0,
      swe: 0,
      tre: 0,
      wtu: 0,
      materials: 0,
      spinning: 0,
      fabric: 0,
      dyeing: 0,
      making: 0,
      usage: 0,
      endOfLife: 0,
      transport: 0,
      trims: 0,
      htc: 0,
      htn: 0,
    },
  )

  return {
    ...scores,
    durability: product.score ? scores.scoreWithoutDurability / product.score : 0,
    score: product.score ?? 0,
    standardized: product.standardized ?? 0,
    scoreWithoutDurability: undefined,
  }
}

type BatchScore = ReturnType<typeof computeBatchScore>
export type MeanScores = Omit<{ [K in keyof BatchScore]: number }, "scoreWithoutDurability">

const mean = (values: (number | null | undefined)[]) => {
  const numbers = values.filter((value) => value !== null && value !== undefined)
  return numbers.length > 0 ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : null
}

export const getMeanScores = async (
  product: Pick<
    ProductWithScore,
    "informations" | "score" | "standardized" | "confidenceLevel" | "gtins" | "createdAt"
  >,
) => {
  if (product.confidenceLevel === ConfidenceLevel.High) {
    return computeBatchScore(product)
  }

  const oldProducts = await prismaClient.product.findMany({
    where: {
      gtins: { hasSome: product.gtins },
      status: Status.Done,
      confidenceLevel: product.confidenceLevel,
      createdAt: { lt: product.createdAt },
    },
    select: productWithScoreSelect,
  })

  const products = [product, ...oldProducts]
  const scores: BatchScore[] = products.map((item) => computeBatchScore(item))
  const detailedScoreKeys = Object.keys(scores[0] || {}).filter(
    (key) => key !== "scoreWithoutDurability" && typeof scores[0][key as keyof BatchScore] === "number",
  )

  const meanDetailedScores = Object.fromEntries(
    detailedScoreKeys.map((key) => [key, mean(scores.map((score) => score[key as keyof BatchScore]))]),
  )

  return meanDetailedScores as MeanScores
}
