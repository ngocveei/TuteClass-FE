
import axios from 'axios';
import { apiClient } from '@/services/api/apiClient';
import { classEndpoints } from '@/features/classes/api/classEndpoints';
import type {
  ClassGradeLevelOption,
  ClassInvitation,
  ClassInvitationResponseDto,
  ClassProblemDetailsDto,
  ClassSettings,
  CreateClassCommand,
  CreateClassOptions,
  CreateClassOptionsResponseDto,
  CreateClassRequestDto,
  CreateClassResponseDto,
  CreatedClass,
  GenerateClassInvitationRequestDto,
  UploadClassImageResponseDto,
} from '../types/classCreate.types';
import { CreateClassApiError } from '../types/classCreate.errors';

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CreateClassApiError(`Phản hồi máy chủ thiếu trường ${field}.`);
  }
  return value;
}

function requireDate(value: unknown, field: string): string {
  const date = requireString(value, field);
  if (Number.isNaN(Date.parse(date))) {
    throw new CreateClassApiError(`Phản hồi máy chủ có trường ${field} không hợp lệ.`);
  }
  return date;
}

function requireBoolean(value: unknown, field: string): boolean {
  if (typeof value !== 'boolean') {
    throw new CreateClassApiError(`Phản hồi máy chủ thiếu trường ${field}.`);
  }
  return value;
}

function requireNullableString(record: Record<string, unknown>, field: string): string | null {
  if (!(field in record) || (record[field] !== null && typeof record[field] !== 'string')) {
    throw new CreateClassApiError(`Phản hồi máy chủ có trường ${field} không hợp lệ.`);
  }
  return record[field] as string | null;
}

function displayGradeLabel(label: string) {
  return /^\d+$/.test(label) ? `Lớp ${label}` : label;
}

export function normalizeCreateClassOptions(responseDto: CreateClassOptionsResponseDto): CreateClassOptions {
  if (!Array.isArray(responseDto.subjects) || !Array.isArray(responseDto.gradeLevels)) {
    throw new CreateClassApiError('Phản hồi danh mục tạo lớp không hợp lệ.');
  }

  const subjects = responseDto.subjects.map((subject, index) => ({
    subjectId: requireString(subject?.subjectId, `subjects[${index}].subjectId`),
    subjectName: requireString(subject?.subjectName, `subjects[${index}].subjectName`),
  }));
  const gradeLevels: ClassGradeLevelOption[] = responseDto.gradeLevels.map((grade, index) => {
    const value = requireString(grade?.value, `gradeLevels[${index}].value`);
    const label = requireString(grade?.label, `gradeLevels[${index}].label`);
    return { value, label, displayLabel: displayGradeLabel(label) };
  });

  return { subjects, gradeLevels };
}

function normalizeSettings(value: unknown): ClassSettings {
  const settings = asRecord(value);
  if (!settings) throw new CreateClassApiError('Phản hồi máy chủ thiếu thông tin cài đặt lớp.');
  return {
    requireStudentApproval: requireBoolean(settings.requireStudentApproval, 'settings.requireStudentApproval'),
    allowStudentLeave: requireBoolean(settings.allowStudentLeave, 'settings.allowStudentLeave'),
    allowStudentViewGrades: requireBoolean(settings.allowStudentViewGrades, 'settings.allowStudentViewGrades'),
    allowFeedActivity: requireBoolean(settings.allowFeedActivity, 'settings.allowFeedActivity'),
  };
}

export function normalizeCreatedClass(responseDto: CreateClassResponseDto): CreatedClass {
  const response = asRecord(responseDto);
  const subject = asRecord(responseDto.subject);
  if (!response || !subject) throw new CreateClassApiError('Phản hồi tạo lớp không hợp lệ.');

  return {
    classId: requireString(responseDto.classId, 'classId'),
    className: requireString(responseDto.className, 'className'),
    imageUrl: requireNullableString(response, 'imageUrl'),
    subject: {
      subjectId: requireString(responseDto.subject?.subjectId, 'subject.subjectId'),
      subjectName: requireString(responseDto.subject?.subjectName, 'subject.subjectName'),
    },
    gradeLevel: requireString(responseDto.gradeLevel, 'gradeLevel'),
    description: requireNullableString(response, 'description'),
    status: requireString(responseDto.status, 'status'),
    settings: normalizeSettings(responseDto.settings),
    createdAt: requireDate(responseDto.createdAt, 'createdAt'),
  };
}

export function normalizeClassInvitation(responseDto: ClassInvitationResponseDto): ClassInvitation {
  const response = asRecord(responseDto);
  if (!response) throw new CreateClassApiError('Phản hồi mã mời không hợp lệ.');
  return {
    invitationId: requireString(responseDto.invitationId, 'invitationId'),
    classId: requireString(responseDto.classId, 'classId'),
    inviteCode: requireString(responseDto.inviteCode, 'inviteCode'),
    inviteToken: requireString(responseDto.inviteToken, 'inviteToken'),
    inviteLink: requireString(responseDto.inviteLink, 'inviteLink'),
    maxUses: typeof responseDto.maxUses === 'number' ? responseDto.maxUses : null,
    usedCount: typeof responseDto.usedCount === 'number' ? responseDto.usedCount : 0,
    expiresAt: requireNullableString(response, 'expiresAt'),
    isActive: requireBoolean(responseDto.isActive, 'isActive'),
    createdByUserId: requireString(responseDto.createdByUserId, 'createdByUserId'),
    createdAt: requireDate(responseDto.createdAt, 'createdAt'),
  };
}

function readFieldErrors(value: unknown): Record<string, string[]> | undefined {
  const record = asRecord(value);
  if (!record) return undefined;
  const entries = Object.entries(record).flatMap(([key, messages]) => {
    if (!Array.isArray(messages)) return [];
    const safeMessages = messages.filter((message): message is string => typeof message === 'string' && Boolean(message));
    return safeMessages.length ? [[key, safeMessages] as const] : [];
  });
  return entries.length ? Object.fromEntries(entries) : undefined;
}

function readHeaderTraceId(headers: unknown) {
  const record = asRecord(headers);
  const value = record?.['x-trace-id'] ?? record?.['X-Trace-Id'];
  return typeof value === 'string' && value ? value : undefined;
}

export function toCreateClassApiError(error: unknown, fallback: string): CreateClassApiError {
  if (error instanceof CreateClassApiError) return error;
  if (!axios.isAxiosError(error)) {
    return new CreateClassApiError(error instanceof Error ? error.message : fallback);
  }

  const data = asRecord(error.response?.data) as ClassProblemDetailsDto | null;
  const title = typeof data?.title === 'string' && data.title ? data.title : fallback;
  const traceId = typeof data?.traceId === 'string' && data.traceId
    ? data.traceId
    : readHeaderTraceId(error.response?.headers);
  return new CreateClassApiError(title, {
    status: error.response?.status,
    traceId,
    fieldErrors: readFieldErrors(data?.errors),
  });
}

async function withCreateClassError<T>(action: () => Promise<T>, fallback: string): Promise<T> {
  try {
    return await action();
  } catch (error) {
    throw toCreateClassApiError(error, fallback);
  }
}

export const createClassApi = {
  getOptions(): Promise<CreateClassOptions> {
    return withCreateClassError(async () => {
      const response = await apiClient.get<CreateClassOptionsResponseDto>(classEndpoints.createOptions);
      return normalizeCreateClassOptions(response.data);
    }, 'Không thể tải danh mục tạo lớp.');
  },

  uploadImage(file: File): Promise<string> {
    return withCreateClassError(async () => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post<UploadClassImageResponseDto>(
        classEndpoints.images,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return requireString(response.data.imageUrl, 'imageUrl');
    }, 'Không thể tải ảnh lớp lên máy chủ.');
  },

  create(command: CreateClassCommand): Promise<CreatedClass> {
    return withCreateClassError(async () => {
      const requestDto: CreateClassRequestDto = {
        className: command.className,
        imageUrl: command.imageUrl,
        subjectId: command.subjectId,
        gradeLevel: command.gradeLevel,
        description: command.description,
        settings: command.settings,
      };
      const response = await apiClient.post<CreateClassResponseDto>(classEndpoints.create, requestDto);
      return normalizeCreatedClass(response.data);
    }, 'Không thể tạo lớp học.');
  },

  createInvitation(classId: string, request: { maxUses: number | null; expiresAt: string | null }): Promise<ClassInvitation> {
    return withCreateClassError(async () => {
      const requestDto: GenerateClassInvitationRequestDto = {
        maxUses: request.maxUses,
        expiresAt: request.expiresAt,
      };
      const response = await apiClient.post<ClassInvitationResponseDto>(
        classEndpoints.invitations(classId),
        requestDto,
      );
      return normalizeClassInvitation(response.data);
    }, 'Không thể tạo mã mời tham gia lớp.');
  },
};

