import { prismaClient } from "../db/prismaClient"

const email = "todo"
const brandName = ""
const siret = ""

export const createMail = async () => {
  if (!email || !brandName) {
    console.log("Email or brand name is missing")
    return
  }

  const user = await prismaClient.user.findUnique({
    where: { email: email.toLowerCase() },
  })
  if (user) {
    console.log("User alreay exists")
    return
  }

  let brand = await prismaClient.brand.findFirst({
    where: { name: brandName },
  })

  if (!brand) {
    console.log("Brand not found, creating it...")
    brand = await prismaClient.brand.create({
      data: {
        name: brandName,
        siret: siret,
      },
    })
  }

  await prismaClient.account.create({
    data: {
      user: {
        create: {
          email: email.toLowerCase(),
          brandId: brand.id,
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
