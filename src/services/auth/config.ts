import { v4 as uuid } from "uuid"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { AuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prismaClient } from "../../db/prismaClient"
import { UserRole } from "@prisma/enums"
import { createOrganization } from "../../db/organization"

export const authOptions = {
  adapter: PrismaAdapter(prismaClient),
  events: {
    createUser: async ({ user }) => {
      try {
        const siret = user.agentconnect_info?.siret || ""
        if (siret) {
          let organization = await prismaClient.organization.findUnique({
            where: { siret },
          })

          if (!organization) {
            organization = await createOrganization(siret)
          }
          await prismaClient.user.update({
            where: { id: user.id },
            data: {
              organizationId: organization.id,
            },
          })
        }
      } catch (error) {
        console.error("Error in createUser event:", error)
      }
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
        },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const user = await prismaClient.user.findUnique({
          include: { accounts: true },
          where: { email: credentials.email.toLowerCase() },
        })

        if (!user) {
          throw new Error("Invalid crendentials")
        }
        const account = user.accounts.find((account) => account.provider === "credentials")

        if (!account || !account.password) {
          throw new Error("Invalid crendentials")
        }

        const isValidPassword = await bcrypt.compare(credentials.password, account.password)
        if (!isValidPassword) {
          throw new Error("Invalid crendentials")
        }

        return { email: user.email || "", id: user.id }
      },
    }),
    {
      id: "proconnect",
      name: "ProConnect",
      type: "oauth",
      idToken: true,
      clientId: process.env.PROCONNECT_CLIENT_ID,
      clientSecret: process.env.PROCONNECT_CLIENT_SECRET,
      wellKnown: `${process.env.NEXT_PUBLIC_PROCONNECT_DOMAIN}/api/v2/.well-known/openid-configuration`,
      allowDangerousEmailAccountLinking: true,
      checks: ["nonce", "state"],
      authorization: {
        params: {
          scope: "openid uid given_name usual_name email siret",
          acr_values: "eidas1",
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/proconnect`,
          nonce: uuid(),
          state: uuid(),
        },
      },
      client: {
        authorization_signed_response_alg: "RS256",
        id_token_signed_response_alg: "RS256",
        userinfo_encrypted_response_alg: "RS256",
        userinfo_signed_response_alg: "RS256",
        userinfo_encrypted_response_enc: "RS256",
      },
      userinfo: {
        async request(context) {
          const userInfo = await fetch(`${process.env.NEXT_PUBLIC_PROCONNECT_DOMAIN}/api/v2/userinfo`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${context.tokens.access_token}`,
            },
          }).then((res) => {
            return res.text()
          })
          return JSON.parse(Buffer.from(userInfo.split(".")[1], "base64").toString())
        },
      },
      profile: async (profile) => {
        return {
          id: profile.email,
          prenom: profile.given_name,
          nom: profile.usual_name,
          email: profile.email,
          agentconnect_info: profile,
        }
      },
    },
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      if (account) {
        token.provider = account.provider
        token.idToken = account.id_token
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.provider = token.provider as string
        session.idToken = token.idToken as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies AuthOptions
