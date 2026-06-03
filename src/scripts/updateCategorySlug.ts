import { prismaClient } from "../db/prismaClient"
import { simplifyValue } from "../utils/parsing/parsing"
import { productCategories } from "../utils/types/productCategory"

const computeCategorySlug = (category: string) => {
  const value = simplifyValue(category)
  return productCategories[value]
}

async function updateCategorySlug() {
  console.log("Starting categorySlug update...")

  const productInformations = await prismaClient.productInformation.findMany({
    where: {
      OR: [{ categorySlug: null }, { categorySlug: "" }],
    },
    select: {
      id: true,
      category: true,
    },
  })

  console.log(`Found ${productInformations.length} ProductInformation records without categorySlug`)

  let updated = 0
  let skipped = 0

  for (const info of productInformations) {
    const categorySlug = computeCategorySlug(info.category)

    if (categorySlug) {
      await prismaClient.productInformation.update({
        where: { id: info.id },
        data: { categorySlug },
      })
      updated++
    } else {
      console.log(`Skipping id ${info.id}: no mapping found for category "${info.category}"`)
      skipped++
    }

    if ((updated + skipped) % 100 === 0) {
      console.log(`Progress: ${updated} updated, ${skipped} skipped`)
    }
  }

  console.log(`Done! Updated: ${updated}, Skipped: ${skipped}`)
}

updateCategorySlug()
  .catch((error) => {
    console.error("Error updating categorySlug:", error)
    process.exit(1)
  })
  .finally(() => {
    prismaClient.$disconnect()
  })
