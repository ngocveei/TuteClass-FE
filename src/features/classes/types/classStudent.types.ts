import type { TeacherOwnedClass } from './class.types';

export interface AvailabilityStubDto { readonly available?: boolean }
export interface ClassStudentListMetricsDto {
  readonly attendance?: AvailabilityStubDto;
  readonly score?: AvailabilityStubDto;
  readonly homework?: AvailabilityStubDto;
  readonly fee?: AvailabilityStubDto;
  readonly insight?: AvailabilityStubDto;
}
export interface ClassStudentListItemDto {
  readonly studentId?: string;
  readonly fullName?: string | null;
  readonly email?: string | null;
  readonly avatarUrl?: string | null;
  readonly enrollmentStatus?: string | null;
  readonly joinedAt?: string;
  readonly metrics?: ClassStudentListMetricsDto;
}
export interface ClassStudentsSummaryDto {
  readonly totalStudents?: number;
  readonly activeCount?: number;
  readonly inactiveCount?: number;
  readonly avgAttendance?: AvailabilityStubDto;
  readonly avgScore?: AvailabilityStubDto;
}
export interface ClassStudentsListResponseDto {
  readonly classId?: string;
  readonly className?: string | null;
  readonly summary?: ClassStudentsSummaryDto;
  readonly items?: readonly ClassStudentListItemDto[] | null;
  readonly page?: number;
  readonly pageSize?: number;
  readonly totalCount?: number;
}
export interface ClassStudentProfileDto {
  readonly dateOfBirth?: string | null;
  readonly schoolName?: string | null;
  readonly parentName?: string | null;
  readonly parentPhone?: string | null;
}
export interface ClassStudentDetailSummaryDto {
  readonly score?: AvailabilityStubDto;
  readonly attendance?: AvailabilityStubDto;
  readonly rank?: AvailabilityStubDto;
}
export interface ClassStudentDetailTabsDto {
  readonly overview?: AvailabilityStubDto;
  readonly progress?: AvailabilityStubDto;
  readonly homework?: AvailabilityStubDto;
  readonly messages?: AvailabilityStubDto;
  readonly tuition?: AvailabilityStubDto;
  readonly notes?: AvailabilityStubDto;
}
export interface ClassStudentDetailDto {
  readonly classId?: string;
  readonly className?: string | null;
  readonly gradeLevel?: string | null;
  readonly studentId?: string;
  readonly fullName?: string | null;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly avatarUrl?: string | null;
  readonly enrollmentStatus?: string | null;
  readonly joinedAt?: string;
  readonly profile?: ClassStudentProfileDto;
  readonly summary?: ClassStudentDetailSummaryDto;
  readonly tabs?: ClassStudentDetailTabsDto;
}
export interface ChangeStudentClassRequestDto { readonly targetClassId?: string }
export interface ChangeStudentClassResponseDto {
  readonly sourceClassId?: string;
  readonly targetClassId?: string;
  readonly targetClassName?: string | null;
  readonly targetStatus?: string | null;
  readonly studentId?: string;
  readonly joinedAt?: string;
}
export interface RemoveStudentResponseDto {
  readonly classId?: string;
  readonly studentId?: string;
  readonly enrollmentStatus?: string | null;
  readonly updatedAt?: string | null;
}

export const enrollmentStatuses = ['Active', 'Left', 'Removed'] as const;
export type EnrollmentStatus = (typeof enrollmentStatuses)[number];
export type StudentListStatusFilter = EnrollmentStatus | 'all';

export interface TeacherStudentListQuery {
  classId: string;
  q?: string;
  status?: EnrollmentStatus;
  page: number;
  pageSize: number;
}

export interface UnavailableMetric {
  available: false;
}

export interface TeacherStudentRow {
  studentId: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  initials: string;
  enrollmentStatus: EnrollmentStatus;
  enrollmentLabel: string;
  joinedAt: string;
  metrics: {
    attendance: UnavailableMetric;
    score: UnavailableMetric;
    homework: UnavailableMetric;
    fee: UnavailableMetric;
    insight: UnavailableMetric;
  };
}

export interface TeacherStudentListData {
  classId: string;
  className: string;
  summary: {
    totalStudents: number;
    activeCount: number;
    inactiveCount: number;
    avgAttendance: UnavailableMetric;
    avgScore: UnavailableMetric;
  };
  items: TeacherStudentRow[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface TeacherStudentDetail {
  classId: string;
  className: string;
  gradeLevel: string;
  studentId: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  initials: string;
  enrollmentStatus: EnrollmentStatus;
  enrollmentLabel: string;
  joinedAt: string;
  profile: {
    dateOfBirth: string | null;
    schoolName: string | null;
    parentName: string | null;
    parentPhone: string | null;
  };
  summary: {
    score: UnavailableMetric;
    attendance: UnavailableMetric;
    rank: UnavailableMetric;
  };
  tabs: {
    overview: UnavailableMetric;
    progress: UnavailableMetric;
    homework: UnavailableMetric;
    messages: UnavailableMetric;
    tuition: UnavailableMetric;
    notes: UnavailableMetric;
  };
}

export interface TeacherStudentListController {
  classId: string | null;
  isClassIdValid: boolean;
  classes: TeacherOwnedClass[];
  selectedClass: TeacherOwnedClass | null;
  isLoadingClasses: boolean;
  classesError: Error | null;
  isClassDrawerOpen: boolean;
  searchInput: string;
  status: StudentListStatusFilter;
  data: TeacherStudentListData | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  selectedStudentId: string | null;
  isStudentDetailOpen: boolean;
  studentDetail: TeacherStudentDetail | undefined;
  isStudentDetailLoading: boolean;
  studentDetailError: Error | null;
  targetStudentForChangeClass: TeacherStudentRow | null;
  isChangeClassModalOpen: boolean;
  isChangingClass: boolean;
  changeClassError: Error | null;
  targetStudentForRemove: TeacherStudentRow | null;
  isRemoveModalOpen: boolean;
  isRemovingStudent: boolean;
  removeStudentError: Error | null;
  setSearchInput: (value: string) => void;
  setStatus: (value: StudentListStatusFilter) => void;
  setPage: (page: number) => void;
  retry: () => void;
  openClassDrawer: () => void;
  closeClassDrawer: () => void;
  selectClass: (classId: string) => void;
  openStudentDetail: (studentId: string) => void;
  closeStudentDetail: () => void;
  retryStudentDetail: () => void;
  openChangeClassModal: (student: TeacherStudentRow) => void;
  closeChangeClassModal: () => void;
  changeStudentClass: (targetClassId: string) => Promise<void>;
  openRemoveStudentModal: (student: TeacherStudentRow) => void;
  closeRemoveStudentModal: () => void;
  removeStudent: (student: TeacherStudentRow) => Promise<void>;
}
