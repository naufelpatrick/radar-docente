/// <reference types="vite/client" />

interface MetaPixelFunction {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  loaded: boolean
  version: string
}

interface Window {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
  praxiaGoogleTagInitialized?: boolean
  praxiaAnalyticsConfigured?: boolean
  praxiaGoogleAdsConfigured?: boolean
  fbq?: MetaPixelFunction
  _fbq?: MetaPixelFunction
  praxiaMetaPixelConfigured?: boolean
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
