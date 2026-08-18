const TOKEN_STORAGE_KEY = 'tuteclass.auth.tokens'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
}

export function getTokens(): AuthTokens | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(TOKEN_STORAGE_KEY) ?? 'null')
    if (!value || typeof value !== 'object') return null
    const tokens = value as Partial<AuthTokens>
    return typeof tokens.accessToken === 'string' && typeof tokens.refreshToken === 'string'
      ? tokens as AuthTokens
      : null
  } catch {
    return null
  }
}

export function getAccessToken(): string | null {
  return getTokens()?.accessToken ?? null
}

export function setTokens(tokens: AuthTokens): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens))
}

export function removeTokens(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}
