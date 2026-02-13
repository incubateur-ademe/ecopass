import jwt from "jsonwebtoken"

export const getMetabaseToken = (question: number) => {
  const payload = {
    resource: { question },
    params: {},
    exp: Math.round(Date.now() / 1000) + 10 * 60,
  }
  return jwt.sign(payload, process.env.METABASE_SECRET_KEY!)
}
