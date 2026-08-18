import axios from 'axios'
import type { ApiValidationError } from '@/services/api/apiResponse.types'

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiValidationError>(error)) {
    return error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định.'
  }

  const validationErrors = error.response?.data?.errors
  const firstValidationMessage = validationErrors
    ? Object.values(validationErrors).flat()[0]
    : undefined

  return (
    firstValidationMessage ??
    error.response?.data?.detail ??
    error.response?.data?.title ??
    error.message ??
    'Không thể kết nối đến máy chủ.'
  )
}
