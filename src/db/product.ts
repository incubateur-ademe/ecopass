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

export const getProductWithScore = async (gtin: string) => {
  const result = await prismaClient.product.findFirst({
    select: {
      gtin: true,
      brand: true,
      createdAt: true,
      category: true,
      score: { select: { score: true, standardized: true } },
      upload: {
        select: { version: { select: { version: true } }, user: { select: { brand: { select: { name: true } } } } },
      },
    },
    where: { gtin },
    orderBy: { createdAt: "desc" },
  })
  if (result) {
    return { ...result, category: decryptString(result.category) }
  }
  return null
}

export type ProductWithScore = Exclude<Awaited<ReturnType<typeof getProductWithScore>>, null>

const getProducts = async (where: Pick<Prisma.ProductWhereInput, "upload" | "uploadId">, take?: number) => {
  const products = await prismaClient.product.findMany({
    where: {
      score: { isNot: null },
      ...where,
    },
    select: {
      gtin: true,
      createdAt: true,
      category: true,
      score: { select: { score: true, standardized: true } },
    },
    orderBy: [{ gtin: "asc" }, { createdAt: "desc" }],
    take,
  })

  const uniqueProducts = new Map<string, (typeof products)[number]>()
  for (const product of products) {
    if (!uniqueProducts.has(product.gtin)) {
      uniqueProducts.set(product.gtin, product)
    }
  }

  return Array.from(
    uniqueProducts.values().map((product) => ({
      ...product,
      category: decryptString(product.category),
    })),
  )
}

export const getProductsCountByUserId = async (userId: string) => {
  const result = await prismaClient.product.groupBy({
    by: ["gtin"],
    where: {
      upload: { userId },
      status: Status.Done,
    },
    _count: { gtin: true },
  })
  return result.length
}

export const getProductsByUserId = async (userId: string) => getProducts({ upload: { userId } }, 10)

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
