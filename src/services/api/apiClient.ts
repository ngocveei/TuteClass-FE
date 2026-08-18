import axios from 'axios'
import { env } from '@/config/env.config'
import { getAccessToken, getTokens, removeTokens, setTokens } from '@/services/auth/tokenStorage'

interface RetryableRequest {
  _authRetry?: boolean
}

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) return Promise.reject(error)

    const request = error.config as (typeof error.config & RetryableRequest) | undefined
    const tokens = getTokens()
    const isAuthRequest = request?.url?.startsWith('/api/auth/')
    if (request && tokens?.refreshToken && !request._authRetry && !isAuthRequest) {
      request._authRetry = true
      try {
        const response = await axios.post<AuthResponse>('/api/auth/refresh', {
          refreshToken: tokens.refreshToken,
        }, { baseURL: env.apiUrl, timeout: 15_000 })
        setTokens(response.data)
        request.headers.Authorization = `Bearer ${response.data.accessToken}`
        return apiClient.request(request)
      } catch {
        // Continue with the common unauthorized flow below.
      }
    }

    removeTokens()
    if (window.location.pathname !== '/login') window.location.assign('/login')
    return Promise.reject(error)
  },
)

interface AuthResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
}
