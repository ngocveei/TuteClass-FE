
import axios from 'axios';
import { apiClient } from '@/services/api/apiClient';
import { createLogger, createOperationId } from '@/services/logger';
import { classEndpoints } from '@/features/classes/api/classEndpoints';
import { ClassSettingsApiError } from '../types/classSettings.errors';
import type {
  ClassInvitationDto,
  ClassInvitationsListDto,
  CreateInvitationRequest,
  UpdateInvitationRequest,
} from '../types/classInvitation.types';

const logger = createLogger('ClassInvitationService');

function parseApiError(error: unknown, fallbackMessage: string): ClassSettingsApiError {
  if (axios.isAxiosError(error) && error.response) {
    const { status, data } = error.response;
    const dataRecord = data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
    const title = typeof dataRecord?.title === 'string' ? dataRecord.title : undefined;

    let message = title || fallbackMessage;
    if (status === 401) {
      message = 'Phiên đăng nhập đã hết hạn.';
    } else if (status === 403) {
      message = 'Bạn không có quyền quản lý mã lời mời của lớp học này.';
    } else if (status === 404) {
      message = 'Lớp học hoặc mã lời mời không tồn tại.';
    }

    return new ClassSettingsApiError(message, {
      status,
      traceId: typeof dataRecord?.traceId === 'string' ? dataRecord.traceId : undefined,
    });
  }

  if (error instanceof ClassSettingsApiError) return error;
  return new ClassSettingsApiError(fallbackMessage);
}

function asRecord(val: unknown): Record<string, unknown> | null {
  return val && typeof val === 'object' && !Array.isArray(val) ? (val as Record<string, unknown>) : null;
}

function getProp<T>(record: Record<string, unknown> | null, ...keys: string[]): T | undefined {
  if (!record) return undefined;
  for (const k of keys) {
    if (k in record && record[k] !== undefined && record[k] !== null) {
      return record[k] as T;
    }
  }
  return undefined;
}

export function normalizeInvitationItem(raw: unknown): ClassInvitationDto {
  const rec = asRecord(raw);
  const invitationId = getProp<string>(rec, 'invitationId', 'InvitationId', 'id', 'Id') ?? '';
  const classId = getProp<string>(rec, 'classId', 'ClassId') ?? '';
  const inviteCode = getProp<string>(rec, 'inviteCode', 'InviteCode', 'code', 'Code') ?? '';
  const inviteToken = getProp<string>(rec, 'inviteToken', 'InviteToken', 'token', 'Token') ?? '';
  const inviteLink = getProp<string>(rec, 'inviteLink', 'InviteLink', 'link', 'Link') ?? '';
  const maxUsesRaw = getProp<number | null>(rec, 'maxUses', 'MaxUses');
  const maxUses = typeof maxUsesRaw === 'number' && !Number.isNaN(maxUsesRaw) ? maxUsesRaw : null;
  const usedCountRaw = getProp<number>(rec, 'usedCount', 'UsedCount');
  const usedCount = typeof usedCountRaw === 'number' && !Number.isNaN(usedCountRaw) ? usedCountRaw : 0;
  const expiresAt = getProp<string | null>(rec, 'expiresAt', 'ExpiresAt') ?? null;
  
  const isActiveRaw = getProp<unknown>(rec, 'isActive', 'IsActive');
  let isActive = true;
  if (typeof isActiveRaw === 'boolean') {
    isActive = isActiveRaw;
  } else if (typeof isActiveRaw === 'number') {
    isActive = isActiveRaw === 1;
  } else if (typeof isActiveRaw === 'string') {
    isActive = isActiveRaw.toLowerCase() === 'true' || isActiveRaw === '1';
  }

  const createdByUserId = getProp<string>(rec, 'createdByUserId', 'CreatedByUserId') ?? '';
  const createdAt = getProp<string>(rec, 'createdAt', 'CreatedAt') ?? '';

  return {
    invitationId,
    classId,
    inviteCode,
    inviteToken,
    inviteLink,
    maxUses,
    usedCount,
    expiresAt,
    isActive,
    createdByUserId,
    createdAt,
  };
}

export function normalizeClassInvitationsList(data: unknown): ClassInvitationsListDto {
  if (Array.isArray(data)) {
    return {
      classId: '',
      className: '',
      items: data.map(normalizeInvitationItem),
    };
  }

  const rec = asRecord(data);
  if (!rec) {
    return { classId: '', className: '', items: [] };
  }

  const classId = getProp<string>(rec, 'classId', 'ClassId') ?? '';
  const className = getProp<string>(rec, 'className', 'ClassName') ?? '';
  const rawItems = getProp<unknown[]>(rec, 'items', 'Items', 'invitations', 'Invitations', 'data', 'Data', 'list', 'List') ?? [];

  const items = Array.isArray(rawItems) ? rawItems.map(normalizeInvitationItem) : [];

  return { classId, className, items };
}

export const classInvitationApi = {
  async getInvitations(classId: string): Promise<ClassInvitationsListDto> {
    const operationId = createOperationId('get-invitations');
    logger.info('getInvitations.started', { classId }, operationId);

    try {
      const response = await apiClient.get<unknown>(
        classEndpoints.invitations(classId),
      );
      const normalized = normalizeClassInvitationsList(response.data);
      logger.info(
        'getInvitations.succeeded',
        { classId, itemCount: normalized.items.length },
        operationId,
      );
      return normalized;
    } catch (error) {
      logger.error('getInvitations.failed', { classId }, operationId);
      throw parseApiError(error, 'Không thể tải danh sách mã tham gia.');
    }
  },

  async createInvitation(
    classId: string,
    payload: CreateInvitationRequest,
  ): Promise<ClassInvitationDto> {
    const operationId = createOperationId('create-invitation');
    logger.info('createInvitation.started', { classId, payload }, operationId);

    try {
      const response = await apiClient.post<unknown>(
        classEndpoints.invitations(classId),
        payload,
      );
      const normalized = normalizeInvitationItem(response.data);
      logger.info(
        'createInvitation.succeeded',
        { classId, invitationId: normalized.invitationId },
        operationId,
      );
      return normalized;
    } catch (error) {
      logger.error('createInvitation.failed', { classId }, operationId);
      throw parseApiError(error, 'Không thể tạo mã tham gia mới.');
    }
  },

  async updateInvitation(
    classId: string,
    invitationId: string,
    payload: UpdateInvitationRequest,
  ): Promise<ClassInvitationDto> {
    const operationId = createOperationId('update-invitation');
    logger.info('updateInvitation.started', { classId, invitationId, payload }, operationId);

    try {
      const response = await apiClient.put<unknown>(
        classEndpoints.updateInvitation(classId, invitationId),
        payload,
      );
      const normalized = normalizeInvitationItem(response.data);
      logger.info(
        'updateInvitation.succeeded',
        { classId, invitationId: normalized.invitationId },
        operationId,
      );
      return normalized;
    } catch (error) {
      logger.error('updateInvitation.failed', { classId, invitationId }, operationId);
      throw parseApiError(error, 'Không thể cập nhật mã tham gia.');
    }
  },
};

