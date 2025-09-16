import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const param = `e_c=API&e_a=${request.nextUrl.pathname}&e_n=${searchParams.toString()}`

    if (process.env.NEXT_PUBLIC_MATOMO === "true") {
      await fetch(
        `${process.env.NEXT_PUBLIC_MATOMO_SITE_URL}/matomo.php?idsite=${process.env.NEXT_PUBLIC_MATOMO_SITE_ID}&rec=1&${param}`,
        {
          method: "POST",
        },
      )
    } else {
      console.log(`Fake matomo event: ${param}`)
    }
  } catch (error) {
    console.error("Erreur lors du tracking API:", error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/((?!auth/).+)"],
}
