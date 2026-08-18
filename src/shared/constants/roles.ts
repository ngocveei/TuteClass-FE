export const ROLES = {
  teacher: 'Teacher',
  student: 'Student',
  admin: 'Admin',
} as const

export type AppRole = (typeof ROLES)[keyof typeof ROLES]
