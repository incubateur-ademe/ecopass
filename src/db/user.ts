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
              authorizedBy: {
                select: {
                  from: { select: { id: true, name: true, siret: true, brands: { select: { id: true, name: true } } } },
                },
              },
              brands: { select: { name: true } },
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

export const getUserOrganization = async (userId: string) => {
  const user = await prismaClient.user.findFirst({
    where: { id: userId },
    select: {
      organization: {
        select: {
          id: true,
          name: true,
          brands: { select: { id: true, name: true } },
          authorizedOrganizations: {
            select: {
              id: true,
              createdAt: true,
              to: { select: { id: true, name: true, siret: true, brands: { select: { id: true, name: true } } } },
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

export type UserOrganization = Exclude<Awaited<ReturnType<typeof getUserOrganization>>, null>
