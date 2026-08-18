import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { classSettingsApi } from '@/features/classes/api/classSettings.api'
import { joinRequestsApi } from '@/features/classes/api/classApprovals.api'
import { teacherStudentListApi } from '@/features/classes/api/classStudents.api'
import { teacherClassesApi } from '@/features/classes/api/classes.api'
import { createClassApi } from '@/features/classes/api/createClass.api'
import { server } from './support/server'

const api = 'http://localhost:8080'
const unavailable = { available: false }

describe('Teacher classes API mapping', () => {
  it('maps owned classes and create options without mock fallbacks', async () => {
    server.use(
      http.get(`${api}/api/classes/mine`, () => HttpResponse.json([{ classId: 'class-1', className: 'Toán 10', studentCount: 12, imageUrl: null, status: 'Active' }])),
      http.get(`${api}/api/classes/create-options`, () => HttpResponse.json({ subjects: [{ subjectId: 'math', subjectName: 'Toán' }], gradeLevels: [{ value: 'Grade10', label: '10' }] })),
    )
    await expect(teacherClassesApi.getMine()).resolves.toMatchObject([{ classId: 'class-1', className: 'Toán 10', studentCount: 12, status: 'Active' }])
    await expect(createClassApi.getOptions()).resolves.toEqual({ subjects: [{ subjectId: 'math', subjectName: 'Toán' }], gradeLevels: [{ value: 'Grade10', label: '10', displayLabel: 'Lớp 10' }] })
  })

  it('maps pending approvals from backend identity data', async () => {
    server.use(http.get(`${api}/api/classes/class-1/join-requests`, () => HttpResponse.json({
      classId: 'class-1', className: 'Toán 10', page: 1, pageSize: 20, totalCount: 1,
      items: [{ studentId: 'student-1', fullName: 'Trần An', email: 'an@example.com', avatarUrl: null, requestedAt: '2026-08-18T10:00:00Z', status: 'Pending' }],
    })))
    const data = await joinRequestsApi.getJoinRequests({ classId: 'class-1' })
    expect(data.items[0]).toMatchObject({ studentId: 'student-1', fullName: 'Trần An', initials: 'TA', status: 'Pending' })
  })

  it('keeps unsupported student metrics explicitly unavailable', async () => {
    server.use(http.get(`${api}/api/classes/class-1/students`, () => HttpResponse.json({
      classId: 'class-1', className: 'Toán 10', page: 1, pageSize: 20, totalCount: 1,
      summary: { totalStudents: 1, activeCount: 1, inactiveCount: 0, avgAttendance: unavailable, avgScore: unavailable },
      items: [{
        studentId: 'student-1', fullName: 'Trần An', email: 'an@example.com', avatarUrl: null,
        enrollmentStatus: 'Active', joinedAt: '2026-08-18T10:00:00Z',
        metrics: { attendance: unavailable, score: unavailable, homework: unavailable, fee: unavailable, insight: unavailable },
      }],
    })))
    const data = await teacherStudentListApi.getStudents({ classId: 'class-1', page: 1, pageSize: 20 })
    expect(data.items[0].metrics).toEqual({ attendance: unavailable, score: unavailable, homework: unavailable, fee: unavailable, insight: unavailable })
  })

  it('validates and maps class settings', async () => {
    server.use(http.get(`${api}/api/classes/class-1/settings`, () => HttpResponse.json({
      classId: 'class-1', className: 'Toán 10', imageUrl: null,
      subject: { subjectId: 'math', subjectName: 'Toán' }, gradeLevel: 'Grade10', description: null,
      feeType: 'Free', feeAmount: 0, status: 'Active',
      settings: { requireStudentApproval: true, allowStudentLeave: true, allowStudentViewGrades: false, allowFeedActivity: true, sessionDurationMinutes: 90 },
    })))
    await expect(classSettingsApi.getClassSettings('class-1')).resolves.toMatchObject({ classId: 'class-1', gradeLevel: 'Grade10', settings: { sessionDurationMinutes: 90 } })
  })
})
