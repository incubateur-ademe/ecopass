export const retry = async (fn: () => Promise<void>, maxAttempt: number, onFail?: () => Promise<void>) => {
  let attempt = 0
  while (attempt < maxAttempt) {
    try {
      attempt++
      await fn()
      break
    } catch (error) {
      if (attempt < maxAttempt) {
        if (onFail) {
          await onFail()
        }
      } else {
        throw error
      }
    }
  }
}
