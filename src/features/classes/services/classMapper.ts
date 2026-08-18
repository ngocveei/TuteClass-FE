import type {
  TeacherClassMineDto,
  TeacherClassStatus,
  TeacherClassTone,
  TeacherOwnedClass,
} from '@/features/classes/types/class.types'

const tones: TeacherClassTone[] = ['amber', 'blue', 'rose', 'violet']

function requiredString(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Phản hồi máy chủ thiếu trường ${field}.`)
  }
  return value.trim()
}

function requiredCount(value: unknown, field: string) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error(`Phản hồi máy chủ có ${field} không hợp lệ.`)
  }
  return value
}

function requiredStatus(value: unknown, field: string): TeacherClassStatus {
  if (value === 'Active' || value === 'Completed') return value
  throw new Error(`Phản hồi máy chủ có ${field} không hợp lệ.`)
}

export function mapTeacherClasses(response: readonly TeacherClassMineDto[]): TeacherOwnedClass[] {
  return response.map((item, index) => ({
    classId: requiredString(item.classId, `items[${index}].classId`),
    className: requiredString(item.className, `items[${index}].className`),
    studentCount: requiredCount(item.studentCount, `items[${index}].studentCount`),
    imageUrl: typeof item.imageUrl === 'string' && item.imageUrl.trim() ? item.imageUrl : null,
    status: requiredStatus(item.status, `items[${index}].status`),
    tone: tones[index % tones.length],
  }))
}
