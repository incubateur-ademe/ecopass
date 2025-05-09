import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "./config"
import { getUserByApiKey } from "../../db/user"

export function auth(
  ...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []
) {
  return getServerSession(...args, authOptions)
}

export const getApiUser = async (headers: Headers) => {
  const authorizationHeader = headers.get("Authorization")
  if (!authorizationHeader) {
    return null
  }

  const [type, token] = authorizationHeader.split(" ")
  if (type !== "Bearer") {
    return null
  }

  return getUserByApiKey(token)
}
