"use client"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const Logout = () => {
  const session = useSession()
  const router = useRouter()

  if (session.data && session.data.provider === "proconnect") {
    const callbackUrl = `/logout/proconnect?id_token_hint=${session.data.idToken}`
    signOut({ redirect: false, callbackUrl }).then((signOutResponse) => router.push(signOutResponse.url))
  } else {
    signOut({ callbackUrl: "/" })
  }

  return null
}

export default Logout
