import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "./config"
import { getUserByApiKey } from "../../db/user"
import { prismaClient } from "../../db/prismaClient"

export async function auth(
  ...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []
) {
  const session = await getServerSession(...args, authOptions)
  if (!session?.user?.id) {
    return null
  }

  const user = await prismaClient.user.findUnique({
    where: { id: session.user.id },
    select: { tokenVersion: true },
  })

  if (!user || user.tokenVersion !== session.user.tokenVersion) {
    return null
  }
  return session
}

export const getApiUser = async (headers: Headers) => {
  const authorizationHeader = headers.get("Authorization")
  if (!authorizationHeader) {
    return null
  }

  const [type, token] = authorizationHeader.split(" ")
  if (type !== "Bearer" || !token) {
    return null
  }

  return getUserByApiKey(token)
}
