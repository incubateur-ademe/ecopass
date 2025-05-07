import { Prisma, Status } from "../../prisma/src/prisma"
import {
  AccessoryType,
  Business,
  Country,
  MaterialType,
  ProductType,
  ProductWithMaterialsAndAccessories,
} from "../types/Product"
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
          type: encrypt(product.type),
          business: encrypt(product.business),
          countryDyeing: encrypt(product.countryDyeing),
          countryFabric: encrypt(product.countryFabric),
          countryMaking: encrypt(product.countryMaking),
          countrySpinning: encrypt(product.countrySpinning),
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

export const getProductsToProcess = async (): Promise<ProductWithMaterialsAndAccessories[]> => {
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

  return products.map((product) => ({
    ...product,
    type: decryptString<ProductType>(product.type),
    business: decryptString<Business>(product.business),
    countryDyeing: decryptString<Country>(product.countryDyeing),
    countryFabric: decryptString<Country>(product.countryFabric),
    countryMaking: decryptString<Country>(product.countryMaking),
    countrySpinning: decryptString<Country>(product.countrySpinning),
    mass: decryptNumber(product.mass),
    price: decryptNumber(product.price),
    airTransportRatio: decryptNumber(product.airTransportRatio),
    numberOfReferences: decryptNumber(product.numberOfReferences),
    fading: decryptBoolean(product.fading),
    traceability: decryptBoolean(product.traceability),
    upcycled: decryptBoolean(product.upcycled),
    materials: product.materials.map((material) => ({
      ...material,
      slug: decryptString<MaterialType>(material.slug),
      country: material.country ? decryptString<Country>(material.country) : undefined,
      share: decryptNumber(material.share),
    })),
    accessories: product.accessories.map((accessory) => ({
      ...accessory,
      slug: decryptString<AccessoryType>(accessory.slug),
      quantity: decryptNumber(accessory.quantity),
    })),
  }))
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

export const getProductsByUploadId = async (uploadId: string) => getProducts({ uploadId })
