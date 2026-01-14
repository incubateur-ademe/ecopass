import { Status } from "@prisma/enums"
import { prismaClient } from "./prismaClient"
import { getPublicProductsByBrandId } from "./product"

export const getAllBrandsWithStats = async () => {
  const allProducts = await prismaClient.product.findMany({
    where: {
      status: Status.Done,
      brandId: { not: null },
    },
    orderBy: { createdAt: "desc" },
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
  })

  const uniqueProducts = [] as typeof allProducts
  const seen = new Set<string>()

  for (const product of allProducts) {
    const key = `${product.brandId}:${product.internalReference}`
    if (!seen.has(key)) {
      uniqueProducts.push(product)
      seen.add(key)
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
    where: { id },
    select: { id: true, name: true },
  })

export const getBrandWithProducts = async (id: string) => {
  const brand = await getBrandById(id)
  if (!brand) {
    return null
  }

  const products = await getPublicProductsByBrandId(id)

  return { brand, products }
}
