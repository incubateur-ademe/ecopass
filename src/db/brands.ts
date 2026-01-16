import { Status } from "@prisma/enums"
import { prismaClient } from "./prismaClient"
import { ProductCategory } from "../types/Product"
import { productMapping } from "../utils/ecobalyse/mappings"

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

  const uniqueGtins = await prismaClient.product.findMany({
    where: {
      status: Status.Done,
      brandId: id,
    },
    select: { id: true },
    distinct: ["internalReference"],
    orderBy: [{ createdAt: "desc" }, { internalReference: "asc" }],
  })

  const products = await prismaClient.product.findMany({
    where: { id: { in: uniqueGtins.map((p) => p.id) }, brandId: id, status: Status.Done },
    select: { informations: { select: { categorySlug: true } } },
    orderBy: { createdAt: "desc" },
  })
  return {
    ...brand,
    productsByCategory: Object.values(
      products
        .filter((product) => product !== null)
        .reduce(
          (acc, product) => {
            if (product.informations.length !== 1 || !product.informations[0].categorySlug) {
              return acc
            }

            const slug = product.informations[0].categorySlug as ProductCategory
            const icon = productMapping[slug]

            if (!icon) {
              return acc
            }

            if (!acc[slug]) {
              acc[slug] = {
                slug,
                count: 0,
              }
            }

            acc[slug].count += 1
            return acc
          },
          {} as Record<
            ProductCategory,
            {
              slug: ProductCategory
              count: number
            }
          >,
        ),
    ).sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug)),
  }
}

export type BrandInformation = NonNullable<Awaited<ReturnType<typeof getBrandWithProducts>>>
