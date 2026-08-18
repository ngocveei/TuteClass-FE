import { useQuery } from '@tanstack/react-query'
import { getClasses } from '@/features/classes/api/class.api'
import { classKeys } from '@/features/classes/hooks/classKeys'

export function useClasses() {
  return useQuery({ queryKey: classKeys.all, queryFn: getClasses })
}
