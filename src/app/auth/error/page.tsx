import { PageProps } from "../../../types/Next"
import ErrorPageClient from "../../../components/Auth/ErrorPageClient"

const ErrorPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const error = params.error ? (params.error as string) : undefined

  return <ErrorPageClient error={error} />
}

export default ErrorPage
