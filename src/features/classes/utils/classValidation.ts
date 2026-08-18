import type {
  CreateClassFormValues,
  CreateClassOptions,
  CreateClassValidationErrors,
} from '../types/classCreate.types';

export const maxClassImageSizeBytes = 5 * 1024 * 1024;
export const minClassImageSizeBytes = 10 * 1024;
export const allowedClassImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const;

export function createEmptyClassForm(): CreateClassFormValues {
  return {
    className: '',
    imageFile: null,
    uploadedImageUrl: null,
    subjectId: '',
    gradeLevel: '',
    description: '',
    requireStudentApproval: false,
    preventStudentLeave: false,
    allowStudentViewGrades: false,
    disableFeed: false,
    maxUses: null,
    expiresAt: null,
  };
}

export function normalizeClassName(value: string) {
  return value.normalize('NFC').trim().replace(/[\t ]+/g, ' ');
}

export function normalizeDescription(value: string) {
  return value.normalize('NFC').trim();
}

export function normalizeCreateClassForm(values: CreateClassFormValues): CreateClassFormValues {
  return {
    ...values,
    className: normalizeClassName(values.className),
    subjectId: values.subjectId.trim(),
    gradeLevel: values.gradeLevel.trim(),
    description: normalizeDescription(values.description),
  };
}

export function validateClassImage(file: File | null): string | undefined {
  if (!file) return undefined;
  if (!allowedClassImageTypes.includes(file.type as (typeof allowedClassImageTypes)[number])) {
    return 'Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.';
  }
  if (file.size < minClassImageSizeBytes) return 'Ảnh lớp phải có dung lượng tối thiểu 10 KB.';
  if (file.size > maxClassImageSizeBytes) return 'Ảnh lớp không được vượt quá 5 MB.';
  return undefined;
}

/** Validates that the browser can decode the selected image before preview/upload. */
export function validateClassImageContent(file: File): Promise<string | undefined> {
  const validationError = validateClassImage(file);
  if (validationError) return Promise.resolve(validationError);

  return new Promise((resolve) => {
    let objectUrl: string;
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      resolve('Không thể đọc file ảnh. Vui lòng chọn ảnh khác.');
      return;
    }

    const image = new Image();
    const cleanup = () => URL.revokeObjectURL(objectUrl);
    image.onload = () => {
      const isValid = image.naturalWidth > 0 && image.naturalHeight > 0;
      cleanup();
      resolve(isValid ? undefined : 'File ảnh không hợp lệ hoặc không có nội dung hiển thị được.');
    };
    image.onerror = () => {
      cleanup();
      resolve('File ảnh không hợp lệ hoặc đã bị hỏng. Vui lòng chọn ảnh khác.');
    };
    image.src = objectUrl;
  });
}

export function validateCreateClassStepOne(
  values: CreateClassFormValues,
  options: CreateClassOptions | null = null,
): CreateClassValidationErrors {
  const normalized = normalizeCreateClassForm(values);
  const errors: CreateClassValidationErrors = {};

  if (!normalized.className) {
    errors.className = 'Vui lòng nhập tên lớp.';
  } else if (Array.from(normalized.className).length > 255) {
    errors.className = 'Tên lớp không được vượt quá 255 ký tự.';
  }

  if (!normalized.subjectId) {
    errors.subjectId = 'Vui lòng chọn môn học.';
  } else if (options && !options.subjects.some((subject) => subject.subjectId === normalized.subjectId)) {
    errors.subjectId = 'Môn học không hợp lệ. Vui lòng chọn lại.';
  }

  if (!normalized.gradeLevel) {
    errors.gradeLevel = 'Vui lòng chọn khối lớp.';
  } else if (options && !options.gradeLevels.some((grade) => grade.value === normalized.gradeLevel)) {
    errors.gradeLevel = 'Khối lớp không hợp lệ. Vui lòng chọn lại.';
  }

  const imageError = validateClassImage(values.imageFile);
  if (imageError) errors.imageFile = imageError;

  if (Array.from(normalized.description).length > 2000) {
    errors.description = 'Mô tả không được vượt quá 2.000 ký tự.';
  }

  return errors;
}

export function validateCreateClassStepTwo(
  values: CreateClassFormValues,
): CreateClassValidationErrors {
  const errors: CreateClassValidationErrors = {};

  if (values.maxUses !== null && values.maxUses <= 0) {
    errors.maxUses = 'Số lượt dùng tối đa phải lớn hơn 0.';
  }

  if (values.expiresAt !== null) {
    const timestamp = Date.parse(values.expiresAt);
    if (Number.isNaN(timestamp) || timestamp <= Date.now()) {
      errors.expiresAt = 'Thời điểm hết hạn phải ở tương lai.';
    }
  }

  return errors;
}

export function validateCreateClassForm(
  values: CreateClassFormValues,
  options: CreateClassOptions | null,
): CreateClassValidationErrors {
  return {
    ...validateCreateClassStepOne(values, options),
    ...validateCreateClassStepTwo(values),
  };
}

export function hasCreateClassValidationErrors(errors: CreateClassValidationErrors) {
  return Object.values(errors).some(Boolean);
}

export function hasCreateClassDraftData(values: CreateClassFormValues) {
  return Boolean(
    values.className.trim()
      || values.imageFile
      || values.uploadedImageUrl
      || values.subjectId
      || values.gradeLevel
      || values.description.trim()
      || values.requireStudentApproval
      || values.preventStudentLeave
      || values.allowStudentViewGrades
      || values.disableFeed
      || values.maxUses !== null
      || Boolean(values.expiresAt),
  );
}

export function mapBackendValidationErrors(fieldErrors?: Record<string, string[]>): CreateClassValidationErrors {
  if (!fieldErrors) return {};
  const mapped: CreateClassValidationErrors = {};
  for (const [rawField, messages] of Object.entries(fieldErrors)) {
    const message = messages.find(Boolean);
    if (!message) continue;
    const field = rawField.replace(/^request\./i, '').toLowerCase();
    if (field === 'classname') mapped.className = message;
    else if (field === 'subjectid') mapped.subjectId = message;
    else if (field === 'gradelevel') mapped.gradeLevel = message;
    else if (field === 'description') mapped.description = message;
    else if (field === 'imageurl' || field === 'file') mapped.imageFile = message;
    else if (field === 'maxuses') mapped.maxUses = message;
    else if (field === 'expiresat') mapped.expiresAt = message;
  }
  return mapped;
}

export function toGradeOptionValue(storageValue: string, options: CreateClassOptions | null) {
  if (!options) return undefined;
  const direct = options.gradeLevels.find((option) => option.value === storageValue);
  if (direct) return direct.value;
  if (/^\d+$/.test(storageValue)) {
    return options.gradeLevels.find((option) => option.value === `Grade${storageValue}`)?.value;
  }
  return undefined;
}
