import { Product, Upload, User } from "../../prisma/src/prisma"
import { updateUploadToDone, updateUploadToError } from "../db/upload"
import { sendUploadErrorEmail, sendUploadSuccessEmail } from "./emails/email"

export const failUpload = async (
  upload: Pick<Upload, "id" | "name" | "createdAt"> & {
    createdBy: Pick<User, "email">
    products: Pick<Product, "status">[]
  },
  message?: string,
) => {
  sendUploadErrorEmail(
    upload.createdBy.email,
    upload.name,
    upload.createdAt,
    upload.products.length,
    upload.products.filter((p) => p.status === "Done").length,
  )
  return updateUploadToError(upload.id, message)
}

export const completeUpload = async (
  upload: Pick<Upload, "id" | "name" | "createdAt"> & { createdBy: Pick<User, "email"> },
) => {
  sendUploadSuccessEmail(upload.createdBy.email, upload.name, upload.createdAt)
  return updateUploadToDone(upload.id)
}
