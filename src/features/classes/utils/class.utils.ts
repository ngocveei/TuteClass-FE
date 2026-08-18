import type { Class, ClassStatus } from '@/features/classes/types/class.types'

const statusLabels: Record<string, string> = {
  Completed: 'Đã hoàn thành',
  Active: 'Đang hoạt động',
  Inactive: 'Tạm ngưng',
  Archived: 'Đã lưu trữ',
}

export function getClassStatusText(status: ClassStatus): string {
  return statusLabels[status] ?? status
}

export function isClassFull(classItem: Class, capacity = 30): boolean {
  return classItem.studentCount >= capacity
}
