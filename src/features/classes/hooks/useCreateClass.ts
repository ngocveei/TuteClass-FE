
import { useMutation, useQuery } from '@tanstack/react-query';
import { createClassApi } from '../api/createClass.api';
import type { CreateClassCommand } from '../types/classCreate.types';

export const createClassOptionsQueryKey = ['classes', 'create-options'] as const;

export function useCreateClassOptions(enabled = true) {
  return useQuery({
    queryKey: createClassOptionsQueryKey,
    queryFn: () => createClassApi.getOptions(),
    enabled,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

export function useUploadClassImage() {
  return useMutation({ mutationFn: (file: File) => createClassApi.uploadImage(file) });
}

export function useCreateClass() {
  return useMutation({ mutationFn: (command: CreateClassCommand) => createClassApi.create(command) });
}

export function useCreateClassInvitation() {
  return useMutation({
    mutationFn: ({ classId, request }: { classId: string; request: { maxUses: number | null; expiresAt: string | null } }) =>
      createClassApi.createInvitation(classId, request),
  });
}
