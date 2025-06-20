import { prismaClient } from "./prismaClient"

export const getUserByApiKey = async (apiKey: string) =>
  prismaClient.aPIKey.findUnique({
    where: { key: apiKey },
    select: { key: true, user: { select: { id: true, email: true, brand: { select: { id: true, name: true } } } } },
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
