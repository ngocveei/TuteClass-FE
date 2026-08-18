
import axios from 'axios';
import { apiClient } from '@/services/api/apiClient';
import { classEndpoints } from '@/features/classes/api/classEndpoints';
import type {
  ClassSettings,
  ClassSettingsDetail,
  ClassStatus,
  FeeType,
  GradeLevel,
  SubjectSummary,
  UpdateClassSettingsRequest,
} from '../types/classSettings.types';
import { ClassSettingsApiError } from '../types/classSettings.errors';
import { SESSION_DURATION_LIMITS, validateSessionDurationMinutes } from '../utils/classSettings.utils';

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ClassSettingsApiError(`Phản hồi máy chủ thiếu trường ${field}.`);
  }
  return value;
}



function requireNullableString(record: Record<string, unknown>, field: string): string | null {
  if (!(field in record) || (record[field] !== null && typeof record[field] !== 'string')) {
    throw new ClassSettingsApiError(`Phản hồi máy chủ có trường ${field} không hợp lệ.`);
  }
  return record[field] as string | null;
}

function normalizeSubject(value: unknown): SubjectSummary {
  const subject = asRecord(value);
  if (!subject) throw new ClassSettingsApiError('Phản hồi máy chủ thiếu thông tin môn học.');
  return {
    subjectId: requireString(subject.subjectId, 'subject.subjectId'),
    subjectName: requireString(subject.subjectName, 'subject.subjectName'),
  };
}

function getBoolProp(record: Record<string, unknown> | null, ...keys: string[]): boolean {
  if (!record) return false;
  for (const key of keys) {
    if (key in record && record[key] !== undefined && record[key] !== null) {
      const val = record[key];
      if (typeof val === 'boolean') return val;
      if (typeof val === 'number') return val === 1;
      if (typeof val === 'string') return val.toLowerCase() === 'true' || val === '1';
    }
  }
  return false;
}

function parseFeeType(value: unknown): FeeType {
  if (typeof value === 'number') {
    if (value === 0) return 'Free';
    if (value === 1) return 'Monthly';
    if (value === 2) return 'PerSession';
  }
  if (typeof value === 'string') {
    const val = value.trim();
    if (val === '0' || val.toLowerCase() === 'free') return 'Free';
    if (val === '1' || val.toLowerCase() === 'monthly') return 'Monthly';
    if (val === '2' || val.toLowerCase() === 'persession') return 'PerSession';
  }
  return 'Monthly';
}

function parseClassStatus(value: unknown): ClassStatus {
  if (typeof value === 'number') {
    if (value === 1) return 'Completed';
    return 'Active';
  }
  if (typeof value === 'string') {
    const val = value.trim().toLowerCase();
    if (val === '1' || val === 'completed') return 'Completed';
    return 'Active';
  }
  return 'Active';
}

function normalizeSettings(value: unknown): ClassSettings {
  const settings = asRecord(value);
  const rawSessionDuration = settings?.sessionDurationMinutes ?? settings?.SessionDurationMinutes;
  const sessionDurationMinutes = rawSessionDuration === undefined || rawSessionDuration === null
    ? SESSION_DURATION_LIMITS.defaultValue
    : rawSessionDuration;
  if (typeof sessionDurationMinutes !== 'number' || !Number.isFinite(sessionDurationMinutes)) {
    throw new ClassSettingsApiError('Phản hồi máy chủ có thời lượng buổi học không hợp lệ.');
  }
  const durationError = validateSessionDurationMinutes(sessionDurationMinutes);
  if (durationError) throw new ClassSettingsApiError(`Phản hồi máy chủ không hợp lệ: ${durationError}`);
  return {
    requireStudentApproval: getBoolProp(settings, 'requireStudentApproval', 'RequireStudentApproval'),
    allowStudentLeave: getBoolProp(settings, 'allowStudentLeave', 'AllowStudentLeave'),
    allowStudentViewGrades: getBoolProp(settings, 'allowStudentViewGrades', 'AllowStudentViewGrades'),
    allowFeedActivity: getBoolProp(settings, 'allowFeedActivity', 'AllowFeedActivity'),
    sessionDurationMinutes,
  };
}

export function normalizeClassSettingsDetail(data: unknown): ClassSettingsDetail {
  const record = asRecord(data);
  if (!record) throw new ClassSettingsApiError('Phản hồi cài đặt lớp không hợp lệ.');

  const feeType = parseFeeType(record.feeType);
  const rawFeeAmount = typeof record.feeAmount === 'number' && !Number.isNaN(record.feeAmount) ? record.feeAmount : 0;

  return {
    classId: requireString(record.classId, 'classId'),
    className: requireString(record.className, 'className'),
    imageUrl: requireNullableString(record, 'imageUrl'),
    subject: normalizeSubject(record.subject),
    gradeLevel: (record.gradeLevel ? String(record.gradeLevel) : 'Grade9') as GradeLevel,
    description: requireNullableString(record, 'description'),
    feeType,
    feeAmount: feeType === 'Free' ? 0 : rawFeeAmount,
    status: parseClassStatus(record.status),
    settings: normalizeSettings(record.settings),
  };
}

function readFieldErrors(value: unknown): Record<string, string[]> | undefined {
  const record = asRecord(value);
  if (!record) return undefined;
  const entries = Object.entries(record).flatMap(([key, messages]) => {
    if (!Array.isArray(messages)) return [];
    const safeMessages = messages.filter(
      (message): message is string => typeof message === 'string' && Boolean(message),
    );
    return safeMessages.length ? ([[key, safeMessages]] as const) : [];
  });
  return entries.length ? Object.fromEntries(entries) : undefined;
}

export function toClassSettingsApiError(error: unknown, fallback: string): ClassSettingsApiError {
  if (error instanceof ClassSettingsApiError) return error;
  if (!axios.isAxiosError(error)) {
    return new ClassSettingsApiError(error instanceof Error ? error.message : fallback);
  }

  const status = error.response?.status;
  const data = asRecord(error.response?.data);
  const title = typeof data?.title === 'string' && data.title ? data.title : undefined;
  const traceId = typeof data?.traceId === 'string' ? data.traceId : undefined;

  let message = title || fallback;
  if (status === 409) {
    message = 'Bạn đã có một lớp khác với tên này.';
  } else if (status === 403) {
    message = 'Bạn không có quyền quản lý cài đặt của lớp học này.';
  } else if (status === 404) {
    message = 'Lớp học không tồn tại hoặc đã bị xóa.';
  } else if (status === 401) {
    message = 'Phiên đăng nhập đã hết hạn.';
  }

  return new ClassSettingsApiError(message, {
    status,
    traceId,
    fieldErrors: readFieldErrors(data?.errors),
  });
}

async function withClassSettingsError<T>(action: () => Promise<T>, fallback: string): Promise<T> {
  try {
    return await action();
  } catch (error) {
    throw toClassSettingsApiError(error, fallback);
  }
}

export const classSettingsApi = {
  getClassSettings(classId: string): Promise<ClassSettingsDetail> {
    return withClassSettingsError(async () => {
      const response = await apiClient.get<ClassSettingsDetail>(classEndpoints.settings(classId));
      return normalizeClassSettingsDetail(response.data);
    }, 'Không thể tải thông tin cài đặt lớp.');
  },

  updateClassSettings(classId: string, request: UpdateClassSettingsRequest): Promise<ClassSettingsDetail> {
    return withClassSettingsError(async () => {
      const response = await apiClient.put<ClassSettingsDetail>(
        classEndpoints.settings(classId),
        request,
      );
      return normalizeClassSettingsDetail(response.data);
    }, 'Không thể cập nhật cài đặt lớp.');
  },

  deleteClass(classId: string): Promise<void> {
    return withClassSettingsError(async () => {
      await apiClient.delete(classEndpoints.deleteClass(classId));
    }, 'Không thể xóa lớp học.');
  },
};

