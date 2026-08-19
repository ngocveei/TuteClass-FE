import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, renderHook, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import type { PropsWithChildren } from 'react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { useSessionControls } from '@/features/auth/hooks/useSessionControls'
import { useClassStudents } from '@/features/classes/hooks/useClassStudents'
import { server } from './support/server'

const api = 'http://localhost:8080'

vi.mock('@/features/classes/hooks/useTeacherClasses', () => ({
  useTeacherClasses: () => ({
    data: [{
      classId: 'class-new',
      className: 'Lớp mới',
      imageUrl: null,
      studentCount: 0,
      status: 'Active',
      tone: 'amber',
    }],
    error: null,
    isLoading: false,
  }),
}))

vi.mock('@/features/classes/api/classStudents.api', () => ({
  teacherStudentListApi: {
    getStudents: vi.fn().mockResolvedValue({
      classId: 'class-new',
      className: 'Lớp mới',
      summary: {
        totalStudents: 0,
        activeCount: 0,
        inactiveCount: 0,
        avgAttendance: { available: false },
        avgScore: { available: false },
      },
      items: [],
      page: 1,
      pageSize: 20,
      totalCount: 0,
    }),
  },
}))

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }
}

describe('session cache boundaries', () => {
  it('clears previous account data after logout and before password login', async () => {
    server.use(
      http.post(`${api}/api/auth/logout`, () => new HttpResponse(null, { status: 204 })),
      http.post(`${api}/api/auth/login`, () => HttpResponse.json({
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
        accessTokenExpiresAt: '2030-01-01T00:00:00Z',
        refreshTokenExpiresAt: '2030-02-01T00:00:00Z',
        user: {
          userId: 'teacher-b',
          fullName: 'Teacher B',
          email: 'teacher-b@example.com',
          roleName: 'Teacher',
          isFirstLogin: false,
        },
      })),
    )

    const logoutClient = new QueryClient()
    logoutClient.setQueryData(['classes', 'mine', 'All'], [{ classId: 'teacher-a-class' }])
    const { result: logoutResult } = renderHook(() => useSessionControls(), {
      wrapper: createWrapper(logoutClient),
    })
    act(() => logoutResult.current.signOut())
    await waitFor(() => {
      expect(logoutClient.getQueryData(['classes', 'mine', 'All'])).toBeUndefined()
    })

    const loginClient = new QueryClient()
    loginClient.setQueryData(['profile', 'me'], { fullName: 'Teacher A' })
    const { result: loginResult } = renderHook(() => useLogin(), {
      wrapper: createWrapper(loginClient),
    })
    await act(async () => {
      await loginResult.current.submit({
        email: 'teacher-b@example.com',
        password: 'Secret1!',
      })
    })
    expect(loginClient.getQueryData(['profile', 'me'])).toBeUndefined()
  })

  it('keeps an invalid classId so the student page can show its unavailable state', async () => {
    function ClassSelectionHarness() {
      useClassStudents()
      const location = useLocation()
      return <output>{location.search}</output>
    }

    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <MemoryRouter initialEntries={['/classes/class-old/students?classId=class-old&status=Active']}>
          <ClassSelectionHarness />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('?classId=class-old&status=Active')).toBeInTheDocument()
    })
  })
})
