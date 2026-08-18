import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import type { PropsWithChildren } from 'react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ClassApprovalRequestsScreen } from '@/features/classes/components/approvals/ClassApprovalRequestsScreen'
import { useClassApprovals } from '@/features/classes/hooks/useClassApprovals'
import type { JoinRequestsFlowController } from '@/features/classes/types/classApproval.types'
import { server } from './support/server'

const api = 'http://localhost:8080'

function LocationProbe() {
  const location = useLocation()
  return <output>{`${location.pathname}${location.search}`}</output>
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/classes/class-42/approval-requests']}>
          <LocationProbe />
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    )
  }
}

function flow(overrides: Partial<JoinRequestsFlowController> = {}): JoinRequestsFlowController {
  return {
    classId: 'class-42',
    className: 'OME D12',
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
    searchTerm: '',
    statusFilter: 'all',
    sortOption: 'newest',
    isLoading: false,
    isError: false,
    errorMessage: null,
    processingStudentIds: new Set(),
    messageContextHolder: <></>,
    setSearchTerm: vi.fn(),
    setStatusFilter: vi.fn(),
    setSortOption: vi.fn(),
    setPage: vi.fn(),
    handleApprove: vi.fn().mockResolvedValue(undefined),
    handleReject: vi.fn().mockResolvedValue(undefined),
    handleRefetch: vi.fn(),
    goBack: vi.fn(),
    ...overrides,
  }
}

describe('class approval context', () => {
  it('renders the active class as text instead of a class picker', () => {
    const controller = flow()
    const { container } = render(<ClassApprovalRequestsScreen flow={controller} />)

    expect(screen.getByText('OME D12')).toBeInTheDocument()
    expect(container.querySelector('.student-page-title-class-trigger')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /quay lại tổng quan lớp/i }))
    expect(controller.goBack).toHaveBeenCalledOnce()
  })

  it('uses the route class ID for requests and returns to its overview', async () => {
    let requestedClassId = ''
    server.use(
      http.get(`${api}/api/classes/:classId/join-requests`, ({ params }) => {
        requestedClassId = String(params.classId)
        return HttpResponse.json({
          classId: requestedClassId,
          className: 'OME D12',
          items: [],
          page: 1,
          pageSize: 20,
          totalCount: 0,
        })
      }),
    )

    const { result } = renderHook(() => useClassApprovals('class-42'), {
      wrapper: createWrapper(new QueryClient({ defaultOptions: { queries: { retry: false } } })),
    })

    await waitFor(() => {
      expect(result.current.className).toBe('OME D12')
    })
    expect(requestedClassId).toBe('class-42')

    act(() => result.current.goBack())
    expect(screen.getByText('/classes?classId=class-42')).toBeInTheDocument()
  })
})
