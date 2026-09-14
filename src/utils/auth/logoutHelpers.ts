import { v4 as uuid } from "uuid"

export const performLogout = (
  provider: "franceconnect" | "proconnect",
  postLogoutRedirectUri: string,
  idToken: string,
): void => {
  const domain =
    provider === "franceconnect"
      ? process.env.NEXT_PUBLIC_FRANCECONNECT_DOMAIN
      : process.env.NEXT_PUBLIC_PROCONNECT_DOMAIN

  const logOutUrl = new URL(`${domain}/api/v2/session/end`)
  logOutUrl.searchParams.set("id_token_hint", idToken)
  logOutUrl.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri)
  logOutUrl.searchParams.set("state", uuid())
  if (typeof window !== "undefined") {
    window.location.href = logOutUrl.toString()
  }
}
