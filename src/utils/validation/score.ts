export const scoreIsValid = (declaredScore: number, computedScore: number) => {
  if (computedScore === 0) {
    return declaredScore === 0
  }

  const relativeError = Math.abs(declaredScore - computedScore) / Math.abs(computedScore)

  return relativeError <= 0.01
}
