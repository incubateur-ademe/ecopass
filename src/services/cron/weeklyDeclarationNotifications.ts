import { ConfidenceLevel, OrganizationRole, Status, UserType } from "@prisma/enums"
import { prismaClient } from "../../db/prismaClient"
import { sendWeeklyDeclarationChangedEmail, sendWeeklyDeclarationAlertToOwnerAdmins } from "../emails/email"

type DeclarationItem = {
  productId: string
  gtin: string
  internalReference: string
  confidenceLevel: ConfidenceLevel
  declaredAt: Date
}

type Declarant = {
  userId: string
  email: string
  type: UserType
  organizationId: string | null
}

const getWeekWindow = (now: Date) => {
  const end = new Date(now)
  end.setUTCHours(0, 0, 0, 0)

  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - 7)

  return { start, end }
}

const getProductsDoneDuringPeriod = async (start: Date, end: Date) =>
  prismaClient.product.findMany({
    where: {
      status: Status.Done,
      createdAt: {
        gte: start,
        lt: end,
      },
    },
    select: {
      id: true,
      createdAt: true,
      confidenceLevel: true,
      internalReference: true,
      gtins: true,
      upload: {
        select: {
          organizationId: true,
          createdBy: {
            select: {
              id: true,
              email: true,
              type: true,
              organizationId: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  })

const getOwnerOrganizationByGtin = async (gtins: string[]) => {
  const gtinPrefixes = gtins
    .filter((gtin) => /^\d{6,}$/.test(gtin))
    .map((gtin) => gtin.slice(0, 6))
    .filter((prefix, index, prefixes) => prefixes.indexOf(prefix) === index)

  if (gtinPrefixes.length === 0) {
    return new Map<string, string>()
  }

  const prefixes = await prismaClient.gTINPrefix.findMany({
    where: {
      prefix: { in: gtinPrefixes },
      organizationId: { not: null },
    },
    select: {
      prefix: true,
      organizationId: true,
    },
  })

  const organizationByPrefix = new Map(
    prefixes
      .filter((prefix) => prefix.organizationId)
      .map((prefix) => [prefix.prefix, prefix.organizationId as string]),
  )

  const ownerByGtin = new Map<string, string>()
  for (const gtin of gtins) {
    if (!/^\d{6,}$/.test(gtin)) {
      continue
    }
    const owner = organizationByPrefix.get(gtin.slice(0, 6))
    if (owner) {
      ownerByGtin.set(gtin, owner)
    }
  }

  return ownerByGtin
}

const getAdminEmailsByOrganization = async (organizationIds: string[]) => {
  if (organizationIds.length === 0) {
    return new Map<string, string[]>()
  }

  const admins = await prismaClient.user.findMany({
    where: {
      organizationId: { in: organizationIds },
      type: UserType.PROFESSIONNEL,
      organizationRole: OrganizationRole.ADMIN,
    },
    select: {
      email: true,
      organizationId: true,
    },
  })

  const result = new Map<string, string[]>()
  for (const admin of admins) {
    if (!admin.organizationId) {
      continue
    }
    const existing = result.get(admin.organizationId) || []
    existing.push(admin.email)
    result.set(admin.organizationId, existing)
  }

  return new Map(
    Array.from(result.entries()).map(([organizationId, emails]) => [
      organizationId,
      emails
        .map((email) => email.toLowerCase())
        .filter((email, index, list) => list.findIndex((entry) => entry === email) === index),
    ]),
  )
}

const getPreviousDeclarantsByGtin = async (gtins: string[], before: Date) => {
  if (gtins.length === 0) {
    return new Map<string, Declarant[]>()
  }

  const previousProducts = await prismaClient.product.findMany({
    where: {
      status: Status.Done,
      gtins: { hasSome: gtins },
      createdAt: { lt: before },
    },
    select: {
      createdAt: true,
      gtins: true,
      upload: {
        select: {
          organizationId: true,
          createdBy: {
            select: {
              id: true,
              email: true,
              type: true,
              organizationId: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const byGtin = new Map<string, Declarant[]>()

  for (const gtin of gtins) {
    const matching = previousProducts.filter((product) => product.gtins.includes(gtin))
    const declarants = matching
      .map((product) => ({
        userId: product.upload.createdBy.id,
        email: product.upload.createdBy.email,
        type: product.upload.createdBy.type,
        organizationId: product.upload.organizationId ?? product.upload.createdBy.organizationId,
      }))
      .filter(
        (declarant, index, declarants) =>
          declarants.findIndex((item) =>
            declarant.type === UserType.CITOYEN
              ? item.type === UserType.CITOYEN && item.userId === declarant.userId
              : item.type !== UserType.CITOYEN && item.organizationId === declarant.organizationId,
          ) === index,
      )

    byGtin.set(gtin, declarants)
  }

  return byGtin
}

export const runWeeklyDeclarationNotifications = async (date: Date) => {
  const { start, end } = getWeekWindow(date)

  const weeklyProducts = await getProductsDoneDuringPeriod(start, end)
  if (weeklyProducts.length === 0) {
    return {
      period: { start, end },
      weeklyProducts: 0,
      ownerAlerts: 0,
      changedNotifications: 0,
    }
  }

  const allNotHighGtins = weeklyProducts
    .filter((product) => product.confidenceLevel !== ConfidenceLevel.High)
    .flatMap((product) => product.gtins)
    .filter((gtin, index, gtins) => Boolean(gtin) && gtins.indexOf(gtin) === index)

  const ownerByGtin = await getOwnerOrganizationByGtin(allNotHighGtins)
  const ownerAlertsByOrganization = new Map<string, DeclarationItem[]>()

  const changedForCitizen = new Map<string, DeclarationItem[]>()
  const changedForOrganization = new Map<string, DeclarationItem[]>()

  const relatedOrganizationIds = new Set<string>()

  for (const product of weeklyProducts) {
    const previousByGtin = await getPreviousDeclarantsByGtin(product.gtins, product.createdAt)

    for (const gtin of product.gtins) {
      const item = {
        productId: product.id,
        gtin,
        internalReference: product.internalReference,
        confidenceLevel: product.confidenceLevel,
        declaredAt: product.createdAt,
      }

      if (product.confidenceLevel !== ConfidenceLevel.High) {
        const ownerOrganizationId = ownerByGtin.get(gtin)
        if (ownerOrganizationId) {
          const existing = ownerAlertsByOrganization.get(ownerOrganizationId) || []
          ownerAlertsByOrganization.set(ownerOrganizationId, [...existing, item])
          relatedOrganizationIds.add(ownerOrganizationId)
        }
      }

      const previousDeclarants = previousByGtin.get(gtin) || []
      for (const declarant of previousDeclarants) {
        if (declarant.type === UserType.CITOYEN) {
          const existing = changedForCitizen.get(declarant.email.toLowerCase()) || []
          changedForCitizen.set(declarant.email.toLowerCase(), [...existing, item])
          continue
        }

        if (declarant.organizationId) {
          const existing = changedForOrganization.get(declarant.organizationId) || []
          changedForOrganization.set(declarant.organizationId, [...existing, item])
          relatedOrganizationIds.add(declarant.organizationId)
        }
      }
    }
  }

  const adminEmailsByOrganization = await getAdminEmailsByOrganization(Array.from(relatedOrganizationIds))

  let ownerAlertsCount = 0
  for (const [organizationId, items] of ownerAlertsByOrganization.entries()) {
    const emails = adminEmailsByOrganization.get(organizationId)
    if (!emails || emails.length === 0) {
      continue
    }

    await sendWeeklyDeclarationAlertToOwnerAdmins(
      emails,
      items.filter(
        (item, index, arr) =>
          arr.findIndex((entry) => entry.productId === item.productId && entry.gtin === item.gtin) === index,
      ),
      start,
      end,
    )
    ownerAlertsCount += 1
  }

  let changedNotificationsCount = 0

  for (const [email, items] of changedForCitizen.entries()) {
    await sendWeeklyDeclarationChangedEmail(
      [email],
      items.filter(
        (item, index, arr) =>
          arr.findIndex((entry) => entry.productId === item.productId && entry.gtin === item.gtin) === index,
      ),
      start,
      end,
    )
    changedNotificationsCount += 1
  }

  for (const [organizationId, items] of changedForOrganization.entries()) {
    const emails = adminEmailsByOrganization.get(organizationId) || []
    if (emails.length === 0) {
      continue
    }

    await sendWeeklyDeclarationChangedEmail(
      emails,
      items.filter(
        (item, index, arr) =>
          arr.findIndex((entry) => entry.productId === item.productId && entry.gtin === item.gtin) === index,
      ),
      start,
      end,
    )
    changedNotificationsCount += 1
  }

  return {
    period: { start, end },
    weeklyProducts: weeklyProducts.length,
    ownerAlerts: ownerAlertsCount,
    changedNotifications: changedNotificationsCount,
  }
}
