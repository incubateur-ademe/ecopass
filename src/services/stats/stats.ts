"use server"
import axios from "axios"
import { getProductCountByCategory, getDistinctBrandCount, getBrandsInformations } from "../../db/product"
import { getDoneAPIUploadCount, getDoneFileUploadCount } from "../../db/upload"
import { auth } from "../auth/auth"
import { UserRole } from "@prisma/enums"

const getVisits = async () => {
  const token = process.env.MATOMO_API_TOKEN as string
  if (!token) {
    return [{ nb_visits: Math.floor(Math.random() * 10000) + 1000 }]
  }

  const params = new URLSearchParams()
  params.append("token_auth", token)
  return axios
    .post<[{ nb_visits: number }]>(
      `${process.env.NEXT_PUBLIC_MATOMO_SITE_URL}?idSite=${process.env.NEXT_PUBLIC_MATOMO_SITE_ID}&method=VisitsSummary.get&format=JSON&module=API&period=year&date=today&showColumns=nb_visits&filter_limit=-1&flat=1`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    )
    .then((response) => response.data)
}

export const computeStats = async () => {
  const [visits, products, fileUploads, apiUploads, distinctBrands] = await Promise.all([
    getVisits(),
    getProductCountByCategory(),
    getDoneFileUploadCount(),
    getDoneAPIUploadCount(),
    getDistinctBrandCount(),
  ])

  return {
    visits: visits[0]?.nb_visits,
    products,
    fileUploads,
    apiUploads,
    distinctBrands,
  }
}

export type Stats = Awaited<ReturnType<typeof computeStats>>

export const computeAdminStats = async () => {
  const session = await auth()
  if (!session || !session.user || session.user.role !== UserRole.ADMIN) {
    return null
  }

  return getBrandsInformations()
}

export type AdminStats = Awaited<ReturnType<typeof computeAdminStats>>
