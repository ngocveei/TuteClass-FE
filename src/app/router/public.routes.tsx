import type { RouteObject } from 'react-router-dom'
import { ForgotPasswordPage, LandingPage, LoginPage, RegisterPage, ResetPasswordPage } from '@/app/router/lazy.pages'
import { AuthLayout } from '@/shared/layouts/AuthLayout/AuthLayout'

export const publicRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/forbidden', element: <div>Bạn không có quyền truy cập trang này.</div> },
    ],
  },
]
