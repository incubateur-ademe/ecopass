export {}

declare global {
  interface Window {
    please: {
      track: (events: string[]) => void
    }
    metabaseConfig?: {
      theme?: {
        preset?: string
      }
      isGuest?: boolean
      instanceUrl?: string
    }
  }
}
