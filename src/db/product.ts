import { Accessory, Material, Prisma, Product, Status } from "../../prisma/src/prisma"
import { decryptProductFields, decryptString } from "./encryption"
import { prismaClient } from "./prismaClient"

export const createProducts = async ({
  products,
  materials,
  accessories,
}: {
  products: Product[]
  materials: Material[]
  accessories: Accessory[]
}) => {
  return prismaClient.$transaction(
    async (transaction) => {
      await transaction.product.createMany({
        data: products,
      })
      await Promise.all([
        transaction.material.createMany({
          data: materials,
        }),
        transaction.accessory.createMany({
          data: accessories,
        }),
      ])
    },
    { timeout: 180000 },
  )
}

export const createProductScore = async (score: Prisma.ScoreCreateManyInput) =>
  prismaClient.$transaction(async (transaction) => {
    await transaction.score.create({
      data: score,
    })
    await transaction.product.update({
      where: { id: score.productId },
      data: { status: Status.Done },
    })
  })

export const getProductsToProcess = async (take: number) => {
  const products = await prismaClient.product.findMany({
    where: {
      status: Status.Pending,
    },
    include: {
      materials: true,
      accessories: true,
      upload: {
        include: {
          user: {
            include: {
              brand: {
                select: {
                  name: true,
                  names: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    take,
  })

  return products.map((product) => decryptProductFields(product))
}

const productWithScoreSelect = {
  gtins: true,
  internalReference: true,
  brand: true,
  createdAt: true,
  category: true,
  score: { select: { score: true, standardized: true } },
  upload: {
    select: { version: { select: { version: true } }, user: { select: { brand: { select: { name: true } } } } },
  },
} satisfies Prisma.ProductSelect

export const getProductWithScore = async (gtin: string, userId: string) => {
  const result = await prismaClient.product.findFirst({
    select: productWithScoreSelect,
    where: { gtins: { has: gtin }, upload: { userId }, status: Status.Done },
    orderBy: { createdAt: "desc" },
  })
  if (result) {
    return { ...result, category: decryptString(result.category) }
  }
  return null
}

export type ProductWithScore = Exclude<Awaited<ReturnType<typeof getProductWithScore>>, null>

const getProducts = async (
  where: Pick<Prisma.ProductWhereInput, "upload" | "uploadId" | "createdAt" | "brand">,
  skip?: number,
  take?: number,
) => {
  const uniqueGtins = await prismaClient.product.findMany({
    where: {
      score: { isNot: null },
      ...where,
    },
    select: { internalReference: true },
    distinct: ["internalReference"],
    orderBy: [{ internalReference: "asc" }, { createdAt: "desc" }],
    skip,
    take,
  })

  const products = await Promise.all(
    uniqueGtins.map(async ({ internalReference }) =>
      prismaClient.product.findFirst({
        where: { internalReference, ...where, score: { isNot: null } },
        select: productWithScoreSelect,
        orderBy: { createdAt: "desc" },
      }),
    ),
  )

  return products
    .filter((product) => product !== null)
    .map((product) => ({
      ...product,
      category: decryptString(product.category),
    }))
}

export type Products = Awaited<ReturnType<typeof getProducts>>

export const getProductsCountByUserIdAndBrand = async (userId: string, brand?: string) => {
  const result = await prismaClient.product.groupBy({
    by: ["internalReference"],
    where: {
      upload: { userId },
      status: Status.Done,
      brand,
    },
    _count: { internalReference: true },
  })
  return result.length
}

export const getProductsByUserIdAndBrand = async (userId: string, page?: number, size?: number, brand?: string) =>
  getProducts({ upload: { userId }, brand }, (page || 0) * (size || 10), size || 10)

export const getProductsByUploadId = async (uploadId: string) => {
  const products = await prismaClient.product.findMany({
    where: {
      uploadId,
    },
    include: {
      materials: true,
      accessories: true,
      score: true,
      upload: {
        include: {
          user: {
            include: {
              brand: {
                select: {
                  name: true,
                  names: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  })
  return products.map((product) => decryptProductFields(product))
}

export const failProducts = async (products: { id: string; error: string }[]) => {
  await Promise.all(
    products.map((product) =>
      prismaClient.product.update({
        where: { id: product.id },
        data: {
          status: Status.Error,
          error: product.error,
        },
      }),
    ),
  )
}

export const getProductsByUserIdAndBrandBefore = async (userId: string, before: Date, brand: string | null) =>
  getProducts({ upload: { userId }, createdAt: { lt: before }, brand: brand || undefined })

export const getProductsBrandByUserId = async (userId: string) => {
  const products = await prismaClient.product.findMany({
    where: {
      upload: { userId },
      status: Status.Done,
    },
    select: {
      brand: true,
    },
    distinct: ["brand"],
  })
  return products.map((product) => product.brand).sort((a, b) => a.localeCompare(b))
}
