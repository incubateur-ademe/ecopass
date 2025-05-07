import crypto from "crypto"
import { prismaClient } from "../../db/prismaClient"
import bcrypt from "bcrypt"
import { sendResetEmail } from "../emails/email"

export const signPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hashSync(password, salt)
}

export const generateResetToken = async (email: string, hours?: number) => {
  const user = await prismaClient.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error("Utilisateur introuvable")
  }

  const resetToken = crypto.randomBytes(32).toString("hex")

  const expires = new Date()
  expires.setHours(expires.getHours() + (hours || 1))

  await prismaClient.user.update({
    where: { email },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: expires,
    },
  })
  await sendResetEmail(email, resetToken)
}
