import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { TeacherLayout } from '@/shared/layouts/TeacherLayout/TeacherLayout'

vi.mock('@/features/profile', () => ({
  useProfileDetails: () => ({ data: undefined }),
}))

vi.mock('@/features/notifications', () => ({
  NotificationBell: () => <button type="button">Thông báo</button>,
}))

vi.mock('@/shared/layouts/AppLayout/UserDropdown', () => ({
  UserDropdown: () => <button type="button">Tài khoản</button>,
}))

describe('teacher navigation active state', () => {
  it('activates only the student links on the student-list route', () => {
    render(
      <MemoryRouter initialEntries={['/classes/students?classId=class-42']}>
        <Routes>
          <Route path="/classes/*" element={<TeacherLayout />}>
            <Route path="students" element={<div>Student list</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /Trang chủ/i })).not.toHaveClass('is-active')
    expect(screen.getAllByRole('link', { name: /Học viên/i })).toHaveLength(2)
    screen.getAllByRole('link', { name: /Học viên/i }).forEach((link) => {
      expect(link).toHaveClass('is-active')
    })
    expect(screen.getByTitle('Tổng quan')).not.toHaveClass('is-active')
    expect(screen.getByTitle('Học viên')).toHaveClass('is-active')
  })
})
