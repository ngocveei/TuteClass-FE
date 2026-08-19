const MIN_SESSION_DURATION_MINUTES = 15;
const MAX_SESSION_DURATION_MINUTES = 240;

export const SESSION_DURATION_LIMITS = {
  min: MIN_SESSION_DURATION_MINUTES,
  max: MAX_SESSION_DURATION_MINUTES,
  step: 15,
  defaultValue: 90,
} as const;

// Kiểm tra giá trị form trước khi hook gửi PUT Class Settings lên Backend.
export function validateSessionDurationMinutes(value: number): string | null {
  if (!Number.isInteger(value)) return 'Thời lượng một buổi phải là số nguyên.';
  if (value < MIN_SESSION_DURATION_MINUTES || value > MAX_SESSION_DURATION_MINUTES) {
    return `Thời lượng một buổi phải từ ${MIN_SESSION_DURATION_MINUTES} đến ${MAX_SESSION_DURATION_MINUTES} phút.`;
  }
  return null;
}

