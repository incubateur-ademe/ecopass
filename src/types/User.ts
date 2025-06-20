import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    agentconnect_info?: {
      siret: string
    }
  }

  interface Session {
    user?: User
  }
}
