import { parseBool } from '@/utils/authUtils'

const getWindowConfig = () => {
  if (typeof window === 'undefined') return {}
  return window.__APP_CONFIG__ || {}
}

export const appConfig = {
  publicEnabled: parseBool(getWindowConfig().PUBLIC_ENABLED ?? import.meta.env.VITE_PUBLIC_ENABLED)
}
