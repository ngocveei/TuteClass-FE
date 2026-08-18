
import axios from 'axios';
import { apiClient } from '@/services/api/apiClient';
import { createLogger, createOperationId } from '@/services/logger';
import { classEndpoints } from '@/features/classes/api/classEndpoints';
import type {
  AvailabilityStubDto,
  ChangeStudentClassResponseDto,
  ClassStudentDetailDto,
  ClassStudentsListResponseDto,
  EnrollmentStatus,
  RemoveStudentResponseDto,
  TeacherStudentDetail,
  TeacherStudentListData,
  TeacherStudentListQuery,
  TeacherStudentRow,
  UnavailableMetric,
} from '../types/classStudent.types';
import { TeacherStudentListApiError } from '../types/classStudent.errors';

const logger = createLogger('TeacherStudentList');

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function requiredString(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim()) throw new TeacherStudentListApiError(`Phản hồi máy chủ thiếu trường ${field}.`);
  return value.trim();
}

function requiredNumber(value: unknown, field: string) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new TeacherStudentListApiError(`Phản hồi máy chủ có trường ${field} không hợp lệ.`);
  }
  return value;
}

function requiredDate(value: unknown, field: string) {
  const date = requiredString(value, field);
  if (Number.isNaN(Date.parse(date))) throw new TeacherStudentListApiError(`Phản hồi máy chủ có trường ${field} không hợp lệ.`);
  return date;
}

function optionalString(value: unknown, field: string) {
  if (value === null || value === undefined) return null;
  return requiredString(value, field);
}

function optionalDate(value: unknown, field: string) {
  if (value === null || value === undefined) return null;
  return requiredDate(value, field);
}

function mapStatus(value: unknown): EnrollmentStatus {
  if (value === 'Active' || value === 'Left' || value === 'Removed') return value;
  throw new TeacherStudentListApiError('Phản hồi máy chủ có trạng thái học viên không hợp lệ.');
}

function mapUnavailableMetric(value: AvailabilityStubDto | undefined, field: string): UnavailableMetric {
  if (value?.available !== false) throw new TeacherStudentListApiError(`Phản hồi máy chủ có metric ${field} không hợp lệ.`);
  return { available: false };
}

function initials(fullName: string) {
  return fullName.split(/\s+/).filter(Boolean).slice(-2).map((part) => part[0]?.toUpperCase()).join('');
}

function enrollmentLabel(status: EnrollmentStatus) {
  if (status === 'Active') return 'Đang học';
  if (status === 'Left') return 'Đã rời lớp';
  return 'Đã bị xóa';
}

function mapStudent(item: NonNullable<ClassStudentsListResponseDto['items']>[number], index: number): TeacherStudentRow {
  const fullName = requiredString(item.fullName, `items[${index}].fullName`);
  const enrollmentStatus = mapStatus(item.enrollmentStatus);
  return {
    studentId: requiredString(item.studentId, `items[${index}].studentId`),
    fullName,
    email: requiredString(item.email, `items[${index}].email`),
    avatarUrl: typeof item.avatarUrl === 'string' && item.avatarUrl.trim() ? item.avatarUrl : null,
    initials: initials(fullName),
    enrollmentStatus,
    enrollmentLabel: enrollmentLabel(enrollmentStatus),
    joinedAt: requiredDate(item.joinedAt, `items[${index}].joinedAt`),
    metrics: {
      attendance: mapUnavailableMetric(item.metrics?.attendance, `items[${index}].metrics.attendance`),
      score: mapUnavailableMetric(item.metrics?.score, `items[${index}].metrics.score`),
      homework: mapUnavailableMetric(item.metrics?.homework, `items[${index}].metrics.homework`),
      fee: mapUnavailableMetric(item.metrics?.fee, `items[${index}].metrics.fee`),
      insight: mapUnavailableMetric(item.metrics?.insight, `items[${index}].metrics.insight`),
    },
  };
}

export function normalizeTeacherStudentList(responseDto: ClassStudentsListResponseDto): TeacherStudentListData {
  if (!Array.isArray(responseDto.items) || !responseDto.summary) {
    throw new TeacherStudentListApiError('Phản hồi danh sách học viên không hợp lệ.');
  }
  const summary = responseDto.summary;
  return {
    classId: requiredString(responseDto.classId, 'classId'),
    className: requiredString(responseDto.className, 'className'),
    summary: {
      totalStudents: requiredNumber(summary.totalStudents, 'summary.totalStudents'),
      activeCount: requiredNumber(summary.activeCount, 'summary.activeCount'),
      inactiveCount: requiredNumber(summary.inactiveCount, 'summary.inactiveCount'),
      avgAttendance: mapUnavailableMetric(summary.avgAttendance, 'summary.avgAttendance'),
      avgScore: mapUnavailableMetric(summary.avgScore, 'summary.avgScore'),
    },
    items: responseDto.items.map(mapStudent),
    page: requiredNumber(responseDto.page, 'page'),
    pageSize: requiredNumber(responseDto.pageSize, 'pageSize'),
    totalCount: requiredNumber(responseDto.totalCount, 'totalCount'),
  };
}

export function normalizeTeacherStudentDetail(responseDto: ClassStudentDetailDto): TeacherStudentDetail {
  const profile = asRecord(responseDto.profile);
  const summary = asRecord(responseDto.summary);
  const tabs = asRecord(responseDto.tabs);
  if (!profile || !summary || !tabs) {
    throw new TeacherStudentListApiError('Phản hồi chi tiết học viên không hợp lệ.');
  }

  const fullName = requiredString(responseDto.fullName, 'fullName');
  const enrollmentStatus = mapStatus(responseDto.enrollmentStatus);
  return {
    classId: requiredString(responseDto.classId, 'classId'),
    className: requiredString(responseDto.className, 'className'),
    gradeLevel: requiredString(responseDto.gradeLevel, 'gradeLevel'),
    studentId: requiredString(responseDto.studentId, 'studentId'),
    fullName,
    email: requiredString(responseDto.email, 'email'),
    phone: optionalString(responseDto.phone, 'phone'),
    avatarUrl: optionalString(responseDto.avatarUrl, 'avatarUrl'),
    initials: initials(fullName),
    enrollmentStatus,
    enrollmentLabel: enrollmentLabel(enrollmentStatus),
    joinedAt: requiredDate(responseDto.joinedAt, 'joinedAt'),
    profile: {
      dateOfBirth: optionalDate(profile.dateOfBirth, 'profile.dateOfBirth'),
      schoolName: optionalString(profile.schoolName, 'profile.schoolName'),
      parentName: optionalString(profile.parentName, 'profile.parentName'),
      parentPhone: optionalString(profile.parentPhone, 'profile.parentPhone'),
    },
    summary: {
      score: mapUnavailableMetric(summary.score as AvailabilityStubDto | undefined, 'summary.score'),
      attendance: mapUnavailableMetric(summary.attendance as AvailabilityStubDto | undefined, 'summary.attendance'),
      rank: mapUnavailableMetric(summary.rank as AvailabilityStubDto | undefined, 'summary.rank'),
    },
    tabs: {
      overview: mapUnavailableMetric(tabs.overview as AvailabilityStubDto | undefined, 'tabs.overview'),
      progress: mapUnavailableMetric(tabs.progress as AvailabilityStubDto | undefined, 'tabs.progress'),
      homework: mapUnavailableMetric(tabs.homework as AvailabilityStubDto | undefined, 'tabs.homework'),
      messages: mapUnavailableMetric(tabs.messages as AvailabilityStubDto | undefined, 'tabs.messages'),
      tuition: mapUnavailableMetric(tabs.tuition as AvailabilityStubDto | undefined, 'tabs.tuition'),
      notes: mapUnavailableMetric(tabs.notes as AvailabilityStubDto | undefined, 'tabs.notes'),
    },
  };
}

function mapError(error: unknown, target: 'list' | 'detail' = 'list') {
  if (!axios.isAxiosError(error)) return new TeacherStudentListApiError('Không thể tải danh sách học viên. Vui lòng thử lại.');
  const status = error.response?.status;
  const data = asRecord(error.response?.data);
  const title = typeof data?.title === 'string' && data.title ? data.title : undefined;
  if (status === 403) return new TeacherStudentListApiError('Bạn không có quyền xem danh sách học viên của lớp này.', status);
  if (status === 404) return new TeacherStudentListApiError(target === 'detail' ? 'Không tìm thấy học viên trong lớp này.' : 'Không tìm thấy lớp học này.', status);
  if (status === 401) return new TeacherStudentListApiError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.', status);
  return new TeacherStudentListApiError(title ?? 'Không thể tải danh sách học viên. Vui lòng thử lại.', status);
}

function mapChangeClassError(error: unknown) {
  if (!axios.isAxiosError(error)) return new TeacherStudentListApiError('Không thể đổi lớp cho học viên. Vui lòng thử lại.');
  const status = error.response?.status;
  const data = asRecord(error.response?.data);
  const code = typeof data?.code === 'string' ? data.code : undefined;
  const rawMsg = (typeof data?.title === 'string' && data.title) || (typeof data?.message === 'string' && data.message) || (typeof data?.detail === 'string' && data.detail) || '';

  if (status === 400 && (code === 'ClassStudent.SameClass' || rawMsg.toLowerCase().includes('same class'))) {
    return new TeacherStudentListApiError('Lớp đích phải khác lớp hiện tại.', status);
  }
  if (status === 401) {
    return new TeacherStudentListApiError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.', status);
  }
  if (status === 403) {
    return new TeacherStudentListApiError('Bạn không có quyền chuyển học viên hoặc không quản lý cả 2 lớp này.', status);
  }
  if (status === 404) {
    return new TeacherStudentListApiError('Không tìm thấy học viên hoặc lớp học nguồn.', status);
  }
  if (code === 'ClassStudent.NotActive' || rawMsg.includes('Only Active students') || rawMsg.toLowerCase().includes('active student')) {
    return new TeacherStudentListApiError('Chỉ học viên đang hoạt động (Active) mới có thể chuyển sang lớp khác.', status);
  }
  if (code === 'Class.NotActive' || rawMsg.toLowerCase().includes('target class')) {
    return new TeacherStudentListApiError('Lớp đích không ở trạng thái hoạt động.', status);
  }
  if (code === 'ClassStudent.DifferentSubject' || rawMsg.toLowerCase().includes('same subject') || rawMsg.toLowerCase().includes('different subject')) {
    return new TeacherStudentListApiError('Chỉ có thể chuyển học viên giữa các lớp cùng môn học và cùng khối lớp.', status);
  }
  if (code === 'ClassStudent.AlreadyJoined' || rawMsg.toLowerCase().includes('already')) {
    return new TeacherStudentListApiError('Học viên đã ở trong lớp đích.', status);
  }
  return new TeacherStudentListApiError('Không thể đổi lớp cho học viên. Vui lòng thử lại.', status);
}

function mapRemoveStudentError(error: unknown) {
  if (!axios.isAxiosError(error)) return new TeacherStudentListApiError('Không thể xóa học sinh khỏi lớp. Vui lòng thử lại.');
  const status = error.response?.status;
  const data = asRecord(error.response?.data);
  const rawMsg = (typeof data?.title === 'string' && data.title) || (typeof data?.message === 'string' && data.message) || '';

  if (status === 401) return new TeacherStudentListApiError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.', status);
  if (status === 403) return new TeacherStudentListApiError('Bạn không có quyền xóa học sinh khỏi lớp này.', status);
  if (status === 404) return new TeacherStudentListApiError('Không tìm thấy bản ghi tham gia lớp của học sinh.', status);
  if (status === 409) {
    if (rawMsg.toLowerCase().includes('already removed')) return new TeacherStudentListApiError('Học sinh này đã bị xóa khỏi lớp trước đó.', status);
    if (rawMsg.toLowerCase().includes('active student')) return new TeacherStudentListApiError('Chỉ có thể xóa học sinh đang học (Active) khỏi lớp.', status);
  }
  return new TeacherStudentListApiError(rawMsg || 'Không thể xóa học sinh khỏi lớp. Vui lòng thử lại.', status);
}

export const teacherStudentListApi = {
  async getStudents(query: TeacherStudentListQuery): Promise<TeacherStudentListData> {
    const operationId = createOperationId('teacher-students');
    logger.info('list.started', { classId: query.classId, status: query.status ?? 'all', page: query.page }, operationId);
    try {
      const response = await apiClient.get<ClassStudentsListResponseDto>(classEndpoints.classStudents(query.classId), {
        params: { q: query.q || undefined, status: query.status, page: query.page, pageSize: query.pageSize },
      });
      const data = normalizeTeacherStudentList(response.data);
      logger.info('list.succeeded', { classId: data.classId, status: query.status ?? 'all', page: data.page, totalCount: data.totalCount }, operationId);
      return data;
    } catch (error) {
      const mapped = mapError(error);
      logger.error('list.failed', { classId: query.classId, status: query.status ?? 'all', page: query.page, statusCode: mapped.status, error: mapped }, operationId);
      throw mapped;
    }
  },
  async getStudentDetail(classId: string, studentId: string): Promise<TeacherStudentDetail> {
    const operationId = createOperationId('teacher-student-detail');
    logger.info('detail.started', { classId, studentId }, operationId);
    try {
      const response = await apiClient.get<ClassStudentDetailDto>(classEndpoints.classStudentDetail(classId, studentId));
      const data = normalizeTeacherStudentDetail(response.data);
      logger.info('detail.succeeded', { classId: data.classId, studentId: data.studentId }, operationId);
      return data;
    } catch (error) {
      const mapped = mapError(error, 'detail');
      logger.error('detail.failed', { classId, studentId, statusCode: mapped.status, error: mapped }, operationId);
      throw mapped;
    }
  },
  async changeClass(classId: string, studentId: string, targetClassId: string): Promise<ChangeStudentClassResponseDto> {
    const operationId = createOperationId('teacher-student-change-class');
    logger.info('changeClass.started', { classId, studentId, targetClassId }, operationId);
    try {
      const response = await apiClient.post<ChangeStudentClassResponseDto>(
        classEndpoints.changeStudentClass(classId, studentId),
        { targetClassId }
      );
      logger.info('changeClass.succeeded', { classId, studentId, targetClassId }, operationId);
      return response.data;
    } catch (error) {
      const mapped = mapChangeClassError(error);
      logger.error('changeClass.failed', { classId, studentId, targetClassId, statusCode: mapped.status, error: mapped }, operationId);
      throw mapped;
    }
  },
  async removeStudent(classId: string, studentId: string): Promise<RemoveStudentResponseDto> {
    const operationId = createOperationId('teacher-student-remove');
    logger.info('removeStudent.started', { classId, studentId }, operationId);
    try {
      const response = await apiClient.post<RemoveStudentResponseDto>(
        classEndpoints.removeStudentFromClass(classId, studentId)
      );
      logger.info('removeStudent.succeeded', { classId, studentId }, operationId);
      return response.data;
    } catch (error) {
      const mapped = mapRemoveStudentError(error);
      logger.error('removeStudent.failed', { classId, studentId, statusCode: mapped.status, error: mapped }, operationId);
      throw mapped;
    }
  },
};

