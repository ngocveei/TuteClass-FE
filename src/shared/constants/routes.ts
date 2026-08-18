export const ROUTES = {
  landing: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  teacherProfile: '/teacher/profile',
  studentProfile: '/student/profile',
  teacherClasses: '/classes',
  teacherClassDetail: (classId: string) => `/classes/${classId}`,
  studentClasses: '/student/classes',
  adminUsers: '/admin/users',
} as const
