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
                    select: {
                      from: { select: { name: true, brands: { select: { name: true, id: true, active: true } } } },
                    },
                    where: { active: true },
                  },
                  brands: { select: { name: true, id: true, active: true } },
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
  brand: { select: { name: true } },
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
  where: Pick<Prisma.ProductWhereInput, "upload" | "uploadId" | "createdAt" | "brandId" | "OR">,
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
      organization: {
        select: {
          id: true,
          brands: true,
        },
      },
    },
  })

  if (!user || !user.organization) {
    return 0
  }

  const products = await prismaClient.product.groupBy({
    by: ["internalReference"],
    where: {
      OR: [
        {
          brandId: brand ? brand : { in: user.organization.brands.map((brand) => brand.id) },
          status: Status.Done,
        },
        {
          upload: { organizationId: user.organization.id },
          status: Status.Done,
          brandId: brand,
        },
      ],
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
      organization: {
        select: {
          id: true,
          brands: true,
        },
      },
    },
  })

  if (!user || !user.organization) {
    return []
  }
  return size
    ? getProducts(
        {
          OR: [
            {
              brandId: brand ? brand : { in: user.organization.brands.map((brand) => brand.id) },
              status: Status.Done,
            },
            {
              upload: { organizationId: user.organization.id },
              status: Status.Done,
              brandId: brand,
            },
          ],
        },
        (page || 0) * size,
        size,
      )
    : getProducts({
        OR: [
          {
            brandId: brand ? brand : { in: user.organization.brands.map((brand) => brand.id) },
            status: Status.Done,
          },
          {
            upload: { organizationId: user.organization.id },
            status: Status.Done,
            brandId: brand,
          },
        ],
      })
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
) => getProducts({ upload: { organizationId }, createdAt: { lt: before }, brandId: brand || undefined })

export const getAllBrands = async () => {
  const products = await prismaClient.product.findMany({
    where: {
      status: Status.Done,
    },
    select: {
      brand: { select: { id: true, name: true } },
    },
    distinct: ["brandId"],
  })

  return products
    .map((product) => product.brand)
    .filter((brand) => brand !== null)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const searchProducts = async (options: {
  page: number
  size: number
  brandId?: string
  search?: string
  category?: string
}) => {
  const baseWhere: Prisma.ProductWhereInput = {
    status: Status.Done,
    ...(options.brandId && { brandId: options.brandId }),
    ...(options.category && {
      informations: {
        some: {
          category: options.category,
        },
      },
    }),
  }

  const searchTerm = options.search?.trim()
  if (searchTerm) {
    baseWhere.AND = [
      {
        OR: [
          {
            gtins: {
              hasSome: [searchTerm],
            },
          },
          {
            internalReference: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
    ]
  }

  const [uniqueReferences, total] = await Promise.all([
    prismaClient.product.findMany({
      where: baseWhere,
      select: { internalReference: true, createdAt: true },
      distinct: ["internalReference"],
      orderBy: [{ createdAt: "desc" }, { internalReference: "asc" }],
      skip: (options.page - 1) * options.size,
      take: options.size,
    }),
    prismaClient.product
      .groupBy({
        by: ["internalReference"],
        where: baseWhere,
      })
      .then((res) => res.length),
  ])

  const allProducts = await prismaClient.product.findMany({
    where: {
      internalReference: { in: uniqueReferences.map((r) => r.internalReference) },
      ...baseWhere,
    },
    select: productWithScoreSelect,
    orderBy: { createdAt: "desc" },
  })

  const productsMap = new Map<string, (typeof allProducts)[0]>()
  for (const product of allProducts) {
    const existing = productsMap.get(product.internalReference)
    if (!existing || product.createdAt > existing.createdAt) {
      productsMap.set(product.internalReference, product)
    }
  }

  const products = Array.from(productsMap.values())

  return {
    products,
    total,
  }
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
    by: ["brandId"],
    where: {
      status: Status.Done,
    },
  })

  return result.length
}

export const getOrganizationProductsByUserId = async (userId: string) => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      organization: {
        select: {
          id: true,
          brands: true,
        },
      },
    },
  })

  if (!user || !user.organization) {
    return []
  }
  const products = await prismaClient.product.findMany({
    where: {
      OR: [
        {
          brandId: { in: user.organization.brands.map((brand) => brand.id) },
          status: Status.Done,
        },
        {
          upload: { organizationId: user.organization.id },
          status: Status.Done,
        },
      ],
    },
    select: {
      brand: { select: { id: true, name: true } },
    },
    distinct: ["brandId"],
  })

  return products
    .map((product) => product.brand)
    .filter((brand) => brand !== null)
    .sort((a, b) => a.name.localeCompare(b.name))
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
          products: {
            where: {
              status: Status.Done,
            },
            select: {
              brandId: true,
              internalReference: true,
              createdAt: true,
            },
          },
        },
      },
    },
  })

  const brandsNames = await prismaClient.brand.findMany({
    select: {
      id: true,
      name: true,
    },
  })

  return organizations.map((organization) => {
    const userCount = organization.users.length
    const apiUploads = organization.upload.filter((upload) => upload.type === UploadType.API)
    const fileUploads = organization.upload.filter((upload) => upload.type === UploadType.FILE)

    const brands = organization.upload
      .flatMap((upload) => upload.products)
      .reduce(
        (acc, product) => {
          if (product.brandId !== null) {
            const brand = acc[product.brandId]
            if (!brand) {
              acc[product.brandId] = {
                references: new Set<string>([product.internalReference]),
                firstDepositDate: product.createdAt,
                lastDepositDate: product.createdAt,
              }
            } else {
              brand.references.add(product.internalReference)
              if (product.createdAt < brand.firstDepositDate) {
                brand.firstDepositDate = product.createdAt
              }
              if (product.createdAt > brand.lastDepositDate) {
                brand.lastDepositDate = product.createdAt
              }
            }
          }
          return acc
        },
        {} as Record<string, { references: Set<string>; firstDepositDate: Date; lastDepositDate: Date }>,
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
      brands: Object.entries(brands).map(([brandName, brand]) => ({
        name: brandsNames.find((brand) => brand.id === brandName)?.name || brandName,
        organization: organization.name,
        totalProducts: brand.references.size,
        firstDepositDate: brand.firstDepositDate,
        lastDepositDate: brand.lastDepositDate,
      })),
    }
  })
}
