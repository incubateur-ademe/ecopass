import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "./config"

export function auth(
  ...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []
) {
  return getServerSession(...args, authOptions)
}
