import { lazy } from 'react'

export const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'))
export const LoginPage = lazy(() => import('@/features/auth/pages/LoginViewPage'))
export const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
export const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))
export const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordViewPage'))
export const ProfilePage = lazy(() => import('@/features/profile/pages/ProfileDetailsPage'))
export const ClassListPage = lazy(() => import('@/features/classes/pages/ClassListPage'))
export const ClassDetailPage = lazy(() => import('@/features/classes/pages/ClassDetailPage'))
export const StudentClassesPage = lazy(() => import('@/features/enrollments/pages/StudentClassesPage'))
export const AdminUsersPage = lazy(() => import('@/features/administration/pages/AdminUsersPage'))
