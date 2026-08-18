export type ClassStatus = 'Active' | 'Completed'

export interface Class {
  id: string
  name: string
  description?: string
  studentCount: number
  status: ClassStatus
  createdAt?: string
  pendingApprovalCount?: number
  imageUrl?: string
}

export interface CreateClassRequest {
  className: string
  subjectId: string
  gradeLevel: string
  description?: string
}

export interface CreateClassOptions {
  subjects: Array<{ subjectId: string; subjectName: string }>
  gradeLevels: Array<{ value: string; label: string }>
}

export interface UpdateClassRequest {
  name?: string
  description?: string
  status?: ClassStatus
}
