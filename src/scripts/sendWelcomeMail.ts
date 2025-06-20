import { v4 as uuid } from "uuid"
import { prismaClient } from "../db/prismaClient"
import jwt from "jsonwebtoken"
import { sendWelcomeEmail } from "../services/emails/email"

const main = async (email: string) => {
  const user = await prismaClient.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { accounts: true },
  })
  if (!user) {
    throw new Error("Utilisateur introuvable")
  }

  const account = user.accounts.find((account) => account.provider === "credentials")
  if (!account) {
    throw new Error("Utilisateur introuvable")
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined")
  }

  const expires = new Date()
  expires.setHours(expires.getHours() + 24 * 7)
  const token = uuid()
  const resetToken = jwt.sign(
    {
      email: email.toLowerCase(),
      uuid: token,
      exp: Math.floor(expires.getTime() / 1000),
    },
    process.env.JWT_SECRET,
  )

  await prismaClient.account.update({
    where: { id: account.id },
    data: {
      resetPasswordToken: token,
    },
  })
  await sendWelcomeEmail(email.toLowerCase(), resetToken)
}

main(process.argv[2])
