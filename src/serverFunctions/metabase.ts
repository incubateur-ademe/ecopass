import jwt from "jsonwebtoken"

export const getMetabaseToken = (question: number) => {
  console.log(`[getMetabaseToken] Starting - question: ${question}`)
  const payload = {
    resource: { question },
    params: {},
    exp: Math.round(Date.now() / 1000) + 10 * 60,
  }
  return jwt.sign(payload, process.env.METABASE_SECRET_KEY!)
}
