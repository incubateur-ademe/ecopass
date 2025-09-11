export const simplifyValue = (value: string | null) =>
  value
    ? value
        .trim()
        .toLowerCase()
        .replace(/\(.*?\)/g, "")
        .replace(/[ \/'-]/g, "")
        .replace(/[éè]/g, "e")
        .replace(/ç/g, "c")
    : ""

export const getValue = <T>(mapping: Record<string, T>, key: string): T => {
  const simplifiedKey = simplifyValue(key)
  const value = mapping[simplifiedKey]
  if (value !== undefined) {
    return value
  }
  return key as T
}
