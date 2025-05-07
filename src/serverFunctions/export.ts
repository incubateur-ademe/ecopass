"use server"
import { getProductsByUploadId } from "../db/product"
import { stringify } from "csv-stringify/sync"

export const exportUpload = async (uploadId: string) => {
  const products = await getProductsByUploadId(uploadId)

  return stringify(
    products.filter((product) => product.score !== null).map((product) => [product.ean, product.score?.score]),
    {
      header: true,
      columns: ["EAN", "Score"],
    },
  )
}
