import { prismaClient } from "../db/prismaClient"
import crypto from "crypto"
import { sendWelcomeEmail } from "../services/emails/email"

const main = async (email: string) => {
  const user = await prismaClient.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error("Utilisateur introuvable")
  }

  const resetToken = crypto.randomBytes(32).toString("hex")

  const expires = new Date()
  expires.setHours(expires.getHours() + 24 * 7)

  await prismaClient.user.update({
    where: { email },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: expires,
    },
  })
  await sendWelcomeEmail(email, resetToken)
}

main(process.argv[2])
