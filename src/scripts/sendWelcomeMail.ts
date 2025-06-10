import { prismaClient } from "../db/prismaClient"
import jwt from "jsonwebtoken"
import { sendWelcomeEmail } from "../services/emails/email"

const main = async (email: string) => {
  const user = await prismaClient.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) {
    throw new Error("Utilisateur introuvable")
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined")
  }

  const expires = new Date()
  expires.setHours(expires.getHours() + 24 * 7)

  const resetToken = jwt.sign(
    {
      email: email.toLowerCase(),
      exp: Math.floor(expires.getTime() / 1000),
    },
    process.env.JWT_SECRET,
  )

  await prismaClient.user.update({
    where: { email: email.toLowerCase() },
    data: {
      resetPasswordToken: resetToken,
    },
  })
  await sendWelcomeEmail(email.toLowerCase(), resetToken)
}

main(process.argv[2])
