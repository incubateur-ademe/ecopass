import { NextResponse } from "next/server"
import { prismaClient } from "../../../../db/prismaClient"
import { computeBatchScore } from "../../../../utils/ecobalyse/batches"
import { BATCH_CATEGORY } from "../../../../utils/types/productCategory"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "0", 10)
  const size = Math.min(parseInt(searchParams.get("size") || "100", 10), 500)

  if (page < 0 || size < 1) {
    return NextResponse.json({ error: "Invalid pagination parameters" }, { status: 400 })
  }

  const productsWithGtins = await prismaClient.product.findMany({
    where: {
      status: "Done",
    },
    select: {
      gtins: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const gtinToLatestDate = new Map<string, Date>()
  for (const product of productsWithGtins) {
    for (const gtin of product.gtins) {
      const existing = gtinToLatestDate.get(gtin)
      if (!existing || product.createdAt > existing) {
        gtinToLatestDate.set(gtin, product.createdAt)
      }
    }
  }

  const uniqueGtins = Array.from(gtinToLatestDate.keys())
  const total = gtinToLatestDate.size
  const paginatedGtins = uniqueGtins.slice(page * size, (page + 1) * size)

  const products = await prismaClient.product.findMany({
    where: {
      status: "Done",
      gtins: {
        hasSome: paginatedGtins,
      },
    },
    include: {
      brand: { select: { name: true } },
      informations: { select: { category: true, score: true } },
      upload: {
        include: {
          createdBy: {
            select: {
              email: true,
              nom: true,
              prenom: true,
            },
          },
          organization: {
            select: {
              name: true,
              siret: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const gtinToProduct = new Map<string, (typeof products)[0]>()
  for (const product of products) {
    for (const gtin of product.gtins) {
      if (paginatedGtins.includes(gtin)) {
        const existing = gtinToProduct.get(gtin)
        if (!existing || product.createdAt > existing.createdAt) {
          gtinToProduct.set(gtin, product)
        }
      }
    }
  }
  const data = Array.from(gtinToProduct.entries()).map(([gtin, product]) => {
    const totalScore = computeBatchScore(product)
    return {
      gtin,
      internalReference: product.internalReference,
      brand: product.brand,
      createdAt: product.createdAt,
      category: product.informations.length === 1 ? product.informations[0].category : BATCH_CATEGORY,
      score: totalScore,
      upload: {
        version: product.upload.version,
        createdBy: {
          organization: {
            name: product.upload.organization.name,
          },
        },
      },
    }
  })

  return NextResponse.json({
    data,
    pagination: {
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    },
  })
}
