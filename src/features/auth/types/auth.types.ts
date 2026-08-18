export type RegistrationRole = 'teacher' | 'student'
export interface LoginRequest { email: string; password: string }
export interface RegisterRequest { fullName: string; email: string; password: string; role: RegistrationRole; termsAccepted: boolean }
export interface AuthResponse {
  accessToken: string; refreshToken: string; accessTokenExpiresAt: string; refreshTokenExpiresAt: string
  user: { userId: string; fullName: string; email: string; roleName: string; isFirstLogin: boolean }
}
export interface RegisterResponse {
  userId: string; fullName: string; email: string; roleName: string; emailVerified: boolean
  emailVerificationExpiresAt: string; resendAvailableAt: string; createdAt: string
}
