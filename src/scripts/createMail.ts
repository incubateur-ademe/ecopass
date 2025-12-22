import { prismaClient } from "../db/prismaClient"

const email = "todo"
const organizationName = ""
const siret = ""

export const createMail = async () => {
  if (!email || !organizationName) {
    console.log("Email or organization name is missing")
    return
  }

  const user = await prismaClient.user.findUnique({
    where: { email: email.toLowerCase() },
  })
  if (user) {
    console.log("User alreay exists")
    return
  }

  let organization = await prismaClient.organization.findFirst({
    where: { name: organizationName },
  })

  if (!organization) {
    console.log("Organization not found, creating it...")
    organization = await prismaClient.organization.create({
      data: {
        name: organizationName,
        siret: siret,
      },
    })
  }

  await prismaClient.account.create({
    data: {
      user: {
        create: {
          email: email.toLowerCase(),
          organizationId: organization.id,
        },
      },
      provider: "credentials",
      providerAccountId: email.toLowerCase(),
      type: "credentials",
      password: "",
    },
  })
  console.log("User created")
}

createMail()
