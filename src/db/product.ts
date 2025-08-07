import { Accessory, Material, Prisma, Product, Status } from "../../prisma/src/prisma"
import { decryptProductFields } from "./encryption"
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
                  authorizedBy: {
                    select: { from: { select: { name: true, brands: { select: { name: true } } } } },
                    where: { active: true },
                  },
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
  id: true,
  gtins: true,
  internalReference: true,
  brand: true,
  createdAt: true,
  category: true,
  score: true,
  upload: {
    select: {
      version: true,
      createdBy: { select: { organization: { select: { name: true } }, nom: true, prenom: true } },
    },
  },
} satisfies Prisma.ProductSelect

export const getProductWithScoreHistory = async (gtin: string, page: number, pageSize: number) =>
  prismaClient.product.findMany({
    select: productWithScoreSelect,
    where: {
      gtins: { has: gtin },
      status: Status.Done,
    },
    orderBy: { createdAt: "desc" },
    skip: page * pageSize,
    take: pageSize,
  })

export const getProductWithScoreHistoryCount = async (gtin: string) => {
  return prismaClient.product.count({
    where: {
      gtins: { has: gtin },
      status: Status.Done,
    },
  })
}

export const getProductWithScore = async (gtin: string) =>
  prismaClient.product.findFirst({
    select: productWithScoreSelect,
    where: {
      gtins: { has: gtin },
      status: Status.Done,
    },
    orderBy: { createdAt: "desc" },
  })

export type ProductWithScore = NonNullable<Awaited<ReturnType<typeof getProductWithScore>>>

export const getOldProductWithScore = async (gtin: string, version: string) =>
  prismaClient.product.findFirst({
    select: productWithScoreSelect,
    where: {
      gtins: { has: gtin },
      id: version,
      status: Status.Done,
    },
    orderBy: { createdAt: "desc" },
  })

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
    orderBy: [{ internalReference: "asc" }],
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
  return products.filter((product) => product !== null)
}

export type Products = Awaited<ReturnType<typeof getProducts>>

export const getOrganizationProductsCountByUserIdAndBrand = async (userId: string, brand?: string) => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      organization: true,
    },
  })

  if (!user || !user.organization) {
    return 0
  }

  const result = await prismaClient.product.groupBy({
    by: ["internalReference"],
    where: {
      upload: { organizationId: user.organization.id },
      status: Status.Done,
      brand: brand,
    },
    _count: { internalReference: true },
  })
  return result.length
}

export const getOrganizationProductsByUserIdAndBrand = async (
  userId: string,
  page: number,
  size: number | undefined,
  brand?: string,
) => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      organization: true,
    },
  })

  if (!user || !user.organization) {
    return []
  }
  return size
    ? getProducts({ upload: { organizationId: user.organization.id }, brand }, (page || 0) * size, size)
    : getProducts({ upload: { organizationId: user.organization.id }, brand })
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
                  authorizedBy: {
                    select: { from: { select: { name: true, brands: { select: { name: true } } } } },
                    where: { active: true },
                  },
                  brands: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      uploadOrder: "asc",
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
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      organization: true,
    },
  })

  if (!user || !user.organization) {
    return []
  }

  const products = await prismaClient.product.findMany({
    where: {
      upload: { organizationId: user.organization.id },
      status: Status.Done,
    },
    select: {
      brand: true,
    },
    distinct: ["brand"],
  })
  return products.map((product) => product.brand).sort((a, b) => a.localeCompare(b))
}
