import type { ReactNode } from 'react';

export interface CreateClassOptionsResponseDto {
  readonly subjects?: readonly { readonly subjectId?: string; readonly subjectName?: string | null }[] | null;
  readonly gradeLevels?: readonly { readonly value?: string | null; readonly label?: string | null }[] | null;
}
export interface ClassSettingsRequestDto {
  readonly requireStudentApproval?: boolean;
  readonly allowStudentLeave?: boolean;
  readonly allowStudentViewGrades?: boolean;
  readonly allowFeedActivity?: boolean;
}
export interface CreateClassRequestDto {
  readonly className?: string | null;
  readonly imageUrl?: string | null;
  readonly subjectId?: string;
  readonly gradeLevel?: string | null;
  readonly description?: string | null;
  readonly settings?: ClassSettingsRequestDto;
}
export interface CreateClassResponseDto {
  readonly classId?: string;
  readonly className?: string | null;
  readonly imageUrl?: string | null;
  readonly subject?: { readonly subjectId?: string; readonly subjectName?: string | null };
  readonly gradeLevel?: string | null;
  readonly description?: string | null;
  readonly status?: string | null;
  readonly settings?: ClassSettingsRequestDto;
  readonly createdAt?: string;
}
export interface UploadClassImageResponseDto { readonly imageUrl?: string | null }
export interface ClassProblemDetailsDto {
  readonly status?: number | null;
  readonly title?: string | null;
  readonly errors?: Record<string, string[] | null> | null;
  readonly traceId?: string;
}
export interface ClassInvitationResponseDto {
  readonly invitationId?: string;
  readonly classId?: string;
  readonly inviteCode?: string | null;
  readonly inviteToken?: string | null;
  readonly inviteLink?: string | null;
  readonly maxUses?: number | null;
  readonly usedCount?: number;
  readonly expiresAt?: string | null;
  readonly isActive?: boolean;
  readonly createdByUserId?: string;
  readonly createdAt?: string;
}
export interface GenerateClassInvitationRequestDto {
  readonly maxUses?: number | null;
  readonly expiresAt?: string | null;
}
export type GradeLevelValue = string;
export type SubjectIdValue = string;

// Runtime-checked models used by the Frontend.
export interface ClassSubjectOption {
  subjectId: SubjectIdValue;
  subjectName: string;
}

export interface ClassGradeLevelOption {
  value: GradeLevelValue;
  label: string;
  displayLabel: string;
}

export interface CreateClassOptions {
  subjects: ClassSubjectOption[];
  gradeLevels: ClassGradeLevelOption[];
}

export interface ClassSettings {
  requireStudentApproval: boolean;
  allowStudentLeave: boolean;
  allowStudentViewGrades: boolean;
  allowFeedActivity: boolean;
}

export interface ClassInvitation {
  invitationId: string;
  classId: string;
  inviteCode: string;
  inviteToken: string;
  inviteLink: string;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdByUserId: string;
  createdAt: string;
}

export interface CreateClassFormValues {
  className: string;
  imageFile: File | null;
  uploadedImageUrl: string | null;
  subjectId: string;
  gradeLevel: string;
  description: string;
  requireStudentApproval: boolean;
  preventStudentLeave: boolean;
  allowStudentViewGrades: boolean;
  disableFeed: boolean;
  maxUses: number | null;
  expiresAt: string | null;
}

export interface CreateClassCommand {
  className: string;
  imageUrl: string | null;
  subjectId: string;
  gradeLevel: string;
  description: string | null;
  settings: ClassSettings;
}

export interface CreatedClass {
  classId: string;
  className: string;
  imageUrl: string | null;
  subject: ClassSubjectOption;
  gradeLevel: string;
  description: string | null;
  status: string;
  settings: ClassSettings;
  createdAt: string;
}

export type CreateClassStep = 1 | 2;

export interface CreateClassDraft {
  step: CreateClassStep;
  values: Omit<CreateClassFormValues, 'imageFile'>;
}

export interface CreateClassValidationErrors {
  className?: string;
  imageFile?: string;
  subjectId?: string;
  gradeLevel?: string;
  description?: string;
  maxUses?: string;
  expiresAt?: string;
}

export type CreateClassEditableField = Exclude<
  keyof CreateClassFormValues,
  'imageFile' | 'uploadedImageUrl'
>;

export interface CreateClassFlowController {
  step: CreateClassStep;
  values: CreateClassFormValues;
  options: CreateClassOptions | null;
  createdClass: CreatedClass | null;
  createdInvitation: ClassInvitation | null;
  teacherName?: string;
  errors: CreateClassValidationErrors;
  generalError: string | null;
  traceId: string | null;
  imagePreviewUrl: string | null;
  isImageValidating: boolean;
  isOptionsLoading: boolean;
  isOptionsError: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  modalContextHolder: ReactNode;
  handleFieldChange: <K extends CreateClassEditableField>(
    field: K,
    value: CreateClassFormValues[K],
  ) => void;
  handleImageChange: (file: File | null) => Promise<void>;
  clearInvalidImageSelection: () => void;
  nextStep: () => void;
  previousStep: () => void;
  handleSubmit: () => Promise<void>;
  handleCancel: () => void;
  handleCreateAnother: () => void;
  goToCreatedClassOverview: () => void;
  leaveCreateFlow: () => void;
  goBack: () => void;
  refetchOptions: () => void;
}
