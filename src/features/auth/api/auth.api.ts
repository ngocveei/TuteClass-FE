import { apiClient } from '@/services/api/apiClient'
import { setTokens } from '@/services/auth/tokenStorage'
import type { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse, RegistrationRole } from '@/features/auth/types/auth.types'

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/login', { email: request.email.trim().toLowerCase(), password: request.password })
  setTokens(data)
  return data
}

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>('/api/auth/register', {
    fullName: request.fullName.trim().replace(/\s+/g, ' '), email: request.email.trim().toLowerCase(), password: request.password,
    role: request.role === 'teacher' ? 'Teacher' : 'Student',
  })
  return data
}

export async function googleLogin(idToken: string, role: RegistrationRole): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/google', { idToken, role: role === 'teacher' ? 'Teacher' : 'Student' })
  setTokens(data)
  return data
}

export interface ForgotPasswordResponse { otpExpiresInMinutes: number; otpExpiresAt: string; resendAvailableAt: string }
export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const normalized = email.trim().toLowerCase()
  const { data } = await apiClient.post<ForgotPasswordResponse>('/api/auth/forgot-password', { email: normalized })
  sessionStorage.setItem('tuteclass.password-reset', JSON.stringify({ email: normalized, ...data }))
  return data
}

export async function resetPassword(otp: string, newPassword: string): Promise<void> {
  await apiClient.post('/api/auth/reset-password', { otp: otp.trim(), newPassword })
  sessionStorage.removeItem('tuteclass.password-reset')
}
