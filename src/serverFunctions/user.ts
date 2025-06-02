"use server"

import { prismaClient } from "../db/prismaClient"
import { generateResetToken, signPassword } from "../services/auth/user"

export const resetPassword = async (email: string) => {
  try {
    await generateResetToken(email)
  } catch (error) {
    console.error("Error generating reset token:", error)
  }
}

export const changePassword = async (email: string, token: string, password: string) => {
  const user = await prismaClient.user.findFirst({
    where: {
      email: email.toLowerCase(),
      resetPasswordToken: token,
      resetPasswordExpires: { gte: new Date() },
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
      resetPasswordExpires: null,
    },
  })
}
