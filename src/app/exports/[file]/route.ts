import { downloadFileFromS3 } from "../../../utils/s3/bucket"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  try {
    const { searchParams } = new URL(request.url)
    const file = (await params).file
    const index = Number(searchParams.get("index"))
    const fileName = Number.isNaN(index) || !index ? `${file}.zip` : `${file}-${index + 1}.zip`
    const buffer = await downloadFileFromS3(fileName, "export")
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error("Erreur lors du téléchargement du fichier :", error)
    return new Response("Fichier introuvable", { status: 404 })
  }
}
