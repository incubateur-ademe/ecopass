export const getSize = (value: number) => {
  if (value < 10) {
    return 10
  }
  if (value < 100) {
    return 5
  }
  if (value < 1000) {
    return -1
  }
  if (value < 10000) {
    return -7
  }
  return -12
}
