
import { Modal } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile } from '@/features/profile';
import { createLogger, createOperationId } from '@/services/logger';
import { teacherClassKeys } from '@/features/classes/hooks/teacherClassKeys';
import { APP_ROUTES, teacherOverviewPath } from '../../../shared/constants/routes';
import { teacherClassesApi } from '../api/classes.api';
import type {
  ClassInvitation,
  CreateClassEditableField,
  CreateClassFlowController,
  CreateClassFormValues,
  CreateClassStep,
  CreateClassValidationErrors,
} from '../types/classCreate.types';
import { CreateClassApiError } from '../types/classCreate.errors';
import type { TeacherOwnedClass } from '../types/class.types';
import {
  clearCreateClassDraft,
  clearLastCreatedClass,
  clearLastCreatedInvitation,
  readCreateClassDraft,
  readLastCreatedClass,
  readLastCreatedInvitation,
  saveCreateClassDraft,
  saveLastCreatedClass,
  saveLastCreatedInvitation,
} from '../utils/classStorage';
import {
  createEmptyClassForm,
  hasCreateClassDraftData,
  hasCreateClassValidationErrors,
  mapBackendValidationErrors,
  normalizeCreateClassForm,
  validateClassImage,
  validateClassImageContent,
  validateCreateClassForm,
  validateCreateClassStepOne,
} from '../utils/classValidation';
import { useCreateClass, useCreateClassInvitation, useCreateClassOptions, useUploadClassImage } from './useCreateClass';

const logger = createLogger('classes.create');

function initialFlowState() {
  const draft = readCreateClassDraft();
  return {
    step: draft?.step ?? 1,
    values: draft ? { ...draft.values, imageFile: null } : createEmptyClassForm(),
  } satisfies { step: CreateClassStep; values: CreateClassFormValues };
}

function errorMessageWithTrace(message: string, traceId?: string) {
  return traceId ? `${message} Mã tra cứu: ${traceId}` : message;
}

function useTeacherDisplayName(): string {
  const profile = useQuery({ queryKey: ['profile', 'me'], queryFn: getMyProfile });
  return profile.data?.fullName?.trim() || 'Giáo viên';
}

export function useCreateClassFlow(): CreateClassFlowController {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const teacherName = useTeacherDisplayName();
  const [modal, modalContextHolder] = Modal.useModal();
  const [{ step: initialStep, values: initialValues }] = useState(initialFlowState);
  const [step, setStep] = useState<CreateClassStep>(initialStep);
  const [values, setValues] = useState<CreateClassFormValues>(initialValues);
  const [createdClass, setCreatedClass] = useState(() => readLastCreatedClass());
  const [createdInvitation, setCreatedInvitation] = useState<ClassInvitation | null>(() => readLastCreatedInvitation());
  const [errors, setErrors] = useState<CreateClassValidationErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [traceId, setTraceId] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(values.uploadedImageUrl);
  const [isImageValidating, setIsImageValidating] = useState(false);
  const [invalidImageSelectionError, setInvalidImageSelectionError] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const imageSelectionVersionRef = useRef(0);
  const optionsQuery = useCreateClassOptions(!createdClass);
  const uploadMutation = useUploadClassImage();
  const createMutation = useCreateClass();
  const createInvitationMutation = useCreateClassInvitation();
  const options = optionsQuery.data ?? null;

  useEffect(() => {
    if (!values.imageFile) {
      setImagePreviewUrl(values.uploadedImageUrl);
      return undefined;
    }
    const objectUrl = URL.createObjectURL(values.imageFile);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [values.imageFile, values.uploadedImageUrl]);

  useEffect(() => {
    if (!options) return;
    setValues((current) => {
      const subjectId = options.subjects.some((subject) => subject.subjectId === current.subjectId)
        ? current.subjectId
        : '';
      const gradeLevel = options.gradeLevels.some((grade) => grade.value === current.gradeLevel)
        ? current.gradeLevel
        : '';
      return subjectId === current.subjectId && gradeLevel === current.gradeLevel
        ? current
        : { ...current, subjectId, gradeLevel };
    });
  }, [options]);

  useEffect(() => {
    if (createdClass) return undefined;
    const timeoutId = window.setTimeout(() => {
      if (hasCreateClassDraftData(values) || step === 2) saveCreateClassDraft(values, step);
      else clearCreateClassDraft();
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [createdClass, step, values]);

  const clearMessages = () => {
    setGeneralError(null);
    setTraceId(null);
  };

  const handleFieldChange = <K extends CreateClassEditableField>(
    field: K,
    value: CreateClassFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    clearMessages();
  };

  const handleImageChange = async (file: File | null) => {
    const selectionVersion = ++imageSelectionVersionRef.current;
    clearMessages();

    if (!file) {
      setIsImageValidating(false);
      setInvalidImageSelectionError(null);
      setValues((current) => ({ ...current, imageFile: null, uploadedImageUrl: null }));
      setErrors((current) => ({ ...current, imageFile: undefined }));
      return;
    }

    const basicValidationError = validateClassImage(file);
    if (basicValidationError) {
      setIsImageValidating(false);
      setInvalidImageSelectionError(basicValidationError);
      setErrors((current) => ({ ...current, imageFile: basicValidationError }));
      return;
    }

    setIsImageValidating(true);
    const contentValidationError = await validateClassImageContent(file);
    if (selectionVersion !== imageSelectionVersionRef.current) return;

    setIsImageValidating(false);
    if (contentValidationError) {
      setInvalidImageSelectionError(contentValidationError);
      setErrors((current) => ({ ...current, imageFile: contentValidationError }));
      return;
    }

    setInvalidImageSelectionError(null);
    setValues((current) => ({ ...current, imageFile: file, uploadedImageUrl: null }));
    setErrors((current) => ({ ...current, imageFile: undefined }));
  };

  const collectStepOneValidationErrors = (formValues: CreateClassFormValues) => ({
    ...validateCreateClassStepOne(formValues, options),
    ...(invalidImageSelectionError ? { imageFile: invalidImageSelectionError } : {}),
  });

  const collectFormValidationErrors = (formValues: CreateClassFormValues) => ({
    ...validateCreateClassForm(formValues, options),
    ...(invalidImageSelectionError ? { imageFile: invalidImageSelectionError } : {}),
  });

  const nextStep = () => {
    const normalized = normalizeCreateClassForm(values);
    const validationErrors = collectStepOneValidationErrors(normalized);
    setValues(normalized);
    setErrors(validationErrors);
    clearMessages();
    if (hasCreateClassValidationErrors(validationErrors)) {
      logger.warn('validation.failed', { step: 1, fields: Object.keys(validationErrors) });
      return;
    }
    setStep(2);
    logger.info('step.changed', { step: 2 });
  };

  const previousStep = () => {
    setStep(1);
    clearMessages();
    logger.info('step.changed', { step: 1 });
  };

  const handleSubmit = async () => {
    if (submittingRef.current || uploadMutation.isPending || createMutation.isPending || createInvitationMutation.isPending) return;
    const operationId = createOperationId('class-create');
    const normalized = normalizeCreateClassForm(values);
    const validationErrors = collectFormValidationErrors(normalized);
    setValues(normalized);
    setErrors(validationErrors);
    clearMessages();
    if (hasCreateClassValidationErrors(validationErrors)) {
      if (validationErrors.className || validationErrors.subjectId || validationErrors.gradeLevel || validationErrors.imageFile || validationErrors.description) {
        setStep(1);
      }
      logger.warn('validation.failed', { step, fields: Object.keys(validationErrors) }, operationId);
      return;
    }
    if (!options) {
      setGeneralError('Danh mục tạo lớp chưa sẵn sàng. Vui lòng tải lại và thử lại.');
      return;
    }

    if (normalized.imageFile && !normalized.uploadedImageUrl) {
      setIsImageValidating(true);
      const imageContentError = await validateClassImageContent(normalized.imageFile);
      setIsImageValidating(false);
      if (imageContentError) {
        setInvalidImageSelectionError(imageContentError);
        setErrors((current) => ({ ...current, imageFile: imageContentError }));
        setStep(1);
        logger.warn('validation.failed', { step: 1, fields: ['imageFile'] }, operationId);
        return;
      }
    }

    submittingRef.current = true;
    logger.info('submit', { step: 2, hasImage: Boolean(normalized.imageFile || normalized.uploadedImageUrl) }, operationId);
    try {
      let imageUrl = normalized.uploadedImageUrl;
      if (normalized.imageFile && !imageUrl) {
        logger.info('image.upload.started', undefined, operationId);
        imageUrl = await uploadMutation.mutateAsync(normalized.imageFile);
        const valuesWithUploadedImage = { ...normalized, uploadedImageUrl: imageUrl };
        setValues(valuesWithUploadedImage);
        saveCreateClassDraft(valuesWithUploadedImage, 2);
        logger.info('image.upload.succeeded', undefined, operationId);
      }

      const result = await createMutation.mutateAsync({
        className: normalized.className,
        imageUrl,
        subjectId: normalized.subjectId,
        gradeLevel: normalized.gradeLevel,
        description: normalized.description || null,
        settings: {
          requireStudentApproval: normalized.requireStudentApproval,
          allowStudentLeave: !normalized.preventStudentLeave,
          allowStudentViewGrades: normalized.allowStudentViewGrades,
          allowFeedActivity: !normalized.disableFeed,
        },
      });
      queryClient.setQueryData<TeacherOwnedClass[]>(
        teacherClassKeys.mine(),
        (current) => {
          if (!current || current.some((item) => item.classId === result.classId)) {
            return current;
          }
          const tones: TeacherOwnedClass['tone'][] = ['amber', 'blue', 'rose', 'violet'];
          return [
            ...current,
            {
              classId: result.classId,
              className: result.className,
              studentCount: 0,
              imageUrl: result.imageUrl,
              status: result.status === 'Completed' ? 'Completed' : 'Active',
              tone: tones[current.length % tones.length],
            },
          ];
        },
      );

      let invitation: ClassInvitation | null = null;
      try {
        invitation = await createInvitationMutation.mutateAsync({
          classId: result.classId,
          request: {
            maxUses: normalized.maxUses,
            expiresAt: normalized.expiresAt,
          },
        });
        saveLastCreatedInvitation(invitation);
        setCreatedInvitation(invitation);
        logger.info('invitation.create.succeeded', { inviteCode: invitation.inviteCode }, operationId);
      } catch (inviteError) {
        logger.warn('invitation.create.failed', { error: inviteError }, operationId);
      }

      clearCreateClassDraft();
      saveLastCreatedClass(result);
      setCreatedClass(result);
      logger.info('success', { classId: result.classId }, operationId);
    } catch (error) {
      const apiError = error instanceof CreateClassApiError
        ? error
        : new CreateClassApiError(error instanceof Error ? error.message : 'Không thể tạo lớp học.');
      setTraceId(apiError.traceId ?? null);
      const backendErrors = mapBackendValidationErrors(apiError.fieldErrors);
      if (apiError.status === 409) {
        setErrors((current) => ({ ...current, className: 'Bạn đã có một lớp với tên này.' }));
        setStep(1);
      } else if (apiError.status === 404) {
        setErrors((current) => ({ ...current, subjectId: 'Môn học không còn tồn tại. Vui lòng chọn lại.' }));
        setValues((current) => ({ ...current, subjectId: '' }));
        setStep(1);
        void optionsQuery.refetch();
      } else if (apiError.status === 400 && hasCreateClassValidationErrors(backendErrors)) {
        setErrors((current) => ({ ...current, ...backendErrors }));
        if (backendErrors.className || backendErrors.subjectId || backendErrors.gradeLevel || backendErrors.imageFile || backendErrors.description) {
          setStep(1);
        }
      } else if (apiError.status === 401) {
        setGeneralError(errorMessageWithTrace('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', apiError.traceId));
      } else if (apiError.status === 403) {
        setGeneralError(errorMessageWithTrace('Tài khoản của bạn không có quyền tạo lớp.', apiError.traceId));
      } else {
        setGeneralError(errorMessageWithTrace(apiError.message || 'Không thể tạo lớp học.', apiError.traceId));
      }
      logger.error('failed', { status: apiError.status, error: apiError }, operationId);
    } finally {
      submittingRef.current = false;
    }
  };

  const leaveCreateFlow = () => {
    clearCreateClassDraft();
    clearLastCreatedClass();
    clearLastCreatedInvitation();
    logger.info('navigate', { target: APP_ROUTES.teacherProfile });
    navigate(APP_ROUTES.teacherProfile);
  };

  const goToCreatedClassOverview = async () => {
    if (!createdClass) return;
    let classId = createdClass.classId;
    try {
      const classes = await teacherClassesApi.getMine();
      queryClient.setQueryData(teacherClassKeys.mine(), classes);
      const matchingClass = classes.find((item) => item.classId === classId)
        ?? classes.find((item) => item.className === createdClass.className);
      classId = matchingClass?.classId ?? classId;
    } catch {
      // The newly-created class ID remains a valid navigation fallback.
    }
    const target = teacherOverviewPath(classId);
    clearCreateClassDraft();
    clearLastCreatedClass();
    clearLastCreatedInvitation();
    void queryClient.invalidateQueries({ queryKey: teacherClassKeys.mine() });
    logger.info('navigate', { target, classId });
    navigate(target);
  };

  const handleCancel = () => {
    if (!hasCreateClassDraftData(values)) return leaveCreateFlow();
    modal.confirm({
      title: 'Hủy tạo lớp?',
      content: 'Thông tin đang nhập và bản nháp của bạn sẽ bị xóa.',
      okText: 'Hủy tạo lớp',
      cancelText: 'Tiếp tục chỉnh sửa',
      okButtonProps: { danger: true },
      onOk: leaveCreateFlow,
    });
  };

  const handleCreateAnother = () => {
    clearLastCreatedClass();
    clearLastCreatedInvitation();
    clearCreateClassDraft();
    uploadMutation.reset();
    createMutation.reset();
    createInvitationMutation.reset();
    setCreatedClass(null);
    setCreatedInvitation(null);
    setStep(1);
    setValues(createEmptyClassForm());
    setErrors({});
    clearMessages();
  };

  return {
    step,
    values,
    options,
    createdClass,
    createdInvitation,
    teacherName,
    errors,
    generalError,
    traceId,
    imagePreviewUrl,
    isImageValidating,
    isOptionsLoading: optionsQuery.isLoading,
    isOptionsError: optionsQuery.isError,
    isSubmitting: isImageValidating || uploadMutation.isPending || createMutation.isPending || createInvitationMutation.isPending,
    isUploading: uploadMutation.isPending,
    modalContextHolder,
    handleFieldChange,
    handleImageChange,
    clearInvalidImageSelection: () => {
      setInvalidImageSelectionError(null);
      setErrors((current) => ({ ...current, imageFile: undefined }));
    },
    nextStep,
    previousStep,
    handleSubmit,
    handleCancel,
    handleCreateAnother,
    goToCreatedClassOverview,
    leaveCreateFlow,
    goBack: step === 2 ? previousStep : () => navigate(-1),
    refetchOptions: () => { void optionsQuery.refetch(); },
  };
}
