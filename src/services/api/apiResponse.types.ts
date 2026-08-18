export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiValidationError {
  title?: string
  detail?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
}
