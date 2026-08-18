
import axios from 'axios';
import { apiClient } from '@/services/api/apiClient';
import { createLogger, createOperationId } from '@/services/logger';
import { classEndpoints } from '@/features/classes/api/classEndpoints';
import type {
  ClassInvitationDto,
  ClassInvitationsListDto,
  TeacherClassInvitation,
} from '../types/classOverview.types';

const logger = createLogger('TeacherClassInvitation');

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Phản hồi mã mời thiếu trường ${field}.`);
  }

  return value.trim();
}

function optionalFutureOrPastDate(value: unknown, field: string): string | null {
  if (value === null || value === undefined) return null;
  const date = requiredString(value, field);
  if (Number.isNaN(Date.parse(date))) throw new Error(`Phản hồi mã mời có ${field} không hợp lệ.`);
  return date;
}

function requiredDate(value: unknown, field: string): string {
  const date = optionalFutureOrPastDate(value, field);
  if (date === null) throw new Error(`Phản hồi mã mời thiếu trường ${field}.`);
  return date;
}

function normalizeInvitation(responseDto: ClassInvitationDto, index: number): TeacherClassInvitation | null {
  if (responseDto.isActive !== true) return null;

  const expiresAt = optionalFutureOrPastDate(responseDto.expiresAt, `items[${index}].expiresAt`);
  if (expiresAt && Date.parse(expiresAt) <= Date.now()) return null;

  return {
    invitationId: requiredString(responseDto.invitationId, `items[${index}].invitationId`),
    classId: requiredString(responseDto.classId, `items[${index}].classId`),
    inviteCode: requiredString(responseDto.inviteCode, `items[${index}].inviteCode`),
    inviteLink: requiredString(responseDto.inviteLink, `items[${index}].inviteLink`),
    expiresAt,
    createdAt: requiredDate(responseDto.createdAt, `items[${index}].createdAt`),
  };
}

export function normalizeActiveInvitation(
  classId: string,
  responseDto: ClassInvitationsListDto,
): TeacherClassInvitation | null {
  if (requiredString(responseDto.classId, 'classId') !== classId) {
    throw new Error('Phản hồi mã mời không khớp với lớp đang chọn.');
  }
  if (!Array.isArray(responseDto.items)) throw new Error('Phản hồi mã mời thiếu danh sách items.');

  for (let index = 0; index < responseDto.items.length; index += 1) {
    const invitation = normalizeInvitation(responseDto.items[index], index);
    if (invitation) return invitation;
  }

  return null;
}

export const teacherClassInvitationApi = {
  async getActive(classId: string): Promise<TeacherClassInvitation | null> {
    const operationId = createOperationId('teacher-class-invitations');
    logger.info('get.started', { classId }, operationId);
    try {
      const response = await apiClient.get<ClassInvitationsListDto>(classEndpoints.invitations(classId));
      const invitation = normalizeActiveInvitation(classId, response.data);
      logger.info('get.succeeded', { classId, hasActiveInvitation: invitation !== null }, operationId);
      return invitation;
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      logger.error('get.failed', { classId, status }, operationId);
      throw error;
    }
  },
};

