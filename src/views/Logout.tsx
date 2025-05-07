"use client"

import { signOut } from "next-auth/react"

const Logout = () => {
  signOut({ callbackUrl: "/" })
  return null
}

export default Logout
