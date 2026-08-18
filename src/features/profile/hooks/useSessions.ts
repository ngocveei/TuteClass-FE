import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSessions, revokeOtherSessions, revokeSession } from '@/features/profile/api/session.api'
const key=['profile','sessions'] as const
export function useSessions(){const qc=useQueryClient();const query=useQuery({queryKey:key,queryFn:getSessions,staleTime:15_000});const one=useMutation({mutationFn:revokeSession,onSuccess:()=>qc.invalidateQueries({queryKey:key})});const others=useMutation({mutationFn:revokeOtherSessions,onSuccess:()=>qc.invalidateQueries({queryKey:key})});return{query,one,others}}
