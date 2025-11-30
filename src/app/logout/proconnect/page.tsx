import { v4 as uuidv4 } from "uuid"
import { redirect } from "next/navigation"
import { PageProps } from "../../../types/Next"

const Logout = async ({ searchParams }: PageProps) => {
  const logOutUrl = new URL(`${process.env.PROCONNECT_DOMAIN}/api/v2/session/end`)
  const params = await searchParams
  const idTokenHint = Array.isArray(params.id_token_hint) ? params.id_token_hint[0] : params.id_token_hint
  logOutUrl.searchParams.set("id_token_hint", idTokenHint || "")
  logOutUrl.searchParams.set("post_logout_redirect_uri", process.env.NEXTAUTH_URL!)
  logOutUrl.searchParams.set("state", uuidv4())
  redirect(logOutUrl.toString())
}

export default Logout
