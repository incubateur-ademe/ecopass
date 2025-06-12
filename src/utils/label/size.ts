export const getSize = (value: number) => {
  if (value < 10) {
    return 12
  }
  if (value < 100) {
    return 7
  }
  if (value < 1000) {
    return 1
  }
  return -5
}
