import type { TeacherClassFilterController, TeacherClassStatus, TeacherClassTone } from './class.types';
import type { TeacherClassActivityController } from './classActivity.types';
export interface ClassInvitationDto {
  readonly invitationId?: string;
  readonly classId?: string;
  readonly inviteCode?: string | null;
  readonly inviteLink?: string | null;
  readonly expiresAt?: string | null;
  readonly isActive?: boolean;
  readonly createdAt?: string;
}

export interface ClassInvitationsListDto {
  readonly classId?: string;
  readonly items?: readonly ClassInvitationDto[] | null;
}

export type TeacherOverviewTone = 'green' | 'amber' | 'rose' | 'blue' | 'violet';

export interface TeacherOverviewClass {
  id: string;
  name: string;
  imageUrl: string | null;
  teacherName: string;
  studentCount: number;
  status: TeacherClassStatus;
  tone: TeacherClassTone;
}

export interface TeacherClassInvitation {
  invitationId: string;
  classId: string;
  inviteCode: string;
  inviteLink: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface TeacherOverviewKpi {
  label: string;
  value: string;
  badge: string;
  tone: TeacherOverviewTone;
}

export interface TeacherOverviewScheduleItem {
  day: string;
  weekday: string;
  title: string;
  detail: string;
}

export interface TeacherOverviewData {
  kpisByClassId: Record<string, TeacherOverviewKpi[]>;
  schedulesByClassId: Record<string, TeacherOverviewScheduleItem[]>;
}

export type TeacherOverviewPanelTab = 'tasks' | 'notes';

export interface TeacherOverviewFlowController {
  data: TeacherOverviewData;
  classes: TeacherOverviewClass[];
  selectedClass: TeacherOverviewClass | null;
  teacherFullName?: string;
  isLoadingClasses: boolean;
  classesError: Error | null;
  invitation: TeacherClassInvitation | null;
  isInvitationLoading: boolean;
  invitationError: Error | null;
  pendingApprovalCount: number | null;
  classFilter: TeacherClassFilterController;
  activity: TeacherClassActivityController;
  isClassDrawerOpen: boolean;
  isInviteDialogOpen: boolean;
  activePanelTab: TeacherOverviewPanelTab;
  openClassDrawer: () => void;
  closeClassDrawer: () => void;
  openInviteDialog: () => void;
  closeInviteDialog: () => void;
  retryInvitation: () => void;
  selectClass: (classId: string) => void;
  setActivePanelTab: (tab: TeacherOverviewPanelTab) => void;
}
