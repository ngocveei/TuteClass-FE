import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTeacherClasses } from './useTeacherClasses';
import { JoinRequestsApiError } from '../types/classApproval.errors';
import type {
  JoinRequestsFlowController,
  JoinRequestsQuery,
  JoinRequestsSortOption,
  TeacherClassDrawerItem,
} from '../types/classApproval.types';
import {
  useApproveJoinRequestMutation,
  useJoinRequestsQuery,
  useRejectJoinRequestMutation,
} from './useClassApprovalsQueries';

export function useClassApprovals(classId: string | undefined): JoinRequestsFlowController {
  const navigate = useNavigate();
  const location = useLocation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const safeClassId = classId || '';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState<JoinRequestsSortOption>('newest');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [isClassDrawerOpen, setIsClassDrawerOpen] = useState(false);
  const [processingStudentIds, setProcessingStudentIds] = useState<Set<string>>(new Set());
  const [actionResults, setActionResults] = useState<
    Map<string, { status: 'Active' | 'Rejected'; updatedAt: string }>
  >(new Map());

  const teacherClassesQuery = useTeacherClasses();

  const classList: TeacherClassDrawerItem[] = useMemo(() => {
    if (teacherClassesQuery.data && teacherClassesQuery.data.length > 0) {
      return teacherClassesQuery.data.map((c) => ({
        id: c.classId,
        name: c.className,
        teacherName: 'Giáo viên',
        studentCount: c.studentCount,
        tone: c.tone,
      }));
    }
    return [];
  }, [teacherClassesQuery.data]);

  useEffect(() => {
    if (!isClassDrawerOpen) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsClassDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isClassDrawerOpen]);

  const queryParams: JoinRequestsQuery = useMemo(
    () => {
      const requestedAtSort =
        sortOption === 'newest'
          ? { sortBy: 'requestedAt' as const, sortDirection: 'desc' as const }
          : { sortBy: 'requestedAt' as const, sortDirection: 'asc' as const };
      return {
        classId: safeClassId,
        q: searchTerm.trim() || undefined,
        status:
          statusFilter === 'pending'
            ? 'Pending'
            : statusFilter === 'approved'
              ? 'Active'
              : statusFilter === 'rejected'
                ? 'Rejected'
                : undefined,
        ...requestedAtSort,
        page,
        pageSize,
      };
    },
    [safeClassId, searchTerm, statusFilter, sortOption, page, pageSize],
  );

  const { data, isLoading, isError, error, refetch } = useJoinRequestsQuery(queryParams);

  const locationClassName = (location.state as { className?: string } | null)?.className;
  const selectedClass = classList.find((c: TeacherClassDrawerItem) => c.id === safeClassId);
  const resolvedClassName = data?.className || locationClassName || selectedClass?.name || '';

  const approveMutation = useApproveJoinRequestMutation();
  const rejectMutation = useRejectJoinRequestMutation();

  const handleApprove = async (studentId: string, fullName: string) => {
    if (!safeClassId || processingStudentIds.has(studentId)) return;
    setProcessingStudentIds((prev) => new Set(prev).add(studentId));
    try {
      const res = await approveMutation.mutateAsync({ classId: safeClassId, studentId });
      setActionResults((prev) => {
        const next = new Map(prev);
        next.set(studentId, { status: 'Active', updatedAt: res.updatedAt });
        return next;
      });
      messageApi.success(`Đã duyệt học sinh ${fullName} vào lớp thành công!`);
    } catch (err) {
      if (err instanceof JoinRequestsApiError && err.status === 409) {
        messageApi.warning('Yêu cầu này không còn ở trạng thái chờ duyệt.');
        void refetch();
      } else {
        messageApi.error(err instanceof Error ? err.message : 'Không thể phê duyệt yêu cầu.');
      }
    } finally {
      setProcessingStudentIds((prev) => {
        const next = new Set(prev);
        next.delete(studentId);
        return next;
      });
    }
  };

  const handleReject = async (studentId: string, fullName: string) => {
    if (!safeClassId || processingStudentIds.has(studentId)) return;
    setProcessingStudentIds((prev) => new Set(prev).add(studentId));
    try {
      const res = await rejectMutation.mutateAsync({ classId: safeClassId, studentId });
      setActionResults((prev) => {
        const next = new Map(prev);
        next.set(studentId, { status: 'Rejected', updatedAt: res.updatedAt });
        return next;
      });
      messageApi.info(`Đã từ chối yêu cầu tham gia của học sinh ${fullName}.`);
    } catch (err) {
      if (err instanceof JoinRequestsApiError && err.status === 409) {
        messageApi.warning('Yêu cầu này không còn ở trạng thái chờ duyệt.');
        void refetch();
      } else {
        messageApi.error(err instanceof Error ? err.message : 'Không thể từ chối yêu cầu.');
      }
    } finally {
      setProcessingStudentIds((prev) => {
        const next = new Set(prev);
        next.delete(studentId);
        return next;
      });
    }
  };

  const responseItems = data?.items;
  const items = useMemo(() => {
    if (!responseItems) return [];
    return responseItems.map((item) => {
      const action = actionResults.get(item.studentId);
      if (action) {
        return {
          ...item,
          status: action.status,
          actionResult: action,
        };
      }
      return item;
    });
  }, [responseItems, actionResults]);

  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : 'Không thể tải danh sách yêu cầu tham gia.'
    : null;

  const selectClass = (targetClassId: string, targetClassName: string) => {
    setIsClassDrawerOpen(false);
    navigate(`/classes/${encodeURIComponent(targetClassId)}/approval-requests`, {
      state: { className: targetClassName },
    });
  };

  return {
    classId: safeClassId,
    className: resolvedClassName,
    classList,
    isClassDrawerOpen,
    items,
    totalCount: data?.totalCount || 0,
    page: data?.page || page,
    pageSize,
    searchTerm,
    statusFilter,
    sortOption,
    isLoading,
    isError,
    errorMessage,
    processingStudentIds,
    messageContextHolder,
    openClassDrawer: () => setIsClassDrawerOpen(true),
    closeClassDrawer: () => setIsClassDrawerOpen(false),
    selectClass,
    setSearchTerm,
    setStatusFilter: (value) => { setStatusFilter(value); setPage(1); },
    setSortOption: (value) => { setSortOption(value); setPage(1); },
    setPage,
    handleApprove,
    handleReject,
    handleRefetch: () => void refetch(),
    goBack: () => navigate('/classes'),
  };
}
