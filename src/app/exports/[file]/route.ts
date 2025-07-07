import { downloadFileFromS3 } from "../../../utils/s3/bucket"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  try {
    const file = (await params).file
    const buffer = await downloadFileFromS3(`${file}.zip`, "export")
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${file}.zip"`,
      },
    })
  } catch (error) {
    console.error("Erreur lors du téléchargement du fichier :", error)
    return new Response("Fichier introuvable", { status: 404 })
  }
}
