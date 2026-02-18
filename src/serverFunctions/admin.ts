"use server"

import { prismaClient } from "../db/prismaClient"
import { auth } from "../services/auth/auth"
import { UserRole } from "@prisma/enums"
import { OrganizationType } from "@prisma/client"
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"
import { sendWelcomeEmail } from "../services/emails/email"

export const createUserAndOrganization = async (
  email: string,
  organizationName: string,
  organizationType: OrganizationType,
) => {
  try {
    const session = await auth()
    if (!session || !session.user || session.user.role !== UserRole.ADMIN) {
      return { error: "Unauthorized" }
    }

    if (!email || !organizationName) {
      return { error: "Email et nom d'organisation sont requis" }
    }

    const validTypes = Object.values(OrganizationType)
    if (!validTypes.includes(organizationType)) {
      return { error: "Type d'organisation invalide" }
    }

    const existingUser = await prismaClient.user.findUnique({
      where: { email: email.toLowerCase() },
    })
    if (existingUser) {
      return { error: "Un utilisateur avec cet email existe déjà" }
    }

    let organization = await prismaClient.organization.findFirst({
      where: { name: organizationName },
    })
    if (!organization) {
      organization = await prismaClient.organization.create({
        data: {
          name: organizationName,
          displayName: organizationName,
          type: organizationType,
          brands: {
            create: {
              name: organizationName,
              default: true,
            },
          },
        },
      })
    }

    const user = await prismaClient.user.create({
      data: {
        email: email.toLowerCase(),
        organizationId: organization.id,
        accounts: {
          create: {
            provider: "credentials",
            providerAccountId: email.toLowerCase(),
            type: "credentials",
            password: "",
          },
        },
      },
      include: {
        accounts: true,
      },
    })

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined")
    }

    const account = user.accounts.find((acc) => acc.provider === "credentials")
    if (!account) {
      throw new Error("Account not found")
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

    return {
      success: true,
      message: "Utilisateur créé avec succès et email de bienvenue envoyé",
      user: {
        id: user.id,
        email: user.email,
        organizationId: organization.id,
      },
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      error: error instanceof Error ? error.message : "Erreur lors de la création de l'utilisateur",
    }
  }
}
