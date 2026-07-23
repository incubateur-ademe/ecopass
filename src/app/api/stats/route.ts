import { NextRequest, NextResponse } from "next/server"
import { getAllProducts } from "../../../db/product"

type Periodicity = "day" | "week" | "month" | "year"
type Stats = {
  value: number
  date: Date
}

const MAX_CHECK_DATE = new Date(Date.UTC(2025, 8, 1, 23, 59, 59, 999))

const getStartOfPeriod = (periodicity: Periodicity) => {
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)

  switch (periodicity) {
    case "day":
      return start
    case "week": {
      const day = start.getUTCDay()
      const diffFromMonday = (day + 6) % 7
      start.setUTCDate(start.getUTCDate() - diffFromMonday)
      return start
    }
    case "month":
      start.setUTCDate(1)
      return start
    case "year":
      start.setUTCMonth(0, 1)
      return start
  }
}

const addPeriods = (date: Date, periodicity: Periodicity, amount: number) => {
  const next = new Date(date)

  if (periodicity === "day") {
    next.setUTCDate(next.getUTCDate() + amount)
    return next
  }

  if (periodicity === "week") {
    next.setUTCDate(next.getUTCDate() + amount * 7)
    return next
  }

  if (periodicity === "month") {
    next.setUTCMonth(next.getUTCMonth() + amount)
    return next
  }

  next.setUTCFullYear(next.getUTCFullYear() + amount)
  return next
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const periodicity = (searchParams.get("periodicity") || "month") as Periodicity
  const since = searchParams.get("since") ? Number.parseInt(searchParams.get("since") as string) : Number.MAX_VALUE

  const currentPeriodStart = getStartOfPeriod(periodicity)

  const stats: Stats[] = []
  const products = await getAllProducts()
  for (let index = 0; index < since; index++) {
    const date = addPeriods(currentPeriodStart, periodicity, -index)
    const nextPeriodDate = addPeriods(date, periodicity, 1)
    const endOfPeriod = new Date(nextPeriodDate.getTime() - 1)

    if (endOfPeriod < MAX_CHECK_DATE) {
      break
    }

    let count = 0

    for (const product of products) {
      const createdAt = product._min.createdAt
      if (createdAt && createdAt >= date && createdAt <= endOfPeriod) {
        count++
      }
    }

    stats.push({
      date,
      value: count,
    })
  }

  const response = NextResponse.json({ description: "Nombre de références produits déposées", stats })
  response.headers.set("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=86400")

  return response
}
