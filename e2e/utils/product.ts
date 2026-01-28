import "dotenv/config"
import { Prisma } from "@prisma/client"
import { prismaClient } from "../../src/db/prismaClient"

export const updateManyProducts = async (where: Prisma.ProductWhereInput, data: Prisma.ProductUpdateInput) =>
  prismaClient.product.updateMany({
    where,
    data,
  })
