import { useQuery } from '@tanstack/react-query'
import { getClassById } from '@/features/classes/api/class.api'
import { classKeys } from '@/features/classes/hooks/classKeys'

export function useClass(classId: string) {
  return useQuery({
    queryKey: classKeys.detail(classId),
    queryFn: () => getClassById(classId),
    enabled: Boolean(classId),
  })
}
