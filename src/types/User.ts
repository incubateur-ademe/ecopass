import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
  }

  interface Session {
    user?: User
  }
}
