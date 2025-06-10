import { prismaClient } from "../db/prismaClient"

const email = "todo"
const brandName = ""

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
      },
    })
  }

  await prismaClient.user.create({
    data: {
      email: email.toLowerCase(),
      brandId: brand.id,
      password: "",
    },
  })
  console.log("User created")
}

createMail()
