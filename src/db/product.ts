import { Accessory, Material, Prisma, Product, ProductInformation, Status, UploadType } from "../../prisma/src/prisma"
import { ParsedProductValidation } from "../services/validation/product"
import { ProductCategory } from "../types/Product"
import { decryptProductFields } from "../utils/encryption/encryption"
import { simplifyValue } from "../utils/parsing/parsing"
import { BATCH_CATEGORY, productCategories } from "../utils/types/productCategory"
import { prismaClient } from "./prismaClient"

export const createProducts = async ({
  products,
  materials,
  accessories,
  informations,
}: {
  products: Product[]
  materials: Material[]
  accessories: Accessory[]
  informations: (ProductInformation & { materials: undefined; accessories: undefined })[]
}) => {
  return prismaClient.$transaction(
    async (transaction) => {
      const productsToCreate = []
      const ids = new Set<string>()

      for (const product of products) {
        const lastVersion = await getLastProductByGtin(product.gtins[0])

        if (lastVersion && lastVersion.hash === product.hash) {
          await prismaClient.uploadProduct.create({
            data: {
              productId: lastVersion.id,
              uploadId: product.uploadId,
              uploadOrder: product.uploadOrder || 0,
            },
          })
          continue
        } else {
          productsToCreate.push(product)
          ids.add(product.id)
        }
      }

      if (productsToCreate.length > 0) {
        await transaction.product.createMany({
          data: productsToCreate,
        })

        const informationsToCreate = informations.filter((i) => i.productId && ids.has(i.productId))
        const informationsIds = new Set<string>(informationsToCreate.map((i) => i.id))

        const materialsToCreate = materials.filter((m) => m.productId && informationsIds.has(m.productId))
        const accessoriesToCreate = accessories.filter((a) => a.productId && informationsIds.has(a.productId))

        await transaction.productInformation.createMany({
          data: informationsToCreate,
        })

        await Promise.all([
          materialsToCreate.length > 0
            ? transaction.material.createMany({
                data: materialsToCreate,
              })
            : Promise.resolve(),
          accessoriesToCreate.length > 0
            ? transaction.accessory.createMany({
                data: accessoriesToCreate,
              })
            : Promise.resolve(),
        ])
      }
      return productsToCreate.length
    },
    { timeout: 180000 },
  )
}

export const createProductScore = async (
  score: Omit<Prisma.ScoreCreateInput, "standardized">,
  product: ParsedProductValidation,
) =>
  prismaClient.$transaction(async (transaction) =>
    Promise.all([
      transaction.product.update({
        where: { id: product.productId },
        data: {
          status: Status.Done,
          score: score.score,
          standardized: (score.score / product.mass) * 0.1,
        },
      }),
      transaction.score.create({
        data: {
          ...score,
          product: { connect: { id: product.id } },
          standardized: (score.score / product.mass) * 0.1,
        },
      }),
    ]),
  )

export const getProductsToProcess = async (take: number) => {
  const products = await prismaClient.product.findMany({
    where: {
      status: Status.Pending,
    },
    include: {
      informations: {
        include: {
          materials: true,
          accessories: true,
        },
      },
      upload: {
        include: {
          createdBy: {
            include: {
              organization: {
                select: {
                  name: true,
                  authorizedBy: {
                    select: { from: { select: { name: true, brands: { select: { name: true } } } } },
                    where: { active: true },
                  },
                  brands: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    take,
  })

  return products.map((product) => ({
    ...product,
    informations: product.informations.map((information) => decryptProductFields(information)),
  }))
}

const productWithScoreSelect = {
  id: true,
  gtins: true,
  internalReference: true,
  brand: true,
  createdAt: true,
  score: true,
  standardized: true,
  informations: { select: { category: true, score: true } },
  upload: {
    select: {
      version: true,
      createdBy: { select: { organization: { select: { name: true } } } },
    },
  },
} satisfies Prisma.ProductSelect

export const getProductWithScoreHistory = async (gtin: string, page: number, pageSize: number) =>
  prismaClient.product.findMany({
    select: productWithScoreSelect,
    where: {
      gtins: { has: gtin },
      status: Status.Done,
    },
    orderBy: { createdAt: "desc" },
    skip: page * pageSize,
    take: pageSize,
  })

export const getProductWithScoreHistoryCount = async (gtin: string) => {
  return prismaClient.product.count({
    where: {
      gtins: { has: gtin },
      status: Status.Done,
    },
  })
}

export const getProductWithScore = async (gtin: string) =>
  prismaClient.product.findFirst({
    select: productWithScoreSelect,
    where: {
      gtins: { has: gtin },
      status: Status.Done,
    },
    orderBy: { createdAt: "desc" },
  })

export type ProductWithScore = NonNullable<Awaited<ReturnType<typeof getProductWithScore>>>

export const getOldProductWithScore = async (gtin: string, version: string) =>
  prismaClient.product.findFirst({
    select: productWithScoreSelect,
    where: {
      gtins: { has: gtin },
      id: version,
      status: Status.Done,
    },
    orderBy: { createdAt: "desc" },
  })

const getProducts = async (
  where: Pick<Prisma.ProductWhereInput, "upload" | "uploadId" | "createdAt" | "brand">,
  skip?: number,
  take?: number,
) => {
  const uniqueGtins = await prismaClient.product.findMany({
    where: {
      status: Status.Done,
      ...where,
    },
    select: { internalReference: true },
    distinct: ["internalReference"],
    orderBy: [{ createdAt: "desc" }, { internalReference: "asc" }],
    skip,
    take,
  })

  const products = await Promise.all(
    uniqueGtins.map(async ({ internalReference }) =>
      prismaClient.product.findFirst({
        where: { internalReference, ...where, status: Status.Done },
        select: productWithScoreSelect,
        orderBy: { createdAt: "desc" },
      }),
    ),
  )
  return products.filter((product) => product !== null)
}

export type Products = Awaited<ReturnType<typeof getProducts>>

export const getOrganizationProductsCountByUserIdAndBrand = async (userId: string, brand?: string) => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      organization: true,
    },
  })

  if (!user || !user.organization) {
    return 0
  }

  const products = await prismaClient.product.groupBy({
    by: ["internalReference"],
    where: {
      upload: { organizationId: user.organization.id },
      status: Status.Done,
      brand: brand,
    },
    _count: { internalReference: true },
  })
  return products.length
}

export const getOrganizationProductsByUserIdAndBrand = async (
  userId: string,
  page: number,
  size: number | undefined,
  brand?: string,
) => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      organization: true,
    },
  })

  if (!user || !user.organization) {
    return []
  }
  return size
    ? getProducts({ upload: { organizationId: user.organization.id }, brand }, (page || 0) * size, size)
    : getProducts({ upload: { organizationId: user.organization.id }, brand })
}
export const getProductsByUploadId = async (uploadId: string) => {
  const upload = await prismaClient.upload.findFirst({
    where: {
      id: uploadId,
    },
    select: {
      createdBy: {
        include: {
          organization: {
            select: {
              name: true,
              authorizedBy: {
                select: { from: { select: { name: true, brands: { select: { name: true } } } } },
                where: { active: true },
              },
              brands: { select: { name: true } },
            },
          },
        },
      },
      products: {
        include: {
          informations: {
            include: {
              materials: true,
              accessories: true,
              score: true,
            },
          },
        },
      },
      reUploadProducts: {
        include: {
          product: {
            include: {
              informations: {
                include: {
                  materials: true,
                  accessories: true,
                  score: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!upload) {
    return []
  }
  return [
    ...upload.products,
    ...upload.reUploadProducts.map(({ product, uploadOrder }) => ({ ...product, uploadOrder })),
  ]
    .sort((a, b) => (a.uploadOrder || 0) - (b.uploadOrder || 0))
    .map((product) => ({
      ...product,
      upload: { createdBy: upload.createdBy },
      informations: product.informations.map((information) => ({
        score: information.score,
        ...decryptProductFields(information),
      })),
    }))
}

export const failProducts = async (products: { productId: string; error: string }[]) => {
  await Promise.all(
    products.map((product) =>
      prismaClient.product.update({
        where: { id: product.productId },
        data: {
          status: Status.Error,
          error: product.error,
        },
      }),
    ),
  )
}

export const getProductsByOrganizationIdAndBrandBefore = async (
  organizationId: string,
  before: Date,
  brand: string | null,
) => getProducts({ upload: { organizationId }, createdAt: { lt: before }, brand: brand || undefined })

export const getOrganizationProductsByUserId = async (userId: string) => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      organization: true,
    },
  })

  if (!user || !user.organization) {
    return []
  }

  const products = await prismaClient.product.findMany({
    where: {
      upload: { organizationId: user.organization.id },
      status: Status.Done,
    },
    select: {
      brand: true,
    },
    distinct: ["brand"],
  })

  return products.map((product) => product.brand).sort((a, b) => a.localeCompare(b))
}

export const getLastProductByGtin = async (gtin: string) =>
  prismaClient.product.findFirst({
    where: {
      gtins: { has: gtin },
    },
    orderBy: { createdAt: "desc" },
    select: { hash: true, id: true },
  })

export const getProductCountByCategory = async () => {
  const allProducts = await prismaClient.product.findMany({
    where: {
      status: Status.Done,
    },
    select: {
      internalReference: true,
      createdAt: true,
      informations: {
        select: {
          category: true,
        },
      },
    },
    orderBy: [{ internalReference: "asc" }, { createdAt: "desc" }],
  })

  const uniqueProducts = []
  let lastInternalReference = null

  for (const product of allProducts) {
    if (product.internalReference !== lastInternalReference) {
      uniqueProducts.push(product)
      lastInternalReference = product.internalReference
    }
  }

  const categoryCount = uniqueProducts.reduce(
    (acc, product) => {
      const categoryValue = product.informations.length == 1 ? product.informations[0].category : BATCH_CATEGORY
      const category = productCategories[simplifyValue(categoryValue)] || categoryValue

      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += 1
      return acc
    },
    {} as Record<ProductCategory | string, number>,
  )

  return categoryCount
}

export const getDistinctBrandCount = async () => {
  const result = await prismaClient.product.groupBy({
    by: ["brand"],
    where: {
      status: Status.Done,
    },
  })

  return result.length
}

export const getBrandsInformations = async () => {
  const organizations = await prismaClient.organization.findMany({
    select: {
      id: true,
      name: true,
      siret: true,
      effectif: true,
      naf: true,
      users: { select: { email: true } },
      upload: {
        select: {
          id: true,
          type: true,
          status: true,
          createdAt: true,
          products: {
            where: {
              status: Status.Done,
            },
            select: {
              brand: true,
              internalReference: true,
            },
          },
        },
      },
    },
  })

  return organizations.map((organization) => {
    const userCount = organization.users.length
    const apiUploads = organization.upload.filter((upload) => upload.type === UploadType.API)
    const fileUploads = organization.upload.filter((upload) => upload.type === UploadType.FILE)

    const uploadDates = organization.upload.map((upload) => upload.createdAt).sort((a, b) => a.getTime() - b.getTime())
    const firstUploadDate = uploadDates.length > 0 ? uploadDates[0] : null
    const lastUploadDate = uploadDates.length > 0 ? uploadDates[uploadDates.length - 1] : null

    const brandStats = organization.upload
      .flatMap((upload) => upload.products)
      .reduce(
        (acc, product) => {
          if (!acc[product.brand]) {
            acc[product.brand] = new Set<string>()
          }
          acc[product.brand].add(product.internalReference)
          return acc
        },
        {} as Record<string, Set<string>>,
      )

    const brandCounts = Object.entries(brandStats).reduce(
      (acc, [brand, internalRefs]) => {
        acc[brand] = internalRefs.size
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      name: organization.name,
      siret: organization.siret,
      effectif: organization.effectif,
      naf: organization.naf,
      userCount,
      uploads: {
        api: apiUploads.length,
        file: fileUploads.length,
        fileDone: fileUploads.filter((upload) => upload.status === Status.Done).length,
      },
      uploadDates: {
        first: firstUploadDate,
        last: lastUploadDate,
      },
      brandCounts,
      totalProducts: Object.values(brandCounts).reduce((sum, count) => sum + count, 0),
    }
  })
}
