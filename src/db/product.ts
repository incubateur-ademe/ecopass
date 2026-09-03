import { Accessory, Material, Prisma, Product, ProductInformation } from "@prisma/client"
import { ConfidenceLevel, Status, UploadType, UserType } from "@prisma/enums"
import { ParsedProductValidation } from "../services/validation/product"
import { decryptProductFields } from "../utils/encryption/encryption"
import { productCategories } from "../utils/types/productCategory"
import { prismaClient } from "./prismaClient"
import { checkOldProduct, ProductDeclarationContext } from "../services/validation/oldProduct"
import { getProductCategory } from "../utils/product/category"
import { computeBatchScore } from "../utils/ecobalyse/batches"
import { ProductCheckResult } from "../services/validation/productCheckResult"

export const createProducts = async (
  {
    products,
    materials,
    accessories,
    informations,
  }: {
    products: Product[]
    materials: Material[]
    accessories: Accessory[]
    informations: (ProductInformation & { materials: undefined; accessories: undefined })[]
  },
  currentUser: ProductDeclarationContext,
) => {
  return prismaClient.$transaction(
    async (transaction) => {
      const productsToCreate = []
      const ids = new Set<string>()

      for (const product of products) {
        const oldProductCheck = await checkOldProduct(product.gtins, product.hash, product.confidenceLevel, currentUser)

        if (oldProductCheck.result === ProductCheckResult.Unchanged && oldProductCheck.lastProduct) {
          await transaction.uploadProduct.create({
            data: {
              productId: oldProductCheck.lastProduct.id,
              uploadId: product.uploadId,
              uploadOrder: product.uploadOrder || 0,
            },
          })
          continue
        }
        if (oldProductCheck.result === ProductCheckResult.TooRecent && oldProductCheck.lastProduct) {
          await transaction.product.create({
            data: {
              ...product,
              status: Status.Error,
              error: "Un produit avec le même GTIN a été déclaré trop récemment",
            },
          })
          continue
        }
        if (oldProductCheck.result === ProductCheckResult.HigherConfidence && oldProductCheck.lastProduct) {
          await transaction.product.create({
            data: {
              ...product,
              status: Status.Error,
              error: "Un produit avec le même GTIN a été déclaré avec une confiance plus élevée",
            },
          })
          continue
        }
        productsToCreate.push(product)
        ids.add(product.id)
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
  scores: Omit<Prisma.ScoreCreateInput, "standardized">[],
  product: ParsedProductValidation,
) => {
  const score = scores.reduce((acc, value) => acc + value.score, 0)
  const mass = product.informations.map((info) => info.mass).reduce((acc, value) => acc + value, 0)
  await prismaClient.$transaction(async (transaction) =>
    Promise.all([
      transaction.product.update({
        where: { id: product.id },
        data: {
          status: Status.Done,
          score: score,
          standardized: (score / mass) * 0.1,
        },
      }),
      transaction.score.createMany({
        data: scores.map((score, index) => ({
          ...score,
          productId: product.informations[index].id,
          standardized: (score.score / product.informations[index].mass) * 0.1,
        })),
      }),
    ]),
  )

  return applyMeanScoreToProduct(product.id)
}

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
  brand: { select: { id: true, name: true, organization: { select: { displayName: true, id: true } } } },
  createdAt: true,
  score: true,
  standardized: true,
  meanScore: true,
  meanStandardized: true,
  confidenceLevel: true,
  informations: {
    select: {
      categorySlug: true,
      mainComponent: true,
      score: {
        select: {
          score: true,
          standardized: true,
          durability: true,
          acd: true,
          cch: true,
          etf: true,
          fru: true,
          fwe: true,
          htc: true,
          htn: true,
          ior: true,
          ldu: true,
          mru: true,
          ozd: true,
          pco: true,
          pma: true,
          swe: true,
          tre: true,
          wtu: true,
          microfibers: true,
          outOfEuropeEOL: true,
          materials: true,
          spinning: true,
          fabric: true,
          dyeing: true,
          making: true,
          usage: true,
          endOfLife: true,
          transport: true,
          trims: true,
        },
      },
    },
  },
  upload: {
    select: {
      version: true,
      createdBy: {
        select: {
          type: true,
          organization: { select: { displayName: true, id: true } },
        },
      },
    },
  },
} satisfies Prisma.ProductSelect

export type ProductWithScoreBase = Prisma.ProductGetPayload<{ select: typeof productWithScoreSelect }>
export type BatchScore = ReturnType<typeof computeBatchScore>

export type MeanScores = Omit<{ [K in keyof BatchScore]: number }, "scoreWithoutDurability">

export type ProductWithScore = ProductWithScoreBase & {
  meanScores: MeanScores
  score: number | null
  standardized: number | null
}

export const getProductWithScoreHistory = async (gtin: string, page: number, pageSize: number) => {
  const products = await prismaClient.product.findMany({
    select: productWithScoreSelect,
    where: {
      gtins: { has: decodeURIComponent(gtin) },
      status: Status.Done,
    },
    orderBy: { createdAt: "desc" },
    skip: page * pageSize,
    take: pageSize,
  })

  return (await Promise.all(products.map((product) => withMeanScores(product)))).filter((product) => product !== null)
}

export const getProductWithScoreHistoryCount = async (gtin: string) => {
  return prismaClient.product.count({
    where: {
      gtins: { has: decodeURIComponent(gtin) },
      status: Status.Done,
    },
  })
}

export const getProductWithScore = async (gtin: string) => {
  const product = await prismaClient.product.findFirst({
    select: productWithScoreSelect,
    where: {
      gtins: { has: decodeURIComponent(gtin) },
      status: Status.Done,
    },
    orderBy: { createdAt: "desc" },
  })

  return withMeanScores(product)
}

export const getProductByGtin = async (gtin: string, id?: string) =>
  prismaClient.product.findFirst({
    select: { internalReference: true },
    where: {
      gtins: { has: decodeURIComponent(gtin) },
      id,
      status: Status.Done,
    },
    orderBy: { createdAt: "desc" },
  })

export const getOldProductWithScore = async (gtin: string, version: string) => {
  const product = await prismaClient.product.findFirst({
    select: productWithScoreSelect,
    where: {
      gtins: { has: decodeURIComponent(gtin) },
      id: version,
      status: Status.Done,
    },
    orderBy: { createdAt: "desc" },
  })

  return withMeanScores(product)
}

const getProducts = async (
  where: Pick<
    Prisma.ProductWhereInput,
    "upload" | "informations" | "uploadId" | "createdAt" | "brandId" | "status" | "AND"
  >,
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
    uniqueGtins.map(async ({ internalReference }) => {
      const product = await prismaClient.product.findFirst({
        where: { internalReference, ...where, status: Status.Done },
        select: productWithScoreSelect,
        orderBy: { createdAt: "desc" },
      })
      return withMeanScores(product)
    }),
  )
  return products.filter((product) => product !== null)
}

export const countPublicProductsByBrandId = async (
  brandId: string | undefined,
  category: string | undefined,
  organization: string | undefined,
  from: Date | undefined,
  to: Date | undefined,
) => {
  const result = await prismaClient.product.findMany({
    where: {
      status: Status.Done,
      brandId,
      informations: category
        ? {
            some: {
              categorySlug: category,
            },
          }
        : undefined,
      upload: organization ? { organizationId: organization } : undefined,
      createdAt: {
        gte: from,
        lte: to,
      },
    },
    select: { internalReference: true },
    distinct: ["internalReference"],
  })
  return result.length
}

export const getPublicProductsByBrandId = async (
  brandId: string | undefined,
  category: string | undefined,
  organization: string | undefined,
  from: Date | undefined,
  to: Date | undefined,
  page: number,
) =>
  getProducts(
    {
      brandId,
      informations: category
        ? {
            some: {
              categorySlug: category,
            },
          }
        : undefined,
      upload: organization ? { organizationId: organization } : undefined,
      createdAt: {
        gte: from,
        lte: to,
      },
    },
    (page - 1) * 10,
    10,
  )

export const getOrganizationProductsCountByUserIdAndBrand = async (userId: string, brandId?: string) => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      type: true,
      organization: {
        select: {
          id: true,
          brands: { select: { id: true } },
          authorizedBy: {
            select: { from: { select: { brands: { select: { id: true } } } } },
            where: { active: true },
          },
        },
      },
    },
  })

  if (!user) {
    return 0
  }
  const authorizedBrandIds = user.organization
    ? [
        ...user.organization.brands.map((brand) => brand.id),
        ...user.organization.authorizedBy.flatMap((auth) => auth.from.brands.map((brand) => brand.id)),
      ]
    : []

  const where =
    user.type === UserType.CITOYEN || !user.organization
      ? { status: Status.Done, upload: { createdById: userId } }
      : {
          OR: [
            {
              brandId: { in: authorizedBrandIds },
              status: Status.Done,
            },
            {
              upload: { organizationId: user.organization.id },
              status: Status.Done,
            },
          ],
        }

  const products = await prismaClient.product.groupBy({
    by: ["internalReference"],
    where: brandId ? { AND: [where, { brandId }] } : where,
    _count: { internalReference: true },
  })
  return products.length
}

export const getOrganizationProductsByUserIdAndBrandId = async (
  userId: string,
  page: number,
  size: number | undefined,
  brandId?: string,
) => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      type: true,
      organization: {
        select: {
          id: true,
          brands: { select: { id: true } },
          authorizedBy: {
            select: { from: { select: { brands: { select: { id: true } } } } },
            where: { active: true },
          },
        },
      },
    },
  })
  if (!user) {
    return []
  }

  const authorizedBrandIds = user.organization
    ? [
        ...user.organization.brands.map((brand) => brand.id),
        ...user.organization.authorizedBy.flatMap((auth) => auth.from.brands.map((brand) => brand.id)),
      ]
    : []
  const where =
    user.type === UserType.CITOYEN || !user.organization
      ? { status: Status.Done, upload: { createdById: userId } }
      : {
          OR: [
            {
              brandId: { in: authorizedBrandIds },
              status: Status.Done,
            },
            {
              upload: { organizationId: user.organization.id },
              status: Status.Done,
            },
          ],
        }

  return size
    ? getProducts(brandId ? { AND: [where, { brandId }] } : where, (page || 0) * size, size)
    : getProducts(brandId ? { AND: [where, { brandId }] } : where)
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

export const failProducts = async (products: { id: string; error: string }[]) => {
  await Promise.all(
    products.map((product) =>
      prismaClient.product.update({
        where: { id: product.id },
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
) => {
  const organization = await prismaClient.organization.findUnique({
    where: { id: organizationId },
    select: {
      id: true,
      brands: { select: { id: true } },
      authorizedBy: {
        select: { from: { select: { brands: { select: { id: true } } } } },
        where: { active: true },
      },
    },
  })

  if (!organization) {
    return []
  }

  const authorizedBrands = new Set([
    ...organization.brands.map((brand) => brand.id),
    ...organization.authorizedBy.flatMap((auth) => auth.from.brands.map((brand) => brand.id)),
  ])

  if (brand && !authorizedBrands.has(brand)) {
    return []
  }

  return getProducts({
    brandId: brand ? brand : { in: Array.from(authorizedBrands) },
    status: Status.Done,
    createdAt: { lt: before },
  })
}

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
          categorySlug: productCategories[options.category],
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
export type Products = Awaited<ReturnType<typeof searchProducts>>["products"]

export const getLastProductsByGtins = async (gtins: string[]) => {
  const products = await prismaClient.product.findMany({
    where: {
      gtins: { hasSome: gtins },
      status: Status.Done,
    },
    orderBy: { createdAt: "desc" },
    select: {
      hash: true,
      id: true,
      gtins: true,
      createdAt: true,
      confidenceLevel: true,
      upload: {
        select: {
          organizationId: true,
          createdBy: {
            select: {
              id: true,
              type: true,
              organizationId: true,
            },
          },
        },
      },
    },
  })

  return gtins
    .map((gtin) => products.find((product) => product.gtins.includes(gtin)))
    .filter((product) => product !== undefined)
}

export const getAllProducts = async () =>
  prismaClient.product.groupBy({
    by: ["internalReference"],
    where: {
      status: Status.Done,
    },
    _min: { createdAt: true },
  })

export const getProductCountByCategory = async () => {
  const allProducts = await prismaClient.product.findMany({
    where: {
      status: Status.Done,
    },
    select: {
      internalReference: true,
      informations: {
        select: {
          categorySlug: true,
          mainComponent: true,
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

  return uniqueProducts.reduce(
    (acc, product) => {
      const category = getProductCategory(product.informations)
      if (!category) {
        return acc
      }
      acc[category] = acc[category] ? acc[category] + 1 : 1
      return acc
    },
    {} as Record<string, number>,
  )
}

export const getDistinctBrandCount = async () => {
  const brands = await prismaClient.product.findMany({
    where: {
      status: Status.Done,
      brandId: { not: null },
    },
    select: {
      brandId: true,
    },
    distinct: ["brandId"],
  })
  return brands.length
}

export const getOrganizationProductsByUserId = async (userId: string) => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      type: true,
      organization: {
        select: {
          id: true,
          brands: true,
        },
      },
    },
  })

  if (!user) {
    return []
  }

  const where =
    user.type === UserType.CITOYEN || !user.organization
      ? { status: Status.Done, upload: { createdById: userId } }
      : {
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
        }

  const products = await prismaClient.product.findMany({
    where,
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
                id: product.brandId,
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
        {} as Record<string, { id: string; references: Set<string>; firstDepositDate: Date; lastDepositDate: Date }>,
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
        brandId: brand.id,
        organization: organization.name,
        organizationId: organization.id,
        totalProducts: brand.references.size,
        firstDepositDate: brand.firstDepositDate,
        lastDepositDate: brand.lastDepositDate,
      })),
    }
  })
}

export const getLastBrands = async () => {
  const brands = await prismaClient.product.groupBy({
    by: ["brandId"],
    where: {
      status: Status.Done,
      brandId: { not: null },
    },
    _max: { createdAt: true },
    orderBy: { _max: { createdAt: "desc" } },
    take: 5,
  })

  const brandsDetails = await prismaClient.brand.findMany({
    where: { id: { in: brands.map((b) => b.brandId).filter((brand) => brand !== null) } },
    select: { id: true, name: true },
  })

  return brands.map((brand) => brandsDetails.find((b) => b.id === brand.brandId)).filter((brand) => brand !== undefined)
}

export const forEachLatestProductsByBrandIdForExport = async (
  onBatch: (
    products: Prisma.ProductGetPayload<{
      include: {
        brand: { select: { id: true; name: true } }
        informations: {
          include: {
            materials: true
            accessories: true
            score: true
          }
        }
      }
    }>[],
  ) => Promise<void> | void,
  brandId?: string,
  category?: string,
  organization?: string,
) => {
  const latest = await prismaClient.product.findMany({
    where: {
      status: Status.Done,
      brandId,
      informations: category
        ? {
            some: {
              categorySlug: productCategories[category],
            },
          }
        : undefined,
      upload: organization ? { organizationId: organization } : undefined,
    },
    select: { id: true, internalReference: true, createdAt: true },
    distinct: ["internalReference"],
    orderBy: [{ internalReference: "asc" }, { createdAt: "desc" }],
  })

  if (latest.length === 0) {
    return 0
  }

  const latestIds = latest.map((row) => row.id)
  const batchSize = parseInt(process.env.QUERY_PARAMETER_BATCH_SIZE || "50000", 10)
  let processedProducts = 0

  for (let index = 0; index < latestIds.length; index += batchSize) {
    const batchIds = latestIds.slice(index, index + batchSize)

    const batchProducts = await prismaClient.product.findMany({
      where: {
        id: { in: batchIds },
      },
      include: {
        brand: { select: { id: true, name: true } },
        informations: {
          include: {
            materials: true,
            accessories: true,
            score: true,
          },
        },
      },
      orderBy: [{ internalReference: "asc" }, { createdAt: "desc" }],
    })

    processedProducts += batchProducts.length
    await onBatch(batchProducts)
  }

  return processedProducts
}

const mean = (values: (number | null | undefined)[]) => {
  const numbers = values.filter((value) => value !== null && value !== undefined)
  return numbers.length > 0 ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : null
}

export const getMeanScores = async (product: ProductWithScoreBase) => {
  if (product.confidenceLevel === ConfidenceLevel.High) {
    return computeBatchScore(product)
  }

  const oldProducts = await prismaClient.product.findMany({
    where: {
      gtins: { hasSome: product.gtins },
      status: Status.Done,
      confidenceLevel: product.confidenceLevel,
      createdAt: { lt: product.createdAt },
    },
    select: productWithScoreSelect,
  })

  const products = [product, ...oldProducts]
  const scores: BatchScore[] = products.map((item) => computeBatchScore(item))
  const detailedScoreKeys = Object.keys(scores[0] || {}).filter(
    (key) => key !== "scoreWithoutDurability" && typeof scores[0][key as keyof BatchScore] === "number",
  )

  const meanDetailedScores = Object.fromEntries(
    detailedScoreKeys.map((key) => [key, mean(scores.map((score) => score[key as keyof BatchScore]))]),
  )

  return meanDetailedScores as MeanScores
}

export const applyMeanScoreToProduct = async (productId: string) => {
  const product = await prismaClient.product.findUnique({
    where: { id: productId },
    select: productWithScoreSelect,
  })

  if (!product) {
    return null
  }

  const meanScores = await getMeanScores(product)

  await prismaClient.product.update({
    where: { id: productId },
    data: {
      meanScore: meanScores.score,
      meanStandardized: meanScores.standardized,
    },
  })

  return meanScores
}

const withMeanScores = async (product: ProductWithScoreBase | null) => {
  if (!product) {
    return product
  }

  const meanScores = await getMeanScores(product)
  return {
    ...product,
    meanScores,
  }
}
