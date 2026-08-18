import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateClass } from '@/features/classes/api/class.api'
import { classKeys } from '@/features/classes/hooks/classKeys'
import type { UpdateClassRequest } from '@/features/classes/types/class.types'

interface UpdateClassVariables {
  id: string
  data: UpdateClassRequest
}

export function useUpdateClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateClassVariables) => updateClass(id, data),
    onSuccess: (_, variables) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: classKeys.all }),
        queryClient.invalidateQueries({ queryKey: classKeys.detail(variables.id) }),
      ]),
  })
}
