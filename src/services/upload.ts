import { Product, Upload, User } from "@prisma/client"
import { updateUploadToDone, updateUploadToError } from "../db/upload"
import { sendUploadErrorEmail, sendUploadSuccessEmail } from "./emails/email"

export const failUpload = async (
  upload: Pick<Upload, "id" | "name" | "createdAt"> & {
    createdBy: Pick<User, "email">
    products: Pick<Product, "status">[]
    reUploadProducts: { product: Pick<Product, "status"> }[]
  },
  message?: string,
) => {
  sendUploadErrorEmail(
    upload.createdBy.email,
    upload.name,
    upload.createdAt,
    upload.products.length + upload.reUploadProducts.length,
    upload.products.filter((p) => p.status === "Done").length +
      upload.reUploadProducts.filter((p) => p.product.status === "Done").length,
  )
  return updateUploadToError(upload.id, message)
}

export const completeUpload = async (
  upload: Pick<Upload, "id" | "name" | "createdAt"> & { createdBy: Pick<User, "email"> },
) => {
  sendUploadSuccessEmail(upload.createdBy.email, upload.name, upload.createdAt)
  return updateUploadToDone(upload.id)
}
