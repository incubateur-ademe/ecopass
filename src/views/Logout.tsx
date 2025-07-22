"use client"
import { signOut, useSession } from "next-auth/react"

const Logout = () => {
  const session = useSession()

  if (session.data) {
    const callbackUrl = `/logout/proconnect?id_token_hint=${session.data?.idToken}`
    signOut({ callbackUrl })
  }

  return null
}

export default Logout
