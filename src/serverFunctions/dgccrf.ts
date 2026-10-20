"use server"

import { Status } from "@prisma/enums"
import { prismaClient } from "../db/prismaClient"

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
