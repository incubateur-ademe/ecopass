import { prismaClient } from "./prismaClient"

export const getUserByApiKey = async (apiKey: string) =>
  prismaClient.aPIKey.findUnique({
    where: { key: apiKey },
    select: {
      key: true,
      user: {
        select: {
          id: true,
          email: true,
          organization: {
            select: {
              id: true,
              name: true,
              type: true,
              authorizedBy: {
                select: {
                  from: {
                    select: {
                      id: true,
                      name: true,
                      siret: true,
                      brands: { select: { active: true, id: true, name: true }, where: { active: true } },
                    },
                  },
                },
                where: { active: true },
              },
              brands: { select: { active: true, id: true, name: true, default: true }, where: { active: true } },
            },
          },
        },
      },
    },
  })

export const getUserByEmail = async (email: string) =>
  prismaClient.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
    },
  })

export const getAPIKeys = async (userId: string) => {
  const results = await prismaClient.aPIKey.findMany({
    where: { userId },
  })
  return results.map((result) => ({ ...result, key: result.key.slice(0, 3) }))
}

export const updateAPIUse = async (apiKey: string) =>
  prismaClient.aPIKey.update({
    where: { key: apiKey },
    data: { lastUsed: new Date() },
  })

export const getUserOrganizationType = async (userId: string) => {
  const user = await prismaClient.user.findFirst({
    where: { id: userId },
    select: {
      organization: {
        select: {
          type: true,
        },
      },
    },
  })
  return user?.organization?.type || null
}

export const getUserOrganization = async (userId: string) => {
  const user = await prismaClient.user.findFirst({
    where: { id: userId },
    select: {
      organization: {
        select: {
          id: true,
          name: true,
          displayName: true,
          type: true,
          naf: true,
          siret: true,
          uniqueId: true,
          brands: { select: { id: true, name: true, default: true, active: true } },
          authorizedOrganizations: {
            select: {
              id: true,
              createdAt: true,
              to: { select: { id: true, name: true, siret: true, uniqueId: true } },
            },
            where: { active: true },
            orderBy: { createdAt: "desc" },
          },
          authorizedBy: {
            select: {
              id: true,
              createdAt: true,
              from: {
                select: {
                  id: true,
                  name: true,
                  siret: true,
                  uniqueId: true,
                  brands: { select: { id: true, name: true, default: true, active: true } },
                },
              },
            },
            where: { active: true },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  })
  return user?.organization || null
}

export type UserOrganization = NonNullable<Awaited<ReturnType<typeof getUserOrganization>>>
