import NextAuth from "next-auth"
import { authOptions } from "../../../../services/auth/config"

console.log(`[NextAuth] Initializing NextAuth handler`)
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
