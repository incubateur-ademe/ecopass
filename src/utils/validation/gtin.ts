export const isValidGtin = (gtin: string): boolean => {
  const digits = gtin.split("").map(Number)

  let sum = 0
  let multiplier = 3
  for (let i = digits.length - 2; i >= 0; i--) {
    sum += digits[i] * multiplier
    multiplier = multiplier === 3 ? 1 : 3
  }

  const calculatedCheckDigit = (10 - (sum % 10)) % 10

  return digits[digits.length - 1] === calculatedCheckDigit
}
