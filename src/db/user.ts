import { prismaClient } from "./prismaClient"

export const getUserByApiKey = async (apiKey: string) =>
  prismaClient.user.findUnique({
    where: { apiKey },
    select: { id: true, email: true, apiKey: true },
  })

export const getUserByEmail = async (email: string) =>
  prismaClient.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      apiKey: true,
    },
  })
