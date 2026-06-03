let uuidCounter = 0

export const v4 = () => {
  uuidCounter++
  return `test-uuid-${uuidCounter.toString().padStart(4, "0")}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
