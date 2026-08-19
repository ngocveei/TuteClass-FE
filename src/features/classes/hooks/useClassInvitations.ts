
import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { teacherClassKeys } from '@/features/classes/hooks/teacherClassKeys';
import { classInvitationApi } from '../api/classInvitations.api';
import type {
  ClassInvitationDto,
  ClassInvitationsListDto,
  CreateInvitationRequest,
  UpdateInvitationRequest,
} from '../types/classInvitation.types';

function upsertInvitation(
  current: ClassInvitationsListDto | undefined,
  invitation: ClassInvitationDto,
): ClassInvitationsListDto {
  if (!current) {
    return {
      classId: invitation.classId,
      className: '',
      items: [invitation],
    };
  }

  const exists = current.items.some((item) => item.invitationId === invitation.invitationId);
  return {
    ...current,
    items: exists
      ? current.items.map((item) => (
          item.invitationId === invitation.invitationId ? invitation : item
        ))
      : [invitation, ...current.items],
  };
}

async function refreshInvitationQueries(queryClient: QueryClient, classId: string) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: teacherClassKeys.invitations(classId),
    }),
    queryClient.invalidateQueries({
      queryKey: teacherClassKeys.invitations(classId),
    }),
  ]);
}

export function useClassInvitationsQuery(classId: string | undefined) {
  return useQuery({
    queryKey: teacherClassKeys.invitations(classId ?? ''),
    queryFn: () => classInvitationApi.getInvitations(classId!),
    enabled: Boolean(classId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, payload }: { classId: string; payload: CreateInvitationRequest }) =>
      classInvitationApi.createInvitation(classId, payload),
    onSuccess: async (invitation, variables) => {
      queryClient.setQueryData<ClassInvitationsListDto>(
        teacherClassKeys.invitations(variables.classId),
        (current) => upsertInvitation(current, invitation),
      );
      await refreshInvitationQueries(queryClient, variables.classId);
    },
  });
}

export function useUpdateInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classId,
      invitationId,
      payload,
    }: {
      classId: string;
      invitationId: string;
      payload: UpdateInvitationRequest;
    }) => classInvitationApi.updateInvitation(classId, invitationId, payload),
    onSuccess: async (invitation, variables) => {
      queryClient.setQueryData<ClassInvitationsListDto>(
        teacherClassKeys.invitations(variables.classId),
        (current) => upsertInvitation(current, invitation),
      );
      await refreshInvitationQueries(queryClient, variables.classId);
    },
  });
}

