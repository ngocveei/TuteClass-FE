
import { useQuery } from '@tanstack/react-query';
import { teacherClassKeys } from '@/features/classes/hooks/teacherClassKeys';
import { teacherClassInvitationApi } from '../api/classOverviewInvitation.api';

export function useTeacherClassInvitation(classId: string | null) {
  return useQuery({
    queryKey: classId ? teacherClassKeys.invitations(classId) : ['teacher-classes', 'none', 'active-invitation'],
    queryFn: () => teacherClassInvitationApi.getActive(classId!),
    enabled: classId !== null,
    retry: (attempt, error) => {
      const status = (error as { response?: { status?: number } }).response?.status;
      return status !== 401 && status !== 403 && status !== 404 && attempt < 1;
    },
  });
}

