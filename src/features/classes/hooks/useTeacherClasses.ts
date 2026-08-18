
import { useQuery } from '@tanstack/react-query';
import { teacherClassKeys } from '@/features/classes/hooks/teacherClassKeys';
import { teacherClassesApi } from '../api/classes.api';
import type { ClassStatusFilter } from '../types/class.types';

export function useTeacherClasses(filter: ClassStatusFilter = 'All') {
  const status = filter === 'All' ? undefined : filter;
  return useQuery({
    queryKey: status ? teacherClassKeys.mine(status) : teacherClassKeys.mine(),
    queryFn: () => teacherClassesApi.getMine(filter),
    retry: (attempt, error) => {
      const status = (error as { response?: { status?: number } }).response?.status;
      return status !== 401 && status !== 403 && attempt < 1;
    },
  });
}

