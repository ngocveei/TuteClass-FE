import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TeacherNotificationsPage from '@/features/notifications/pages/TeacherNotificationsPage'
import TeacherTuitionPage from '@/features/tuition/pages/TeacherTuitionPage'

describe('unsupported Teacher domains', () => {
  it('keeps notification controls visible but unavailable without a backend contract', () => {
    render(<TeacherNotificationsPage />)
    expect(screen.getByText('Backend chưa hỗ trợ thông báo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' })).toBeDisabled()
  })

  it('does not render fake tuition metrics', () => {
    render(<TeacherTuitionPage />)
    expect(screen.getByText('Chưa có dữ liệu học phí')).toBeInTheDocument()
    expect(screen.queryByText(/\d+[.,]?\d*\s*(?:₫|đ)/)).not.toBeInTheDocument()
  })
})
