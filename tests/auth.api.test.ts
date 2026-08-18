import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import {
  forgotPassword,
  login,
  register,
  requestEmailVerification,
  resetPassword,
  verifyEmail,
} from '@/features/auth/api/auth.api'
import { getTokens } from '@/services/auth/tokenStorage'
import { server } from './support/server'

const api = 'http://localhost:8080'

describe('auth API flows', () => {
  it('normalizes login identity and stores tokens only through token storage', async () => {
    server.use(http.post(`${api}/api/auth/login`, async ({ request }) => {
      expect(await request.json()).toEqual({ email: 'teacher@example.com', password: 'Secret1!' })
      return HttpResponse.json({
        accessToken: 'access',
        refreshToken: 'refresh',
        accessTokenExpiresAt: '2030-01-01T00:00:00Z',
        refreshTokenExpiresAt: '2030-02-01T00:00:00Z',
        user: { userId: 'teacher-1', fullName: 'Teacher', email: 'teacher@example.com', roleName: 'Teacher', isFirstLogin: false },
      })
    }))

    await login({ email: ' Teacher@Example.com ', password: 'Secret1!' })
    expect(getTokens()?.refreshToken).toBe('refresh')
  })

  it('registers a teacher and persists the verification context', async () => {
    server.use(http.post(`${api}/api/auth/register`, async ({ request }) => {
      expect(await request.json()).toEqual({ fullName: 'Nguyễn Văn An', email: 'an@example.com', password: 'Secret1!', role: 'Teacher' })
      return HttpResponse.json({
        userId: 'teacher-1',
        fullName: 'Nguyễn Văn An',
        email: 'an@example.com',
        roleName: 'Teacher',
        emailVerified: false,
        emailVerificationExpiresAt: '2030-01-01T00:15:00Z',
        resendAvailableAt: '2030-01-01T00:01:00Z',
        createdAt: '2030-01-01T00:00:00Z',
      })
    }))

    await register({ fullName: '  Nguyễn   Văn An ', email: ' AN@example.com ', password: 'Secret1!', role: 'teacher', termsAccepted: true })
    expect(JSON.parse(sessionStorage.getItem('tuteclass.email-verification') ?? '{}')).toMatchObject({ email: 'an@example.com' })
  })

  it('keeps reset and verification context tied to the backend expiry', async () => {
    server.use(
      http.post(`${api}/api/auth/forgot-password`, () => HttpResponse.json({ otpExpiresInMinutes: 10, otpExpiresAt: '2030-01-01T00:10:00Z', resendAvailableAt: '2030-01-01T00:01:00Z' })),
      http.post(`${api}/api/auth/reset-password`, async ({ request }) => {
        expect(await request.json()).toEqual({ otp: '123456', newPassword: 'NewSecret1!' })
        return new HttpResponse(null, { status: 204 })
      }),
      http.post(`${api}/api/auth/email-verification`, () => HttpResponse.json({ tokenExpiresInMinutes: 15, tokenExpiresAt: '2030-01-01T00:15:00Z', resendAvailableAt: '2030-01-01T00:01:00Z' })),
      http.post(`${api}/api/auth/verify-email`, async ({ request }) => {
        expect(await request.json()).toEqual({ token: 'verification-token' })
        return new HttpResponse(null, { status: 204 })
      }),
    )

    await forgotPassword(' Student@example.com ')
    expect(JSON.parse(sessionStorage.getItem('tuteclass.password-reset') ?? '{}')).toMatchObject({ email: 'student@example.com', otpExpiresAt: '2030-01-01T00:10:00Z' })
    await resetPassword(' 123456 ', 'NewSecret1!')
    expect(sessionStorage.getItem('tuteclass.password-reset')).toBeNull()
    await requestEmailVerification('student@example.com')
    await verifyEmail(' verification-token ')
    expect(sessionStorage.getItem('tuteclass.email-verification')).toBeNull()
  })
})
