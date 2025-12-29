export const isTestEnvironment = (): boolean => {
  return process.env.NEXT_PUBLIC_TEST === "true"
}
