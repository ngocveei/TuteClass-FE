const apiUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')

export const env = {
  apiUrl,
  signalRUrl: (import.meta.env.VITE_SIGNALR_URL || apiUrl).replace(/\/$/, ''),
} as const
