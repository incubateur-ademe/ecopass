import { ProductCategory } from "../../types/Product"
import { Products } from "../../db/product"
import { productMapping } from "../../utils/ecobalyse/mappings"

export type CategoryStat = {
  slug: ProductCategory
  label: string
  icon: string
  count: number
}

export const computeCategories = (products: Products): CategoryStat[] =>
  Object.values(
    products.reduce(
      (acc, product) => {
        if (product.informations.length !== 1 || !product.informations[0].categorySlug) {
          return acc
        }

        const slug = product.informations[0].categorySlug as ProductCategory
        const icon = productMapping[slug]

        if (!icon) {
          return acc
        }

        if (!acc[slug]) {
          acc[slug] = {
            slug,
            label: product.informations[0].categorySlug,
            icon,
            count: 0,
          }
        }

        acc[slug].count += 1
        return acc
      },
      {} as Record<ProductCategory, CategoryStat>,
    ),
  ).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

export const getLastDeclarationDate = (products: Products): Date | undefined =>
  products.length > 0
    ? products.reduce(
        (latest, product) => (product.createdAt > latest ? product.createdAt : latest),
        products[0].createdAt,
      )
    : undefined
