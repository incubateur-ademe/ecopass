"use client"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const Logout = () => {
  const session = useSession()
  const router = useRouter()

  if (session.data) {
    const callbackUrl = `/logout/proconnect?id_token_hint=${session.data?.idToken}`
    signOut({ redirect: false, callbackUrl }).then((signOutResponse) => router.push(signOutResponse.url))
  } else if (session.status !== "unauthenticated") {
    signOut({ callbackUrl: "/" })
  }

  return null
}

export default Logout
