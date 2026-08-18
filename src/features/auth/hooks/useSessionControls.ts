import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/features/auth/api/auth.api'
import { ROUTES } from '@/shared/constants/routes'

export function useSessionControls() {
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: logout,
    onSettled: () => navigate(ROUTES.landing, { replace: true }),
  })

  return {
    isPending: mutation.isPending,
    signOut: () => mutation.mutate(),
    navigateTo: (target: string) => navigate(target),
  }
}
