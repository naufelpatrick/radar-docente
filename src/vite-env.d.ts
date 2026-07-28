/// <reference types="vite/client" />

interface Window {
  gtag?: (command: 'event', eventName: string, parameters?: Record<string, unknown>) => void
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
