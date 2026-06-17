"use client"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { v4 as uuid } from "uuid"

const Logout = ({ force }: { force?: boolean }) => {
  const session = useSession()
  const router = useRouter()

  if (force) {
    signOut({ callbackUrl: "/" })
    return null
  }

  if (session.data && session.data.provider === "proconnect") {
    const logOutUrl = new URL(`${process.env.NEXT_PUBLIC_PROCONNECT_DOMAIN}/api/v2/session/end`)
    logOutUrl.searchParams.set("id_token_hint", session.data.idToken || "")
    logOutUrl.searchParams.set("post_logout_redirect_uri", `${process.env.NEXT_PUBLIC_URL}/logout/proconnect`)
    logOutUrl.searchParams.set("state", uuid())
    router.push(logOutUrl.toString())
  } else {
    signOut({ callbackUrl: "/" })
  }

  return null
}

export default Logout
