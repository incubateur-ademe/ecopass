export const getSafeCallbackUrl = (nextParam?: string | string[]) => {
  const candidate = Array.isArray(nextParam) ? nextParam[0] : nextParam

  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return "/"
  }

  return candidate
}
