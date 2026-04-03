import { Status } from "@prisma/enums"
import { getSiretInfo } from "../serverFunctions/siret"
import { organizationTypeByNaf } from "../utils/admin/nafs"
import { prismaClient } from "./prismaClient"

export const createOrganization = async (siret: string) => {
  const result = await getSiretInfo(siret)
  if (!result) {
    throw new Error("Failed to fetch SIRET information from API")
  }
  const type = organizationTypeByNaf[result.etablissement.uniteLegale.activitePrincipaleUniteLegale]

  return prismaClient.organization.create({
    data: {
      siret: siret,
      name: result.etablissement.uniteLegale.denominationUniteLegale,
      displayName: result.etablissement.uniteLegale.denominationUniteLegale,
      effectif: result.etablissement.uniteLegale.trancheEffectifsUniteLegale,
      naf: result.etablissement.uniteLegale.activitePrincipaleUniteLegale,
      type,
      brands: {
        create: {
          name: result.etablissement.uniteLegale.denominationUniteLegale,
          default: true,
        },
      },
    },
  })
}

export const getUserOrganizationType = async (organizationId: string) =>
  prismaClient.organization
    .findUnique({
      where: { id: organizationId },
      select: { type: true },
    })
    .then((org) => org?.type || null)

export const getOrganizationById = async (organizationId: string) => {
  const organization = await prismaClient.organization.findUnique({
    select: {
      id: true,
      siret: true,
      name: true,
      displayName: true,
      noGTIN: true,
      type: true,
      brands: {
        select: {
          id: true,
          name: true,
          active: true,
        },
      },
      authorizedBy: {
        select: {
          active: true,
          from: {
            select: {
              id: true,
              name: true,
              displayName: true,
              siret: true,
              brands: {
                select: {
                  id: true,
                  name: true,
                  active: true,
                },
              },
            },
          },
        },
      },
      authorizedOrganizations: {
        select: {
          active: true,
          to: {
            select: {
              id: true,
              name: true,
              displayName: true,
              siret: true,
            },
          },
        },
      },
    },
    where: { id: organizationId },
  })

  if (!organization) {
    return null
  }

  const brandsWithReferences = await Promise.all(
    organization.brands.map(async (brand) => {
      const [products, lastProduct] = await Promise.all([
        prismaClient.product.findMany({
          where: {
            status: Status.Done,
            brandId: brand.id,
          },
          select: {
            internalReference: true,
          },
          distinct: ["internalReference"],
        }),
        prismaClient.product.findFirst({
          where: {
            status: Status.Done,
            brandId: brand.id,
          },
          select: {
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ])
      return { ...brand, references: products.length, lastDeclaration: lastProduct?.createdAt || null }
    }),
  )

  const authorizedByWithReferences = await Promise.all(
    organization.authorizedBy.map(async (auth) => {
      const brands = await Promise.all(
        auth.from.brands.map(async (brand) => {
          const [products, lastProduct] = await Promise.all([
            prismaClient.product.findMany({
              where: {
                status: Status.Done,
                brandId: brand.id,
              },
              select: {
                internalReference: true,
              },
              distinct: ["internalReference"],
            }),
            prismaClient.product.findFirst({
              where: {
                status: Status.Done,
                brandId: brand.id,
              },
              select: {
                createdAt: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            }),
          ])
          return { ...brand, references: products.length, lastDeclaration: lastProduct?.createdAt || null }
        }),
      )

      const [products, lastProduct] = await Promise.all([
        prismaClient.product.findMany({
          where: {
            status: Status.Done,
            brandId: { in: auth.from.brands.map((b) => b.id) },
          },
          select: {
            internalReference: true,
          },
          distinct: ["internalReference"],
        }),
        prismaClient.product.findFirst({
          where: {
            status: Status.Done,
            brandId: { in: auth.from.brands.map((b) => b.id) },
          },
          select: {
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ])
      return {
        ...auth,
        from: { ...auth.from, brands },
        references: products.length,
        lastDeclaration: lastProduct?.createdAt || null,
      }
    }),
  )

  const authorizedOrganizationsWithReferences = await Promise.all(
    organization.authorizedOrganizations.map(async (auth) => {
      const [products, lastProduct] = await Promise.all([
        prismaClient.product.findMany({
          where: {
            status: Status.Done,
            upload: {
              organizationId: auth.to.id,
            },
            brandId: { in: organization.brands.map((b) => b.id) },
          },
          select: {
            internalReference: true,
          },
          distinct: ["internalReference"],
        }),
        prismaClient.product.findFirst({
          where: {
            status: Status.Done,
            upload: {
              organizationId: auth.to.id,
            },
            brandId: { in: organization.brands.map((b) => b.id) },
          },
          select: {
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ])
      return { ...auth, references: products.length, lastDeclaration: lastProduct?.createdAt || null }
    }),
  )

  return {
    ...organization,
    brands: brandsWithReferences,
    authorizedBy: authorizedByWithReferences,
    authorizedOrganizations: authorizedOrganizationsWithReferences,
  }
}

export type Organization = NonNullable<Awaited<ReturnType<typeof getOrganizationById>>>
