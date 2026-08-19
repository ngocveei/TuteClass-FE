
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teacherClassKeys } from '@/features/classes/hooks/teacherClassKeys';
import { classSettingsApi } from '../api/classSettings.api';
import type { UpdateClassSettingsRequest } from '../types/classSettings.types';

export function classSettingsQueryKey(classId: string) {
  return ['teaching', 'class-settings', classId] as const;
}

export function useClassSettingsQuery(classId: string | undefined) {
  return useQuery({
    queryKey: classSettingsQueryKey(classId || ''),
    queryFn: () => classSettingsApi.getClassSettings(classId || ''),
    enabled: Boolean(classId),
  });
}

export function useUpdateClassSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, request }: { classId: string; request: UpdateClassSettingsRequest }) =>
      classSettingsApi.updateClassSettings(classId, request),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(classSettingsQueryKey(variables.classId), data);
      void queryClient.invalidateQueries({ queryKey: teacherClassKeys.mine() });
    },
  });
}

export function useDeleteClassMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (classId: string) => classSettingsApi.deleteClass(classId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: teacherClassKeys.mine() });
    },
  });
}

