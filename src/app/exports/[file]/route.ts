import { downloadFileFromS3 } from "../../../utils/s3/bucket"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "../../../services/auth/auth"
import { getExportByName } from "../../../db/export"

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
      return NextResponse.json({ error: "Export not found" }, { status: 404 })
    }

    let buffer: Buffer<ArrayBuffer>
    let fileName: string
    let contentType: string

    if (exportType === "zip") {
      const zipFileName = `${baseName}.zip`
      buffer = await downloadFileFromS3(zipFileName, "export")
      fileName = zipFileName
      contentType = "application/zip"
    } else {
      const csvFileName = `${baseName}.csv`
      buffer = await downloadFileFromS3(csvFileName, "export")
      fileName = csvFileName
      contentType = "text/csv"
    }

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error("Erreur lors du téléchargement du fichier :", error)
    return new Response("Fichier introuvable", { status: 404 })
  }
}
