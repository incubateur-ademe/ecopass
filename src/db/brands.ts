import { Status } from "@prisma/enums"
import { prismaClient } from "./prismaClient"
import { ProductCategory } from "../types/Product"
import { getProductCategory } from "../utils/product/category"

export const getAllBrandsWithStats = async () => {
  const brands = await prismaClient.brand.findMany({
    select: {
      id: true,
      name: true,
      product: {
        select: {
          internalReference: true,
          createdAt: true,
          brandId: true,
        },
        where: { status: Status.Done },
        orderBy: [{ createdAt: "desc" }],
      },
    },
  })
  const uniqueProducts = [] as ((typeof brands)[0]["product"][0] & { brand: { id: string; name: string } })[]
  const seen = new Set<string>()

  brands.forEach((brand) => {
    brand.product.forEach((product) => {
      const key = `${brand.id}:${product.internalReference}`
      if (!seen.has(key)) {
        uniqueProducts.push({ ...product, brand: { id: brand.id, name: brand.name } })
        seen.add(key)
      }
    })
  })

  const brandStats = uniqueProducts.reduce(
    (acc, product) => {
      if (!product.brandId) {
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
      if (acc[brandId].lastDeclarationDate && product.createdAt > acc[brandId].lastDeclarationDate) {
        acc[brandId].lastDeclarationDate = product.createdAt
      }

      return acc
    },
    {} as Record<string, BrandWithStats>,
  )

  return brands
    .map((brand) => {
      const brandWithStat = brandStats[brand.id]
      if (brandWithStat) {
        return brandWithStat
      }

      return {
        id: brand.id,
        name: brand.name,
        productCount: 0,
        lastDeclarationDate: null,
      }
    })
    .sort(
      (a, b) =>
        (b.lastDeclarationDate?.getTime() || 0) - (a.lastDeclarationDate?.getTime() || 0) ||
        a.name.localeCompare(b.name),
    )
}

export type BrandWithStats = {
  id: string
  name: string
  productCount: number
  lastDeclarationDate: Date | null
}

export const getBrandsByIds = async (ids: string[]) =>
  ids.length > 0
    ? prismaClient.brand.findMany({
        where: { id: { in: ids } },
        select: {
          id: true,
          organization: {
            select: {
              id: true,
              siret: true,
              uniqueId: true,
              noGTIN: true,
            },
          },
        },
      })
    : []

export const getBrandById = async (id: string) =>
  prismaClient.brand.findFirst({
    where: { id },
    select: {
      id: true,
      name: true,
      organization: {
        select: {
          id: true,
          displayName: true,
          noGTIN: true,
          siret: true,
          uniqueId: true,
          authorizedOrganizations: {
            select: { to: { select: { id: true, displayName: true } } },
            where: { active: true },
          },
        },
      },
    },
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
    select: { informations: { select: { categorySlug: true, mainComponent: true } } },
    orderBy: { createdAt: "desc" },
  })
  return {
    ...brand,
    productsByCategory: Object.values(
      products
        .filter((product) => product !== null)
        .reduce(
          (acc, product) => {
            const slug = getProductCategory(product.informations) as ProductCategory | null
            if (slug === null) {
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
