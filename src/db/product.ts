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
          createdBy: {
            include: {
              organization: {
                select: {
                  name: true,
                  brands: { select: { name: true } },
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
    select: {
      version: { select: { version: true } },
      createdBy: { select: { organization: { select: { name: true } } } },
    },
  },
} satisfies Prisma.ProductSelect

export const getProductWithScore = async (gtin: string, userId: string) => {
  const result = await prismaClient.product.findFirst({
    select: productWithScoreSelect,
    where: {
      gtins: { has: gtin },
      upload: {
        organization: {
          users: {
            some: { id: userId },
          },
        },
      },
      status: Status.Done,
    },
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

export const getOrganizationProductsCountByUserIdAndBrand = async (userId: string, brand?: string) => {
  const organization = await prismaClient.organization.findFirst({
    where: { users: { some: { id: userId } } },
  })

  if (!organization) {
    return 0
  }

  const result = await prismaClient.product.groupBy({
    by: ["internalReference"],
    where: {
      upload: { organizationId: organization.id },
      status: Status.Done,
      brand: brand,
    },
    _count: { internalReference: true },
  })
  return result.length
}

export const getOrganizationProductsByUserIdAndBrand = async (
  userId: string,
  page?: number,
  size?: number,
  brand?: string,
) => {
  const organization = await prismaClient.organization.findFirst({
    where: { users: { some: { id: userId } } },
  })

  if (!organization) {
    return []
  }
  return getProducts({ upload: { organizationId: organization.id }, brand }, (page || 0) * (size || 10), size || 10)
}
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
          createdBy: {
            include: {
              organization: {
                select: {
                  name: true,
                  brands: { select: { name: true } },
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

export const getProductsByOrganizationIdAndBrandBefore = async (
  organizationId: string,
  before: Date,
  brand: string | null,
) => getProducts({ upload: { organizationId }, createdAt: { lt: before }, brand: brand || undefined })

export const getOrganizationProductsByUserId = async (userId: string) => {
  const organization = await prismaClient.organization.findFirst({
    where: { users: { some: { id: userId } } },
  })

  if (!organization) {
    return []
  }

  const products = await prismaClient.product.findMany({
    where: {
      upload: { organizationId: organization.id },
      status: Status.Done,
    },
    select: {
      brand: true,
    },
    distinct: ["brand"],
  })
  return products.map((product) => product.brand).sort((a, b) => a.localeCompare(b))
}
