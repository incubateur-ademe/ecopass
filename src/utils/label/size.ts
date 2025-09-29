export const getSize = (value: number) => {
  const roundedValue = Math.round(value)
  if (roundedValue < 10) {
    return 10
  }
  if (roundedValue < 100) {
    return 5
  }
  if (roundedValue < 1000) {
    return -1
  }
  if (roundedValue < 10000) {
    return -7
  }
  return -12
}
