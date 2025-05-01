import { Prisma } from "../../prisma/src/prisma"
import { prismaClient } from "./prismaClient"

export const createScores = async (scores: Prisma.ScoreCreateManyInput[]) =>
  prismaClient.score.createMany({
    data: scores,
  })
