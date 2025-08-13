import { NextResponse } from "next/server"
import doc from "../../../api/doc.json"

export async function GET() {
  return NextResponse.json(doc)
}
