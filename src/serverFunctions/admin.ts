"use server"
import { prismaClient } from "../db/prismaClient"
import { auth } from "../services/auth/auth"
import { OrganizationRole, OrganizationType, UserType } from "@prisma/client"
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"
import { sendWelcomeEmail } from "../services/emails/email"
import { canAccessAdminSpace } from "../utils/authorization/authorizations"

const sendPassword = async (email: string, accountId: string, citoyen?: boolean) => {
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
    where: { id: accountId },
    data: {
      resetPasswordToken: token,
    },
  })

  await sendWelcomeEmail(email.toLowerCase(), resetToken, citoyen)
}

export const createUserAndOrganization = async (
  email: string,
  organizationName: string,
  organizationType: OrganizationType,
) => {
  try {
    const session = await auth()
    if (!session || !session.user || !canAccessAdminSpace(session.user.role)) {
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
          uniqueId: uuid(),
          brands: {
            create: {
              name: organizationName,
              default: true,
            },
          },
        },
      })
    }

    const hasOrganizationAdmin = await prismaClient.user.findFirst({
      where: {
        organizationId: organization.id,
        type: UserType.PROFESSIONNEL,
        organizationRole: OrganizationRole.ADMIN,
      },
      select: { id: true },
    })

    const user = await prismaClient.user.create({
      data: {
        email: email.toLowerCase(),
        organizationId: organization.id,
        type: UserType.PROFESSIONNEL,
        organizationRole: hasOrganizationAdmin ? OrganizationRole.READER : OrganizationRole.ADMIN,
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

    const account = user.accounts.find((acc) => acc.provider === "credentials")
    if (!account) {
      throw new Error("Account not found")
    }
    await sendPassword(email.toLowerCase(), user.accounts[0].id)

    return {
      success: true,
      message: "Utilisateur créé avec succès et email de bienvenue envoyé",
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      error: error instanceof Error ? error.message : "Erreur lors de la création de l'utilisateur",
    }
  }
}

export const createUser = async (email: string) => {
  try {
    const session = await auth()
    if (!session || !session.user || !canAccessAdminSpace(session.user.role)) {
      return { error: "Unauthorized" }
    }

    if (!email) {
      return { error: "Email est requis" }
    }

    const existingUser = await prismaClient.user.findUnique({
      where: { email: email.toLowerCase() },
    })
    if (existingUser) {
      return { error: "Un utilisateur avec cet email existe déjà" }
    }

    const user = await prismaClient.user.create({
      data: {
        email: email.toLowerCase(),
        type: UserType.CITOYEN,
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

    const account = user.accounts.find((acc) => acc.provider === "credentials")
    if (!account) {
      throw new Error("Account not found")
    }
    await sendPassword(email.toLowerCase(), user.accounts[0].id, true)

    return {
      success: true,
      message: "Utilisateur créé avec succès et email de bienvenue envoyé",
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      error: error instanceof Error ? error.message : "Erreur lors de la création de l'utilisateur",
    }
  }
}

export const changeOrganizationSettings = async (
  organizationId: string,
  settings: { type?: OrganizationType; noGTIN?: boolean },
) => {
  const session = await auth()
  if (!session || !session.user || !canAccessAdminSpace(session.user.role)) {
    return { error: "Unauthorized" }
  }

  return prismaClient.organization.update({
    where: { id: organizationId },
    data: {
      type: settings.type,
      noGTIN:
        settings.type === OrganizationType.Brand || settings.type === OrganizationType.BrandAndDistributor
          ? settings.noGTIN
          : false,
    },
  })
}

export const changeOrganizationMemberRole = async (
  organizationId: string,
  memberId: string,
  role: OrganizationRole,
) => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const currentUser = await prismaClient.user.findFirst({
      where: { id: session.user.id, organizationId },
      select: { id: true, organizationId: true, organizationRole: true },
    })

    if (!currentUser || currentUser.organizationRole !== OrganizationRole.ADMIN) {
      return { error: "Unauthorized" }
    }

    const member = await prismaClient.user.findFirst({
      where: { id: memberId, organizationId },
      select: { id: true, organizationId: true, type: true, organizationRole: true },
    })

    if (!member) {
      return { error: "Utilisateur introuvable" }
    }

    if (role === OrganizationRole.READER && member.organizationRole === OrganizationRole.ADMIN) {
      const adminCount = await prismaClient.user.count({
        where: {
          organizationId,
          organizationRole: OrganizationRole.ADMIN,
        },
      })

      if (adminCount <= 1) {
        return { error: "Impossible de retirer le dernier admin de l'organisation" }
      }
    }

    await prismaClient.user.update({
      where: { id: memberId, organizationId },
      data: {
        organizationRole: role,
      },
    })

    return true
  } catch {
    return { error: "Erreur lors de la mise à jour des droits" }
  }
}
