import { downloadFileFromS3 } from "../../../utils/s3/bucket"
import { decryptAndDezipFile } from "../../../utils/encryption/encryption"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "../../../services/auth/auth"
import { getExportByName } from "../../../db/export"
import { getUser } from "../../../db/user"
import { canExportFullProducts } from "../../../utils/authorization/authorizations"

export async function GET(request: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const file = (await params).file
    const index = Number(searchParams.get("index"))
    const exportType = searchParams.get("exportType") || "zip"
    const baseName = Number.isNaN(index) || !index ? file : `${file}-${index + 1}`

    const exportRecord = await getExportByName(session.user.id, file)
    if (!exportRecord) {
      return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 })
    }

    let buffer: BodyInit
    let fileName: string
    let contentType: string

    if (exportType === "zip") {
      const zipFileName = `${baseName}.zip`
      buffer = await downloadFileFromS3(zipFileName, "export")
      fileName = zipFileName
      contentType = "application/zip"
    } else if (exportType === "csv") {
      const csvFileName = `${baseName}.csv`
      buffer = await downloadFileFromS3(csvFileName, "export")
      fileName = csvFileName
      contentType = "text/csv"
    } else {
      const user = await getUser(session.user.id)
      if (!user || !canExportFullProducts(user.role, exportRecord.brand || undefined)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const zip = await downloadFileFromS3(`${baseName}.zip`, "export")
      buffer = new Uint8Array(await decryptAndDezipFile(zip))
      fileName = `${baseName}.csv`
      contentType = "text/csv"
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error("Erreur lors du téléchargement du fichier :", error)
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 })
  }
}
