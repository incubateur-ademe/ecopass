"use server"

import { prismaClient } from "../db/prismaClient"
import { getUserOrganizationType as getUserOrganizationTypeDB } from "../db/user"
import { auth } from "../services/auth/auth"
import jwt from "jsonwebtoken"
import { generateResetToken, signPassword } from "../services/auth/user"

export const resetPassword = async (email: string) => {
  console.log("[MEMORY][serverFunctions/user/resetPassword][start]", process.memoryUsage())
  try {
    await generateResetToken(email)
  } catch (error) {
    console.error("Error generating reset token:", error)
  }
  console.log("[MEMORY][serverFunctions/user/resetPassword][end]", process.memoryUsage())
}

export const changePassword = async (token: string, password: string) => {
  console.log("[MEMORY][serverFunctions/user/changePassword][start]", process.memoryUsage())
  let decoded: jwt.JwtPayload
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "") as jwt.JwtPayload
  } catch {
    return "Token invalide ou expiré"
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: decoded.email.toLowerCase(),
    },
    include: {
      accounts: {
        where: {
          provider: "credentials",
          resetPasswordToken: decoded.uuid,
        },
      },
    },
  })

  if (!user || user.accounts.length === 0) {
    return "Token invalide ou expiré"
  }

  const hashedPassword = await signPassword(password)

  const result = await prismaClient.account.update({
    where: { id: user.accounts[0].id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
    },
  })
  console.log("[MEMORY][serverFunctions/user/changePassword][end]", process.memoryUsage())
  return result
}

export const generateAPIKey = async (name: string) => {
  console.log("[MEMORY][serverFunctions/user/generateAPIKey][start]", process.memoryUsage())
  const session = await auth()
  if (!session || !session.user) {
    return "Utilisateur non authentifié"
  }

  if (!name) {
    return "Le nom de la clé est requis"
  }

  const { key } = await prismaClient.aPIKey.create({
    data: {
      userId: session.user.id,
      name,
    },
  })
  console.log("[MEMORY][serverFunctions/user/generateAPIKey][end]", process.memoryUsage())
  return key
}

export const deleteAPIKey = async (id: string) =>
  (async () => {
    console.log("[MEMORY][serverFunctions/user/deleteAPIKey][start]", process.memoryUsage())
    const result = await prismaClient.aPIKey.delete({
      where: { id },
    })
    console.log("[MEMORY][serverFunctions/user/deleteAPIKey][end]", process.memoryUsage())
    return result
  })()

export const getUserOrganizationType = async (id?: string) => {
  console.log("[MEMORY][serverFunctions/user/getUserOrganizationType][start]", process.memoryUsage())
  if (!id) {
    return null
  }

  const result = await getUserOrganizationTypeDB(id)
  console.log("[MEMORY][serverFunctions/user/getUserOrganizationType][end]", process.memoryUsage())
  return result
}
