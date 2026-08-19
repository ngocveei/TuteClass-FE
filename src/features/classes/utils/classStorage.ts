import type {
  ClassInvitation,
  CreateClassDraft,
  CreateClassFormValues,
  CreateClassStep,
  CreatedClass,
} from '../types/classCreate.types';

export const createClassDraftStorageKey = 'tuteclass.classes.create.draft';
export const lastCreatedClassStorageKey = 'tuteclass.classes.create.last-created';
export const lastCreatedInvitationStorageKey = 'tuteclass.classes.create.last-invitation';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isString(value);
}

function isCreateClassDraft(value: unknown): value is CreateClassDraft {
  if (!isRecord(value) || (value.step !== 1 && value.step !== 2) || !isRecord(value.values)) return false;
  const item = value.values;
  const validMaxUses = item.maxUses === undefined || item.maxUses === null || typeof item.maxUses === 'number';
  const validExpiresAt = item.expiresAt === undefined || isNullableString(item.expiresAt);
  return isString(item.className)
    && isNullableString(item.uploadedImageUrl)
    && isString(item.subjectId)
    && isString(item.gradeLevel)
    && isString(item.description)
    && typeof item.requireStudentApproval === 'boolean'
    && typeof item.preventStudentLeave === 'boolean'
    && typeof item.allowStudentViewGrades === 'boolean'
    && typeof item.disableFeed === 'boolean'
    && validMaxUses
    && validExpiresAt;
}

function isCreatedClass(value: unknown): value is CreatedClass {
  if (!isRecord(value) || !isRecord(value.subject) || !isRecord(value.settings)) return false;
  return isString(value.classId)
    && isString(value.className)
    && isNullableString(value.imageUrl)
    && isString(value.subject.subjectId)
    && isString(value.subject.subjectName)
    && isString(value.gradeLevel)
    && isNullableString(value.description)
    && isString(value.status)
    && typeof value.settings.requireStudentApproval === 'boolean'
    && typeof value.settings.allowStudentLeave === 'boolean'
    && typeof value.settings.allowStudentViewGrades === 'boolean'
    && typeof value.settings.allowFeedActivity === 'boolean'
    && isString(value.createdAt)
    && !Number.isNaN(Date.parse(value.createdAt));
}

function isClassInvitation(value: unknown): value is ClassInvitation {
  if (!isRecord(value)) return false;
  const validMaxUses = value.maxUses === null || typeof value.maxUses === 'number';
  return isString(value.invitationId)
    && isString(value.classId)
    && isString(value.inviteCode)
    && isString(value.inviteToken)
    && isString(value.inviteLink)
    && validMaxUses
    && typeof value.usedCount === 'number'
    && isNullableString(value.expiresAt)
    && typeof value.isActive === 'boolean'
    && isString(value.createdByUserId)
    && isString(value.createdAt);
}

function readJson<T>(key: string, guard: (value: unknown) => value is T): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (guard(parsed)) return parsed;
  } catch {
    // Corrupted session data must not break the page.
  }
  window.sessionStorage.removeItem(key);
  return null;
}

export function readCreateClassDraft(): CreateClassDraft | null {
  const draft = readJson(createClassDraftStorageKey, isCreateClassDraft);
  if (!draft) return null;
  return {
    ...draft,
    values: {
      ...draft.values,
      maxUses: draft.values.maxUses ?? null,
      expiresAt: draft.values.expiresAt ?? null,
    },
  };
}

export function saveCreateClassDraft(values: CreateClassFormValues, step: CreateClassStep) {
  const persistedValues: CreateClassDraft['values'] = {
    className: values.className,
    uploadedImageUrl: values.uploadedImageUrl,
    subjectId: values.subjectId,
    gradeLevel: values.gradeLevel,
    description: values.description,
    requireStudentApproval: values.requireStudentApproval,
    preventStudentLeave: values.preventStudentLeave,
    allowStudentViewGrades: values.allowStudentViewGrades,
    disableFeed: values.disableFeed,
    maxUses: values.maxUses,
    expiresAt: values.expiresAt,
  };
  const draft: CreateClassDraft = { step, values: persistedValues };
  window.sessionStorage.setItem(createClassDraftStorageKey, JSON.stringify(draft));
}

export function clearCreateClassDraft() {
  window.sessionStorage.removeItem(createClassDraftStorageKey);
}

export function readLastCreatedClass(): CreatedClass | null {
  return readJson(lastCreatedClassStorageKey, isCreatedClass);
}

export function saveLastCreatedClass(createdClass: CreatedClass) {
  window.sessionStorage.setItem(lastCreatedClassStorageKey, JSON.stringify(createdClass));
}

export function clearLastCreatedClass() {
  window.sessionStorage.removeItem(lastCreatedClassStorageKey);
}

export function readLastCreatedInvitation(): ClassInvitation | null {
  return readJson(lastCreatedInvitationStorageKey, isClassInvitation);
}

export function saveLastCreatedInvitation(invitation: ClassInvitation) {
  window.sessionStorage.setItem(lastCreatedInvitationStorageKey, JSON.stringify(invitation));
}

export function clearLastCreatedInvitation() {
  window.sessionStorage.removeItem(lastCreatedInvitationStorageKey);
}
