const classResource = (classId: string) => `/api/classes/${encodeURIComponent(classId)}`

export const classEndpoints = {
  createOptions: '/api/classes/create-options',
  mine: '/api/classes/mine',
  images: '/api/classes/images',
  create: '/api/classes',
  invitations: (classId: string) => `${classResource(classId)}/invitations`,
  invitation: (classId: string, invitationId: string) =>
    `${classResource(classId)}/invitations/${encodeURIComponent(invitationId)}`,
  updateInvitation: (classId: string, invitationId: string) =>
    `${classResource(classId)}/invitations/${encodeURIComponent(invitationId)}`,
  notes: (classId: string) => `${classResource(classId)}/notes`,
  note: (classId: string, noteId: string) =>
    `${classResource(classId)}/notes/${encodeURIComponent(noteId)}`,
  todos: (classId: string) => `${classResource(classId)}/todos`,
  todo: (classId: string, todoId: string) =>
    `${classResource(classId)}/todos/${encodeURIComponent(todoId)}`,
  students: (classId: string) => `${classResource(classId)}/students`,
  classStudents: (classId: string) => `${classResource(classId)}/students`,
  student: (classId: string, studentId: string) =>
    `${classResource(classId)}/students/${encodeURIComponent(studentId)}`,
  classStudentDetail: (classId: string, studentId: string) =>
    `${classResource(classId)}/students/${encodeURIComponent(studentId)}`,
  changeStudentClass: (classId: string, studentId: string) =>
    `${classResource(classId)}/students/${encodeURIComponent(studentId)}/change-class`,
  removeStudent: (classId: string, studentId: string) =>
    `${classResource(classId)}/students/${encodeURIComponent(studentId)}/remove`,
  removeStudentFromClass: (classId: string, studentId: string) =>
    `${classResource(classId)}/students/${encodeURIComponent(studentId)}/remove`,
  joinRequests: (classId: string) => `${classResource(classId)}/join-requests`,
  approveJoinRequest: (classId: string, studentId: string) =>
    `${classResource(classId)}/join-requests/${encodeURIComponent(studentId)}/approve`,
  rejectJoinRequest: (classId: string, studentId: string) =>
    `${classResource(classId)}/join-requests/${encodeURIComponent(studentId)}/reject`,
  settings: (classId: string) => `${classResource(classId)}/settings`,
  deleteClass: classResource,
  class: classResource,
} as const
