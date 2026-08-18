import type { RouteObject } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  CheckEmailPage,
  ForbiddenPage,
  ForgotPasswordPage,
  LandingPage,
  LegalPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from '@/app/router/lazy.pages'
import { AuthLayout } from '@/shared/layouts/AuthLayout/AuthLayout'
import { GuestGuard } from '@/shared/auth/GuestGuard'

const guest = (element: ReactNode) => <GuestGuard>{element}</GuestGuard>

export const publicRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: '/login', element: guest(<LoginPage />) },
      { path: '/register', element: guest(<RegisterPage />) },
      { path: '/register/check-email', element: guest(<CheckEmailPage />) },
      { path: '/verify-email', element: <VerifyEmailPage /> },
      { path: '/forgot-password', element: guest(<ForgotPasswordPage />) },
      { path: '/reset-password', element: guest(<ResetPasswordPage />) },
      { path: '/terms', element: <LegalPage /> },
      { path: '/privacy', element: <LegalPage /> },
      { path: '/forbidden', element: <ForbiddenPage /> },
    ],
  },
]
