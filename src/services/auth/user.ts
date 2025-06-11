import { v4 as uuid } from "uuid"
import { prismaClient } from "../../db/prismaClient"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendResetEmail } from "../emails/email"

export const signPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hashSync(password, salt)
}

export const generateResetToken = async (email: string) => {
  const user = await prismaClient.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) {
    throw new Error("Utilisateur introuvable")
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined")
  }

  const expires = new Date()
  expires.setHours(expires.getHours() + 2)
  const token = uuid()
  const resetToken = jwt.sign(
    {
      email: email.toLowerCase(),
      uuid: token,
      exp: Math.floor(expires.getTime() / 1000),
    },
    process.env.JWT_SECRET,
  )

  await prismaClient.user.update({
    where: { email: email.toLowerCase() },
    data: {
      resetPasswordToken: token,
    },
  })
  await sendResetEmail(email, resetToken)
}
