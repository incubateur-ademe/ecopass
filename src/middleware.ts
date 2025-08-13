import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  new Promise<void>(async (resolve, reject) => {
    try {
      const { searchParams } = new URL(request.url)
      const param = `e_c=API&e_a=${request.nextUrl.pathname}&e_n=${searchParams.toString()}`

      if (process.env.NEXT_PUBLIC_MATOMO !== "true") {
        console.log(`Fake matomo event: ${param}`)
        return resolve()
      }

      await fetch(
        `${process.env.NEXT_PUBLIC_MATOMO_SITE_URL}/matomo.php?idsite=${process.env.NEXT_PUBLIC_MATOMO_SITE_ID}&rec=1&${param}`,
        {
          method: "POST",
        },
      )
      resolve()
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
