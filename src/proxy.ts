import { NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  new Promise<void>(async (resolve, reject) => {
    try {
      const { searchParams } = new URL(request.url)
      const buffer = new Uint8Array(8)
      crypto.getRandomValues(buffer)
      const cid = [...buffer].map((b) => b.toString(16).padStart(2, "0")).join("")
      const param = `e_c=API&e_a=${request.nextUrl.pathname}&e_n=${encodeURIComponent(searchParams.toString())}&cid=${cid}`

      if (process.env.NEXT_PUBLIC_MATOMO !== "true") {
        console.log(`Fake matomo event: ${param}`)
        return resolve()
      }

      await fetch(
        `${process.env.NEXT_PUBLIC_MATOMO_SITE_URL}/matomo.php?idsite=${process.env.NEXT_PUBLIC_MATOMO_SITE_ID}&rec=1&${param}&bots=1`,
        {
          method: "POST",
          signal: AbortSignal.timeout(30000),
        },
      )
      return resolve()
    } catch (error) {
      console.error("Erreur lors du tracking API:", error)
      reject(error)
    }
  })

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/((?!auth/).+)"],
}
