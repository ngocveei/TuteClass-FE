import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSessions,
  revokeOtherSessions,
  revokeSession,
} from "@/features/profile/api/session.api";

const sessionKeys = {
  all: ["profile", "sessions"] as const,
};

export function useSessions() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: sessionKeys.all,
    queryFn: getSessions,
    staleTime: 15_000,
  });
  const revokeOne = useMutation({
    mutationFn: revokeSession,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: sessionKeys.all }),
  });
  const revokeOthers = useMutation({
    mutationFn: revokeOtherSessions,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: sessionKeys.all }),
  });

  return { query, revokeOne, revokeOthers };
}
