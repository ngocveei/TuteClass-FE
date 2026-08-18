import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClass } from '@/features/classes/api/class.api'
import { classKeys } from '@/features/classes/hooks/classKeys'

export function useCreateClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createClass,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: classKeys.all }),
  })
}
