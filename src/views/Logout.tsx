"use client"

import { signOut, useSession } from "next-auth/react"
import { useEffect } from "react"
import { performLogout } from "../utils/auth/logoutHelpers"

const Logout = ({ force }: { force?: boolean }) => {
  const session = useSession()

  useEffect(() => {
    if (force) {
      signOut({ callbackUrl: "/" })
      return
    }

    if (session.data?.idToken && session.data?.provider === "proconnect") {
      const postLogoutUri = `${process.env.NEXT_PUBLIC_URL}/logout/proconnect`
      performLogout("proconnect", postLogoutUri, session.data.idToken)
    } else if (session.data?.idToken && session.data?.provider === "franceconnect") {
      const postLogoutUri = `${process.env.NEXT_PUBLIC_URL}/logout/franceconnect`
      performLogout("franceconnect", postLogoutUri, session.data.idToken)
    } else if (session.status === "authenticated") {
      signOut({ callbackUrl: "/" })
    }
  }, [session, force])

  return null
}

export default Logout
