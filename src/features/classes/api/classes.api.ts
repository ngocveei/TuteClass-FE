
import axios from 'axios';
import { apiClient } from '@/services/api/apiClient';
import { createLogger, createOperationId } from '@/services/logger';
import { classEndpoints } from '@/features/classes/api/classEndpoints';
import { mapTeacherClasses } from '@/features/classes/services/classMapper';
import type { ClassStatusFilter, TeacherClassMineDto, TeacherOwnedClass } from '../types/class.types';

const logger = createLogger('TeacherClasses');

export const teacherClassesApi = {
  async getMine(filter: ClassStatusFilter = 'All'): Promise<TeacherOwnedClass[]> {
    const operationId = createOperationId('teacher-classes');
    const classStatus = filter === 'All' ? undefined : filter;
    logger.info('mine.started', { filter }, operationId);
    try {
      const response = await apiClient.get<readonly TeacherClassMineDto[]>(classEndpoints.mine, {
        params: classStatus ? { status: classStatus } : undefined,
      });
      if (!Array.isArray(response.data)) throw new Error('Phản hồi danh sách lớp không hợp lệ.');
      const classes = mapTeacherClasses(response.data);
      logger.info('mine.succeeded', { filter, count: classes.length }, operationId);
      return classes;
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      logger.error('mine.failed', { filter, status }, operationId);
      throw error;
    }
  },
};
