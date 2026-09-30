"use server"

import { prismaClient } from "../db/prismaClient"
import { getUserOrganizationType as getUserOrganizationTypeDB } from "../db/user"
import { auth } from "../services/auth/auth"
import jwt from "jsonwebtoken"
import { generateResetToken, signPassword } from "../services/auth/user"

export const resetPassword = async (email: string) => {
  console.log(`[resetPassword] Starting - email: ${email}`)
  try {
    await generateResetToken(email)
    console.log(`[resetPassword] Completed - email: ${email}`)
  } catch (error) {
    console.error(`[resetPassword] Error - email: ${email}:`, error)
  }
}

export const changePassword = async (token: string, password: string) => {
  console.log(`[changePassword] Starting`)
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

  await prismaClient.account.update({
    where: { id: user.accounts[0].id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
    },
  })
  console.log(`[changePassword] Completed`)
}

export const generateAPIKey = async (name: string) => {
  console.log(`[generateAPIKey] Starting - name: ${name}`)
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
  console.log(`[generateAPIKey] Completed - key: ${key}`)
  return key
}

export const deleteAPIKey = async (id: string) => {
  console.log(`[deleteAPIKey] Starting - id: ${id}`)
  const result = await prismaClient.aPIKey.delete({
    where: { id },
  })
  console.log(`[deleteAPIKey] Completed - id: ${id}`)
  return result
}

export const getUserOrganizationType = async (id?: string) => {
  if (!id) {
    return null
  }

  return getUserOrganizationTypeDB(id)
}
