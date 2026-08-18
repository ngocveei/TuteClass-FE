
import axios from 'axios';
import { apiClient } from '@/services/api/apiClient';
import { createLogger, createOperationId } from '@/services/logger';
import { classEndpoints } from '@/features/classes/api/classEndpoints';
import { JoinRequestsApiError } from '../types/classApproval.errors';
import type {
  ApproveJoinRequestResponse,
  JoinRequestItem,
  JoinRequestRow,
  JoinRequestsListData,
  JoinRequestsListResponse,
  JoinRequestsQuery,
  RejectJoinRequestResponse,
} from '../types/classApproval.types';

const logger = createLogger('JoinRequests');

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new JoinRequestsApiError(`Phản hồi máy chủ thiếu trường ${field}.`);
  }
  return value.trim();
}

function requiredNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new JoinRequestsApiError(`Phản hồi máy chủ có trường ${field} không hợp lệ.`);
  }
  return value;
}

function requiredDate(value: unknown, field: string): string {
  const date = requiredString(value, field);
  if (Number.isNaN(Date.parse(date))) {
    throw new JoinRequestsApiError(`Phản hồi máy chủ có trường ${field} không hợp lệ.`);
  }
  return date;
}

function enrollmentStatus(value: unknown): JoinRequestRow['status'] {
  if (value === 'Pending' || value === 'Active' || value === 'Rejected' || value === 'Left' || value === 'Removed') {
    return value;
  }
  return 'Pending';
}

function initials(fullName: string): string {
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'HS';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function mapItem(item: JoinRequestItem, index: number): JoinRequestRow {
  const fullName = requiredString(item.fullName, `items[${index}].fullName`);
  return {
    studentId: requiredString(item.studentId, `items[${index}].studentId`),
    fullName,
    email: requiredString(item.email, `items[${index}].email`),
    avatarUrl: typeof item.avatarUrl === 'string' && item.avatarUrl.trim() ? item.avatarUrl.trim() : null,
    requestedAt: requiredDate(item.requestedAt, `items[${index}].requestedAt`),
    initials: initials(fullName),
    status: enrollmentStatus(item.status),
  };
}

export function normalizeJoinRequestsList(dto: JoinRequestsListResponse): JoinRequestsListData {
  if (!Array.isArray(dto.items)) {
    throw new JoinRequestsApiError('Phản hồi danh sách yêu cầu không hợp lệ.');
  }
  return {
    classId: requiredString(dto.classId, 'classId'),
    className: requiredString(dto.className, 'className'),
    items: dto.items.map(mapItem),
    page: requiredNumber(dto.page, 'page'),
    pageSize: requiredNumber(dto.pageSize, 'pageSize'),
    totalCount: requiredNumber(dto.totalCount, 'totalCount'),
  };
}

export function normalizeApproveResponse(dto: ApproveJoinRequestResponse): ApproveJoinRequestResponse {
  return {
    classId: requiredString(dto.classId, 'classId'),
    studentId: requiredString(dto.studentId, 'studentId'),
    classStudentId: requiredString(dto.classStudentId, 'classStudentId'),
    enrollmentStatus: 'Active',
    joinedAt: requiredDate(dto.joinedAt, 'joinedAt'),
    updatedAt: requiredDate(dto.updatedAt, 'updatedAt'),
  };
}

export function normalizeRejectResponse(dto: RejectJoinRequestResponse): RejectJoinRequestResponse {
  return {
    classId: requiredString(dto.classId, 'classId'),
    studentId: requiredString(dto.studentId, 'studentId'),
    classStudentId: requiredString(dto.classStudentId, 'classStudentId'),
    enrollmentStatus: 'Rejected',
    joinedAt: requiredDate(dto.joinedAt, 'joinedAt'),
    updatedAt: requiredDate(dto.updatedAt, 'updatedAt'),
  };
}

function mapError(error: unknown, fallbackMessage: string): JoinRequestsApiError {
  if (!axios.isAxiosError(error)) {
    return new JoinRequestsApiError(
      error instanceof Error ? error.message : fallbackMessage,
    );
  }
  const status = error.response?.status;
  const data = asRecord(error.response?.data);
  const title = typeof data?.title === 'string' && data.title ? data.title : undefined;
  const traceId = typeof data?.traceId === 'string' ? data.traceId : undefined;

  if (status === 409) {
    return new JoinRequestsApiError('Yêu cầu này không còn ở trạng thái chờ duyệt.', status, traceId);
  }
  if (status === 403) {
    return new JoinRequestsApiError('Bạn không có quyền quản lý yêu cầu tham gia của lớp học này.', status, traceId);
  }
  if (status === 404) {
    return new JoinRequestsApiError('Không tìm thấy lớp học hoặc yêu cầu tham gia.', status, traceId);
  }
  if (status === 401) {
    return new JoinRequestsApiError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.', status, traceId);
  }
  return new JoinRequestsApiError(title ?? fallbackMessage, status, traceId);
}

export const joinRequestsApi = {
  async getJoinRequests(query: JoinRequestsQuery): Promise<JoinRequestsListData> {
    const operationId = createOperationId('join-requests');
    logger.info('get_list.started', { classId: query.classId, q: query.q, page: query.page }, operationId);
    try {
      const response = await apiClient.get<JoinRequestsListResponse>(
        classEndpoints.joinRequests(query.classId),
        {
          params: {
            q: query.q || undefined,
            status: query.status || undefined,
            sortBy: query.sortBy,
            sortDirection: query.sortDirection,
            page: query.page || 1,
            pageSize: query.pageSize || 20,
          },
        },
      );
      const data = normalizeJoinRequestsList(response.data);
      logger.info('get_list.succeeded', { classId: data.classId, count: data.items.length, total: data.totalCount }, operationId);
      return data;
    } catch (error) {
      const mapped = mapError(error, 'Không thể tải danh sách yêu cầu tham gia.');
      logger.error('get_list.failed', { classId: query.classId, status: mapped.status, error: mapped.message }, operationId);
      throw mapped;
    }
  },

  async approveJoinRequest(classId: string, studentId: string): Promise<ApproveJoinRequestResponse> {
    const operationId = createOperationId('join-requests-approve');
    logger.info('approve.started', { classId, studentId }, operationId);
    try {
      const response = await apiClient.post<ApproveJoinRequestResponse>(
        classEndpoints.approveJoinRequest(classId, studentId),
      );
      const data = normalizeApproveResponse(response.data);
      logger.info('approve.succeeded', { classId, studentId, classStudentId: data.classStudentId }, operationId);
      return data;
    } catch (error) {
      const mapped = mapError(error, 'Không thể phê duyệt yêu cầu tham gia.');
      logger.error('approve.failed', { classId, studentId, status: mapped.status, error: mapped.message }, operationId);
      throw mapped;
    }
  },

  async rejectJoinRequest(classId: string, studentId: string): Promise<RejectJoinRequestResponse> {
    const operationId = createOperationId('join-requests-reject');
    logger.info('reject.started', { classId, studentId }, operationId);
    try {
      const response = await apiClient.post<RejectJoinRequestResponse>(
        classEndpoints.rejectJoinRequest(classId, studentId),
      );
      const data = normalizeRejectResponse(response.data);
      logger.info('reject.succeeded', { classId, studentId, classStudentId: data.classStudentId }, operationId);
      return data;
    } catch (error) {
      const mapped = mapError(error, 'Không thể từ chối yêu cầu tham gia.');
      logger.error('reject.failed', { classId, studentId, status: mapped.status, error: mapped.message }, operationId);
      throw mapped;
    }
  },
};

