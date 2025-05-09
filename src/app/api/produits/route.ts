import { NextResponse } from "next/server"
import { createProducts } from "../../../db/product"
import { getApiUser } from "../../../services/auth/auth"
import { createUpload } from "../../../db/upload"
import { UploadType } from "../../../../prisma/src/prisma"

export async function POST(req: Request) {
  try {
    const user = await getApiUser(req.headers)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Validation des données d'entrée avec zod
    const body = await req.json()
    const upload = await createUpload(user.id, UploadType.API)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await createProducts(body.map((item: any) => ({ ...item, uploadId: upload.id })))
    return NextResponse.json("success", { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error)
    return NextResponse.json({ error: "Erreur lors de la création du produit." }, { status: 500 })
  }
}
