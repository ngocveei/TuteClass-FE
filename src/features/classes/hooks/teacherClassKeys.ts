export const teacherClassKeys = {
  all: ['classes'] as const,
  mine: (status = 'All') => [...teacherClassKeys.all, 'mine', status] as const,
  invitations: (classId: string) => [...teacherClassKeys.all, classId, 'invitations'] as const,
  notes: (classId: string) => [...teacherClassKeys.all, classId, 'notes'] as const,
  todos: (classId: string) => [...teacherClassKeys.all, classId, 'todos'] as const,
  students: (classId: string, query: object) => [...teacherClassKeys.all, classId, 'students', query] as const,
  student: (classId: string, studentId: string) => [...teacherClassKeys.all, classId, 'students', studentId] as const,
  joinRequests: (classId: string, query: object) => [...teacherClassKeys.all, classId, 'join-requests', query] as const,
  settings: (classId: string) => [...teacherClassKeys.all, classId, 'settings'] as const,
  createOptions: () => [...teacherClassKeys.all, 'create-options'] as const,
}
