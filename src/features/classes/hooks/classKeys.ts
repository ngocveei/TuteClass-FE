export const classKeys = {
  all: ['classes'] as const,
  detail: (classId: string) => ['classes', classId] as const,
}
