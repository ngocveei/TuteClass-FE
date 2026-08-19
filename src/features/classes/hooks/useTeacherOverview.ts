import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/features/profile';
import { useTeacherClasses } from './useTeacherClasses';
import type { ClassStatusFilter, TeacherClassFilterController, TeacherOwnedClass } from '../types/class.types';
import { useTeacherClassInvitation } from './useTeacherClassInvitation';
import { useTeacherClassActivity } from './useTeacherClassActivity';
import { usePendingJoinRequestsCountQuery } from './useClassApprovalsQueries';
import type { TeacherOverviewClass, TeacherOverviewFlowController, TeacherOverviewPanelTab } from '../types/classOverview.types';

function toOverviewClass(item: TeacherOwnedClass, teacherName?: string): TeacherOverviewClass {
  return {
    id: item.classId,
    name: item.className,
    imageUrl: item.imageUrl,
    teacherName: teacherName?.trim() || 'Giáo viên',
    studentCount: item.studentCount,
    status: item.status,
    tone: item.tone,
  };
}

export function useTeacherOverview(): TeacherOverviewFlowController {
  const profile = useQuery({ queryKey: ['profile', 'me'], queryFn: getMyProfile });
  const teacherFullName = profile.data?.fullName;
  const [searchParams, setSearchParams] = useSearchParams();
  const teacherClasses = useTeacherClasses();
  const [classStatusFilter, setClassStatusFilter] = useState<ClassStatusFilter>('All');
  const filteredTeacherClasses = useTeacherClasses(classStatusFilter);
  const [isClassDrawerOpen, setIsClassDrawerOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [activePanelTab, setActivePanelTab] = useState<TeacherOverviewPanelTab>('tasks');
  const classes = useMemo(() => (teacherClasses.data ?? []).map((item) => toOverviewClass(item, teacherFullName)), [teacherClasses.data, teacherFullName]);
  const classFilter: TeacherClassFilterController = {
    status: classStatusFilter,
    classes: filteredTeacherClasses.data ?? [],
    isLoading: filteredTeacherClasses.isLoading || filteredTeacherClasses.isFetching,
    error: filteredTeacherClasses.error instanceof Error ? filteredTeacherClasses.error : null,
    cycleStatus: () => setClassStatusFilter((current) => current === 'All' ? 'Active' : current === 'Active' ? 'Completed' : 'All'),
    retry: () => { void filteredTeacherClasses.refetch(); },
  };
  const requestedClassId = searchParams.get('classId');
  const selectedClass = classes.find((item) => item.id === requestedClassId) ?? null;
  const invitationQuery = useTeacherClassInvitation(selectedClass?.id ?? null);
  const pendingApprovalCountQuery = usePendingJoinRequestsCountQuery(selectedClass?.id ?? null);
  const activity = useTeacherClassActivity(selectedClass?.id ?? null);
  const data = useMemo(() => {
    if (!selectedClass) return { kpisByClassId: {}, schedulesByClassId: {} };
    const invitationKpi = invitationQuery.isLoading
      ? { value: 'Đang tải…', badge: '...' }
      : invitationQuery.isError
        ? { value: 'Không thể tải', badge: 'Thử lại' }
        : invitationQuery.data
          ? { value: invitationQuery.data.inviteCode, badge: 'Chia sẻ' }
          : { value: 'Chưa có mã mời', badge: 'Cài đặt' };
    const kpis = [
      { label: 'Mã mời vào lớp', tone: 'green' as const, ...invitationKpi },
      { label: 'Học phí đã nộp', value: 'Chưa có dữ liệu', badge: '—', tone: 'amber' as const },
      { label: 'Bài cần chấm', value: 'Chưa có dữ liệu', badge: '—', tone: 'rose' as const },
      { label: 'Tiến độ dạy', value: 'Chưa có dữ liệu', badge: '—', tone: 'violet' as const },
    ];
    return {
      kpisByClassId: { [selectedClass.id]: kpis },
      schedulesByClassId: { [selectedClass.id]: [] },
    };
  }, [invitationQuery.data, invitationQuery.isError, invitationQuery.isLoading, selectedClass]);

  useEffect(() => {
    if (!teacherClasses.data || requestedClassId) return;
    const firstClassId = teacherClasses.data[0]?.classId;
    if (!firstClassId) return;
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('classId', firstClassId);
      return next;
    }, { replace: true });
  }, [requestedClassId, setSearchParams, teacherClasses.data]);

  useEffect(() => {
    if (!isClassDrawerOpen && !isInviteDialogOpen) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsClassDrawerOpen(false);
      setIsInviteDialogOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isClassDrawerOpen, isInviteDialogOpen]);

  return {
    data,
    classes,
    selectedClass,
    teacherFullName: teacherFullName?.trim() || undefined,
    isLoadingClasses: teacherClasses.isLoading,
    classesError: teacherClasses.error instanceof Error ? teacherClasses.error : null,
    invitation: invitationQuery.data ?? null,
    isInvitationLoading: invitationQuery.isLoading,
    invitationError: invitationQuery.error instanceof Error ? invitationQuery.error : null,
    pendingApprovalCount: pendingApprovalCountQuery.data?.totalCount ?? null,
    classFilter,
    activity,
    isClassDrawerOpen,
    isInviteDialogOpen,
    activePanelTab,
    openClassDrawer: () => setIsClassDrawerOpen(true),
    closeClassDrawer: () => setIsClassDrawerOpen(false),
    openInviteDialog: () => setIsInviteDialogOpen(true),
    closeInviteDialog: () => setIsInviteDialogOpen(false),
    retryInvitation: () => { void invitationQuery.refetch(); },
    selectClass: (classId) => {
      setSearchParams({ classId }, { replace: true });
      setIsClassDrawerOpen(false);
      setIsInviteDialogOpen(false);
    },
    setActivePanelTab,
  };
}
