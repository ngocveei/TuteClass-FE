import { apiClient } from '@/services/api/apiClient'
import type { Class, CreateClassOptions, CreateClassRequest, UpdateClassRequest } from '@/features/classes/types/class.types'

interface TeacherClassDto {
  classId: string
  className: string
  studentCount: number
  pendingApprovalCount: number
  imageUrl?: string
  status: Class['status']
}

interface CreatedClassDto extends TeacherClassDto {
  description?: string
  createdAt: string
}

const mapClass = (item: TeacherClassDto): Class => ({
  id: item.classId,
  name: item.className,
  studentCount: item.studentCount,
  pendingApprovalCount: item.pendingApprovalCount,
  imageUrl: item.imageUrl,
  status: item.status,
})

export async function getClasses(): Promise<Class[]> {
  const response = await apiClient.get<TeacherClassDto[]>('/api/classes/mine')
  return response.data.map(mapClass)
}

export async function getClassById(id: string): Promise<Class> {
  const classes = await getClasses()
  const item = classes.find((classItem) => classItem.id === id)
  if (!item) throw new Error('Không tìm thấy lớp học.')
  return item
}

export async function createClass(data: CreateClassRequest): Promise<Class> {
  const response = await apiClient.post<CreatedClassDto>('/api/classes', {
    ...data,
    imageUrl: null,
    settings: null,
  })
  return {
    ...mapClass({ ...response.data, studentCount: 0, pendingApprovalCount: 0 }),
    description: response.data.description,
    createdAt: response.data.createdAt,
  }
}

export async function getCreateClassOptions(): Promise<CreateClassOptions> {
  const response = await apiClient.get<CreateClassOptions>('/api/classes/create-options')
  return response.data
}

export async function updateClass(id: string, data: UpdateClassRequest): Promise<Class> {
  const response = await apiClient.put<Class>(`/api/classes/${id}/settings`, data)
  return response.data
}

export async function deleteClass(id: string): Promise<void> {
  await apiClient.delete(`/api/classes/${id}`)
}
