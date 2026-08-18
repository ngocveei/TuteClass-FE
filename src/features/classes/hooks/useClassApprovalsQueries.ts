
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { joinRequestsApi } from '../api/classApprovals.api';
import type { JoinRequestsQuery } from '../types/classApproval.types';

export function joinRequestsQueryKey(
  classId: string,
  q?: string,
  status?: string,
  page?: number,
  pageSize?: number,
  sortBy?: string,
  sortDirection?: string,
) {
  return [
    'teaching',
    'class-approvals',
    classId,
    {
      q: q || '',
      status: status || '',
      page: page || 1,
      pageSize: pageSize || 20,
      sortBy: sortBy || '',
      sortDirection: sortDirection || '',
    },
  ] as const;
}

export function useJoinRequestsQuery(query: JoinRequestsQuery) {
  return useQuery({
    queryKey: joinRequestsQueryKey(query.classId, query.q, query.status, query.page, query.pageSize, query.sortBy, query.sortDirection),
    queryFn: () => joinRequestsApi.getJoinRequests(query),
    enabled: Boolean(query.classId),
  });
}

/**
 * The Backend returns only pending join requests from this endpoint.  Fetching
 * one item is therefore enough for consumers that only need the pending count.
 */
export function usePendingJoinRequestsCountQuery(classId: string | null | undefined) {
  return useQuery({
    queryKey: joinRequestsQueryKey(classId ?? '', undefined, undefined, 1, 1),
    queryFn: () => joinRequestsApi.getJoinRequests({ classId: classId!, page: 1, pageSize: 1 }),
    enabled: Boolean(classId),
  });
}

export function useApproveJoinRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) =>
      joinRequestsApi.approveJoinRequest(classId, studentId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['teaching', 'class-approvals', variables.classId],
      });
    },
  });
}

export function useRejectJoinRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) =>
      joinRequestsApi.rejectJoinRequest(classId, studentId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['teaching', 'class-approvals', variables.classId],
      });
    },
  });
}

