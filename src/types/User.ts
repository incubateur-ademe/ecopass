import "next-auth"
import { UserRole } from "../../prisma/src/prisma"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    role?: UserRole
    agentconnect_info?: {
      siret: string
    }
  }

  interface Session {
    user: User
    provider?: string
    idToken?: string
  }
}
