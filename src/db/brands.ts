import { Status } from "../../prisma/src/prisma"
import { prismaClient } from "./prismaClient"
import { getPublicProductsByBrandId, Products } from "./product"

export const getAllBrandsWithStats = async () => {
  const allProducts = await prismaClient.product.findMany({
    where: {
      status: Status.Done,
      brandId: { not: null },
    },
    select: {
      internalReference: true,
      createdAt: true,
      brandId: true,
      brand: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ internalReference: "asc" }, { createdAt: "desc" }],
  })

  const uniqueProducts = []
  let lastInternalReference = null

  for (const product of allProducts) {
    if (product.internalReference !== lastInternalReference) {
      uniqueProducts.push(product)
      lastInternalReference = product.internalReference
    }
  }

  const brandStats = uniqueProducts.reduce(
    (acc, product) => {
      if (!product.brand) {
        return acc
      }

      const brandId = product.brand.id
      if (!acc[brandId]) {
        acc[brandId] = {
          id: product.brand.id,
          name: product.brand.name,
          productCount: 0,
          lastDeclarationDate: product.createdAt,
        }
      }

      acc[brandId].productCount += 1

      if (product.createdAt > acc[brandId].lastDeclarationDate) {
        acc[brandId].lastDeclarationDate = product.createdAt
      }

      return acc
    },
    {} as Record<string, BrandWithStats>,
  )

  return Object.values(brandStats).sort((a, b) => b.lastDeclarationDate.getTime() - a.lastDeclarationDate.getTime())
}

export type BrandWithStats = {
  id: string
  name: string
  productCount: number
  lastDeclarationDate: Date
}

export const getBrandById = async (id: string) =>
  prismaClient.brand.findFirst({
    where: { id, active: true },
    select: { id: true, name: true },
  })

export const getBrandWithProducts = async (
  id: string,
): Promise<{ brand: NonNullable<Awaited<ReturnType<typeof getBrandById>>>; products: Products } | null> => {
  const brand = await getBrandById(id)
  if (!brand) {
    return null
  }

  const products = await getPublicProductsByBrandId(id)

  return { brand, products }
}
