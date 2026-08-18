export const ROUTES = {
  landing: '/',
  login: '/login',
  register: '/register',
  checkEmail: '/register/check-email',
  verifyEmail: '/verify-email',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  teacherProfile: '/teacher/profile',
  studentProfile: '/student/profile',
  teacherClasses: '/classes',
  teacherCreateClass: '/classes/new',
  teacherStudents: '/classes/students',
  teacherClassSettings: (classId: string) => `/classes/${encodeURIComponent(classId)}/settings`,
  teacherClassApprovals: (classId: string) => `/classes/${encodeURIComponent(classId)}/approval-requests`,
  teacherNotifications: '/teacher/notifications',
  teacherTuition: '/teacher/tuition',
  studentClasses: '/student/classes',
  adminUsers: '/admin/users',
} as const

export const APP_ROUTES = ROUTES

export function teacherOverviewPath(classId?: string) {
  return classId ? `${ROUTES.teacherClasses}?classId=${encodeURIComponent(classId)}` : ROUTES.teacherClasses
}
