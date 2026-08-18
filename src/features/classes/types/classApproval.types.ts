import type { ReactElement } from 'react';

export type EnrollmentStatus = 'Pending' | 'Active' | 'Rejected' | 'Left' | 'Removed';

export interface JoinRequestItem {
  studentId: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  requestedAt: string;
  status?: EnrollmentStatus | null;
}

export interface JoinRequestsListResponse {
  classId: string;
  className: string;
  items: JoinRequestItem[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface ApproveJoinRequestResponse {
  classId: string;
  studentId: string;
  classStudentId: string;
  enrollmentStatus: EnrollmentStatus;
  joinedAt: string;
  updatedAt: string;
}

export interface RejectJoinRequestResponse {
  classId: string;
  studentId: string;
  classStudentId: string;
  enrollmentStatus: EnrollmentStatus;
  joinedAt: string;
  updatedAt: string;
}

export interface JoinRequestRow {
  studentId: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  requestedAt: string;
  initials: string;
  status: EnrollmentStatus;
  actionResult?: {
    status: 'Active' | 'Rejected';
    updatedAt: string;
  };
}

export interface JoinRequestsListData {
  classId: string;
  className: string;
  items: JoinRequestRow[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface JoinRequestsQuery {
  classId: string;
  q?: string;
  status?: string;
  sortBy?: 'requestedAt';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export type JoinRequestsSortOption = 'newest' | 'oldest';

export interface TeacherClassDrawerItem {
  id: string;
  name: string;
  teacherName: string;
  studentCount: number;
  tone: 'green' | 'amber' | 'blue' | 'rose' | 'violet';
}

export interface JoinRequestsFlowController {
  classId: string;
  className: string;
  classList: TeacherClassDrawerItem[];
  isClassDrawerOpen: boolean;
  items: JoinRequestRow[];
  totalCount: number;
  page: number;
  pageSize: number;
  searchTerm: string;
  statusFilter: string;
  sortOption: JoinRequestsSortOption;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  processingStudentIds: Set<string>;
  messageContextHolder: ReactElement;
  openClassDrawer: () => void;
  closeClassDrawer: () => void;
  selectClass: (classId: string, className: string) => void;
  setSearchTerm: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setSortOption: (value: JoinRequestsSortOption) => void;
  setPage: (page: number) => void;
  handleApprove: (studentId: string, fullName: string) => Promise<void>;
  handleReject: (studentId: string, fullName: string) => Promise<void>;
  handleRefetch: () => void;
  goBack: () => void;
}

