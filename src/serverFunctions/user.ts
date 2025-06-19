"use server"

import { prismaClient } from "../db/prismaClient"
import { auth } from "../services/auth/auth"
import { generateResetToken, signPassword } from "../services/auth/user"
import jwt from "jsonwebtoken"

export const resetPassword = async (email: string) => {
  try {
    await generateResetToken(email)
  } catch (error) {
    console.error("Error generating reset token:", error)
  }
}

export const changePassword = async (token: string, password: string) => {
  let decoded: jwt.JwtPayload
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "") as jwt.JwtPayload
  } catch {
    return "Token invalide ou expiré"
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: decoded.email.toLowerCase(),
      resetPasswordToken: decoded.uuid,
    },
  })

  if (!user) {
    return "Token invalide ou expiré"
  }

  const hashedPassword = await signPassword(password)

  await prismaClient.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
    },
  })
}

export const generateAPIKey = async (name: string) => {
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

  return key
}

export const deleteAPIKey = async (id: string) =>
  prismaClient.aPIKey.delete({
    where: { id },
  })
