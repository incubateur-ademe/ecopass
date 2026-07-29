import "next-auth"
import { UserRole, UserType } from "@prisma/enums"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    role?: UserRole
    type?: UserType
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
