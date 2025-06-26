import { Accessory, Material, Prisma, Product, Score, Status } from "../../prisma/src/prisma"
import { decryptBoolean, decryptNumber, decryptString } from "./encryption"
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

const decryptProduct = (
  products: (Product & { materials: Material[]; accessories: Accessory[]; score?: Score | null })[],
) =>
  products.map((product) => ({
    ...product,
    category: decryptString(product.category),
    business: decryptString(product.business),
    countryDyeing: decryptString(product.countryDyeing),
    countryFabric: decryptString(product.countryFabric),
    countryMaking: decryptString(product.countryMaking),
    countrySpinning: decryptString(product.countrySpinning),
    mass: decryptNumber(product.mass),
    price: decryptNumber(product.price),
    airTransportRatio: decryptNumber(product.airTransportRatio),
    numberOfReferences: decryptNumber(product.numberOfReferences),
    fading: decryptBoolean(product.fading),
    traceability: decryptBoolean(product.traceability),
    upcycled: decryptBoolean(product.upcycled),
    impression: decryptString(product.impression),
    impressionPercentage: decryptNumber(product.impressionPercentage),
    materials: product.materials.map((material) => ({
      ...material,
      slug: decryptString(material.slug),
      country: material.country ? decryptString(material.country) : undefined,
      share: decryptNumber(material.share),
    })),
    accessories: product.accessories.map((accessory) => ({
      ...accessory,
      slug: decryptString(accessory.slug),
      quantity: decryptNumber(accessory.quantity),
    })),
  }))

export const getProductsToProcess = async (take: number) => {
  const products = await prismaClient.product.findMany({
    where: {
      status: Status.Pending,
    },
    include: {
      materials: true,
      accessories: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take,
  })

  return decryptProduct(products)
}

const productWithScoreSelect = {
  gtin: true,
  brand: true,
  createdAt: true,
  category: true,
  score: { select: { score: true, standardized: true } },
  upload: {
    select: { version: { select: { version: true } }, user: { select: { brand: { select: { name: true } } } } },
  },
} satisfies Prisma.ProductSelect

export const getProductWithScore = async (gtin: string) => {
  const result = await prismaClient.product.findFirst({
    select: productWithScoreSelect,
    where: { gtin },
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
    select: { gtin: true },
    distinct: ["gtin"],
    orderBy: [{ gtin: "asc" }, { createdAt: "desc" }],
    skip,
    take,
  })

  const products = await Promise.all(
    uniqueGtins.map(async ({ gtin }) =>
      prismaClient.product.findFirst({
        where: { gtin, ...where, score: { isNot: null } },
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
    by: ["gtin"],
    where: {
      upload: { userId },
      status: Status.Done,
      brand,
    },
    _count: { gtin: true },
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
    },
  })
  return decryptProduct(products)
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
