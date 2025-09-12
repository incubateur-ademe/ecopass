import axios from "axios"
import { getProductCountByCategory } from "../../db/product"
import { getDoneAPIUploadCount, getDoneFileUploadCount } from "../../db/upload"

const getVisits = async () => {
  const params = new URLSearchParams()
  params.append("token_auth", process.env.MATOMO_API_TOKEN as string)
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
  const [visits, products, fileUploads, apiUploads] = await Promise.all([
    getVisits(),
    getProductCountByCategory(),
    getDoneFileUploadCount(),
    getDoneAPIUploadCount(),
  ])

  return {
    visits: visits[0]?.nb_visits,
    products,
    fileUploads,
    apiUploads,
  }
}

export type Stats = Awaited<ReturnType<typeof computeStats>>
