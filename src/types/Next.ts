export interface PageProps {
  params: Promise<{ [key: string]: string | undefined }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ [key: string]: string | undefined }>
}

export interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}
