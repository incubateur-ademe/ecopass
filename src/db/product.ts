import { Accessory, Material, Prisma, Product, Score, Status } from "../../prisma/src/prisma"
import { ProductWithMaterialsAndAccessories } from "../types/Product"
import { decryptBoolean, decryptNumber, decryptString, encrypt } from "./encryption"
import { prismaClient } from "./prismaClient"

export const createProducts = async (products: ProductWithMaterialsAndAccessories[]) =>
  prismaClient.$transaction(
    async (transaction) => {
      await transaction.product.createMany({
        data: products.map((product) => ({
          ...product,
          accessories: undefined,
          materials: undefined,
          category: encrypt(product.category),
          business: encrypt(product.business),
          countryDyeing: encrypt(product.countryDyeing),
          countryFabric: encrypt(product.countryFabric),
          countryMaking: encrypt(product.countryMaking),
          countrySpinning: encrypt(product.countrySpinning),
          impression: encrypt(product.impression),
          impressionPercentage: encrypt(product.impressionPercentage),
          mass: encrypt(product.mass),
          price: encrypt(product.price),
          airTransportRatio: encrypt(product.airTransportRatio),
          numberOfReferences: encrypt(product.numberOfReferences),
          fading: encrypt(product.fading),
          traceability: encrypt(product.traceability),
          upcycled: encrypt(product.upcycled),
        })),
      })
      await Promise.all([
        transaction.material.createMany({
          data: products.flatMap((product) =>
            product.materials.map((material) => ({
              ...material,
              slug: encrypt(material.slug),
              country: material.country ? encrypt(material.country) : undefined,
              share: encrypt(material.share),
            })),
          ),
        }),
        transaction.accessory.createMany({
          data: products.flatMap((product) =>
            product.accessories.map((accessory) => ({
              ...accessory,
              slug: encrypt(accessory.slug),
              quantity: encrypt(accessory.quantity),
            })),
          ),
        }),
      ])
    },
    { timeout: 60000 },
  )

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

export const getProductsToProcess = async () => {
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
    take: 10,
  })

  return decryptProduct(products)
}

export const getProductWithScore = async (ean: string) =>
  prismaClient.product.findFirst({
    select: {
      ean: true,
      createdAt: true,
      score: { select: { score: true, standardized: true } },
      upload: { select: { version: { select: { version: true } } } },
    },
    where: { ean },
    orderBy: { createdAt: "desc" },
  })

export type ProductWithScore = Exclude<Awaited<ReturnType<typeof getProductWithScore>>, null>

const getProducts = async (where: Pick<Prisma.ProductWhereInput, "upload" | "uploadId">, take?: number) => {
  const products = await prismaClient.product.findMany({
    where: {
      score: { isNot: null },
      ...where,
    },
    select: {
      ean: true,
      createdAt: true,
      score: { select: { score: true, standardized: true } },
    },
    orderBy: [{ ean: "asc" }, { createdAt: "desc" }],
    take,
  })

  const uniqueProducts = new Map<string, (typeof products)[number]>()
  for (const product of products) {
    if (!uniqueProducts.has(product.ean)) {
      uniqueProducts.set(product.ean, product)
    }
  }

  return Array.from(uniqueProducts.values())
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
