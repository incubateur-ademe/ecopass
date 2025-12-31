export const validatePassword = (password: string) => {
  const minLength = 12
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  return {
    minLength: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
  }
}
