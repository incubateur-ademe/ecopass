import jwt from "jsonwebtoken"

export const getMetabaseToken = (type: "question" | "dashboard", id: number) => {
  console.log(`[getMetabaseToken] Starting - type: ${type}, id: ${id}`)
  const payload = {
    resource: { [type]: id },
    params: {},
    exp: Math.round(Date.now() / 1000) + 10 * 60,
  }
  return jwt.sign(payload, process.env.METABASE_SECRET_KEY!)
}
