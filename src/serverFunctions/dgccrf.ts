"use server"

import { ConfidenceLevel, Status } from "@prisma/enums"
import { stringify } from "csv-stringify/sync"
import { prismaClient } from "../db/prismaClient"
import { auth } from "../services/auth/auth"
import { canViewAsDgccrf } from "../utils/authorization/authorizations"
import { BATCH_CATEGORY, countProductsByCategory } from "../utils/product/category"
import { ProductCategory } from "../types/Product"

export const exportOrganizationsData = async () => {
  const session = await auth()
  if (!session || !session.user || !canViewAsDgccrf(session.user.role)) {
    return { error: "Unauthorized" }
  }

  const [organizations, products] = await Promise.all([
    prismaClient.organization.findMany({
      select: {
        id: true,
        name: true,
        displayName: true,
        siret: true,
        type: true,
      },
    }),
    prismaClient.product.findMany({
      where: {
        status: Status.Done,
        confidenceLevel: ConfidenceLevel.High,
      },
      select: {
        brandId: true,
        internalReference: true,
        brand: {
          select: {
            organizationId: true,
          },
        },
        informations: {
          select: {
            categorySlug: true,
            mainComponent: true,
          },
        },
      },
      orderBy: [{ brandId: "asc" }, { internalReference: "asc" }, { createdAt: "desc" }],
      distinct: ["brandId", "internalReference"],
    }),
  ])

  const productsByOrganization = new Map<string, typeof products>()

  for (const product of products) {
    const organizationId = product.brand?.organizationId
    if (!organizationId) {
      continue
    }

    if (!productsByOrganization.has(organizationId)) {
      productsByOrganization.set(organizationId, [])
    }
    productsByOrganization.get(organizationId)!.push(product)
  }

  const categories = Object.values(ProductCategory)

  const columns = [
    "Organisation",
    "SIRET organisation",
    "Nb de référence produit déclarées",
    ...categories.map((value) => `Nb de référence ${value}`),
    `Nb de référence ${BATCH_CATEGORY}`,
  ]

  const data = organizations
    .map((org) => {
      const organizationProducts = productsByOrganization.get(org.id) || []
      const productsByCategory = countProductsByCategory(organizationProducts)

      if (organizationProducts.length === 0) {
        return null
      }
      const row: Record<string, string | number> = {
        Organisation: `${org.name}${org.displayName === org.name ? "" : ` (${org.displayName})`}`,
        "SIRET organisation": org.siret || "",
        "Nb de référence produit déclarées": organizationProducts.length,
      }

      for (const value of categories) {
        row[`Nb de référence ${value}`] = productsByCategory.find((catergory) => catergory.slug === value)?.count || 0
      }
      row[`Nb de référence ${BATCH_CATEGORY}`] =
        productsByCategory.find((catergory) => catergory.slug === (BATCH_CATEGORY as ProductCategory))?.count || 0

      return row
    })
    .filter((row) => row !== null)

  return stringify(data, {
    header: true,
    columns,
  })
}

export const searchOrganizationsAndBrands = async (query: string) => {
  console.log(`[searchOrganizationsAndBrands] Starting - query: ${query}`)
  if (!query || query.trim().length === 0) {
    return { organizations: [], brands: [] }
  }

  const searchQuery = query.trim().toLowerCase()
  const searchQueryWithoutSpaces = searchQuery.replace(/\s/g, "")
  const isSiret = /^\d{14}$/.test(searchQueryWithoutSpaces)
  const isSiren = /^\d{9}$/.test(searchQueryWithoutSpaces)

  const [organizations, brands] = await Promise.all([
    prismaClient.organization.findMany({
      where: isSiret
        ? { siret: searchQueryWithoutSpaces }
        : isSiren
          ? { siret: { contains: searchQueryWithoutSpaces } }
          : {
              OR: [
                { name: { contains: searchQuery, mode: "insensitive" } },
                { displayName: { contains: searchQuery, mode: "insensitive" } },
              ],
            },
      select: {
        id: true,
        name: true,
        displayName: true,
        siret: true,
        type: true,
        authorizedBy: {
          select: { id: true },
          where: { active: true },
        },
        brands: {
          select: { id: true },
          where: { active: true },
        },
      },
    }),
    isSiret || isSiren
      ? []
      : prismaClient.brand.findMany({
          where: {
            name: { contains: searchQuery, mode: "insensitive" },
          },
          select: {
            id: true,
            name: true,
          },
        }),
  ])

  const organizationsWithCounts = await Promise.all(
    organizations.map(async (org) => {
      const products = await prismaClient.product.findMany({
        where: {
          status: Status.Done,
          brand: {
            organizationId: org.id,
          },
        },
        select: {
          internalReference: true,
        },
        distinct: ["internalReference"],
      })
      return { ...org, references: products.length }
    }),
  )

  const brandIds = brands.map((b) => b.id)
  const brandReferenceGroups =
    brandIds.length > 0
      ? await prismaClient.product.groupBy({
          by: ["brandId", "internalReference"],
          where: {
            status: Status.Done,
            brandId: { in: brandIds },
          },
        })
      : []
  const brandCountMap = new Map<string, number>()
  for (const group of brandReferenceGroups) {
    if (group.brandId) {
      brandCountMap.set(group.brandId, (brandCountMap.get(group.brandId) ?? 0) + 1)
    }
  }
  const brandsWithCounts = brands.map((brand) => ({
    ...brand,
    references: brandCountMap.get(brand.id) ?? 0,
  }))

  return { organizations: organizationsWithCounts, brands: brandsWithCounts }
}

export type OrganizationAndBrands = Awaited<ReturnType<typeof searchOrganizationsAndBrands>>
