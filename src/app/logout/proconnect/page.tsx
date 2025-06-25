import { v4 as uuidv4 } from "uuid"
import { redirect } from "next/navigation"
import { PageProps } from "../../../../.next/types/app/page"

const Logout = async ({ searchParams }: PageProps) => {
  const logOutUrl = new URL(`${process.env.PROCONNECT_DOMAIN}/api/v2/session/end`)
  logOutUrl.searchParams.set("id_token_hint", (await searchParams).id_token_hint || "")
  logOutUrl.searchParams.set("post_logout_redirect_uri", process.env.NEXTAUTH_URL!)
  logOutUrl.searchParams.set("state", uuidv4())
  redirect(logOutUrl.toString())
}

export default Logout
