import { NextResponse } from "next/server"
import doc from "../../../api/doc.json"

export async function GET() {
  console.log(`[GET] /api/documentation - Starting`)
  const result = NextResponse.json(doc)
  console.log(`[GET] /api/documentation - Completed`)
  return result
}
