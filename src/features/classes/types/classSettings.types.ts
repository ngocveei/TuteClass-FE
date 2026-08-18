import type { ClassGradeLevelOption } from './classCreate.types';

export type FeeType = 'Free' | 'Monthly' | 'PerSession';

export type ClassStatus = 'Active' | 'Completed';

export type GradeLevel =
  | 'Grade6'
  | 'Grade7'
  | 'Grade8'
  | 'Grade9'
  | 'Grade10'
  | 'Grade11'
  | 'Grade12'
  | 'University'
  | 'College'
  | 'Other';

export interface ClassSettings {
  requireStudentApproval: boolean;
  allowStudentLeave: boolean;
  allowStudentViewGrades: boolean;
  allowFeedActivity: boolean;
  sessionDurationMinutes: number;
}

export interface SubjectSummary {
  subjectId: string;
  subjectName: string;
}

export interface ClassSettingsDetail {
  classId: string;
  className: string;
  imageUrl: string | null;
  subject: SubjectSummary;
  gradeLevel: GradeLevel;
  description: string | null;
  feeType: FeeType;
  feeAmount: number;
  status: ClassStatus;
  settings: ClassSettings;
}

export interface UpdateClassSettingsRequest {
  className: string;
  imageUrl: string | null;
  gradeLevel: GradeLevel;
  description: string | null;
  feeType: FeeType;
  feeAmount: number;
  status: ClassStatus;
  settings: ClassSettings;
}

export interface ClassSettingsProblemDetailsDto {
  status?: number;
  title?: string;
  errors?: Record<string, string[] | null> | null;
  traceId?: string;
}

import type { InvitationFlowController } from './classInvitation.types';

export interface ClassSettingsFlowController {
  classId: string;
  activeTab: 'settings' | 'invitation';
  setActiveTab: (tab: 'settings' | 'invitation') => void;
  invitationFlow: InvitationFlowController;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  data: ClassSettingsDetail | undefined;
  gradeLevelOptions: ClassGradeLevelOption[];

  // Form State
  className: string;
  setClassName: (val: string) => void;
  imageUrl: string | null;
  previewUrl: string | null;
  gradeLevel: GradeLevel;
  setGradeLevel: (val: GradeLevel) => void;
  description: string;
  setDescription: (val: string) => void;
  feeType: FeeType;
  setFeeType: (val: FeeType) => void;
  feeAmount: number;
  setFeeAmount: (val: number) => void;
  status: ClassStatus;
  setStatus: (val: ClassStatus) => void;
  settings: ClassSettings;
  setSettings: React.Dispatch<React.SetStateAction<ClassSettings>>;
  handleSessionDurationChange: (value: number | null) => void;

  // Actions
  isUploadingImage: boolean;
  handleImageSelect: (file: File) => Promise<void>;
  handleRemoveImage: () => void;
  fieldErrors: Record<string, string[]>;

  isSaving: boolean;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  handleReset: () => void;

  // Delete Modal
  isDeleteModalOpen: boolean;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  isDeleting: boolean;
  handleConfirmDelete: () => Promise<void>;

  messageContextHolder: React.ReactElement;
  goBack: () => void;
}
