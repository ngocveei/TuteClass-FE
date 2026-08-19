import type { ReactNode } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useProfileDetails } from '@/features/profile'
import { NotificationBell } from '@/features/notifications'
import { UserDropdown } from '@/shared/layouts/AppLayout/UserDropdown'
import { ROUTES, teacherOverviewPath } from '@/shared/constants/routes'
import { TeacherWorkspaceDock } from '@/shared/layouts/TeacherLayout/TeacherWorkspaceDock'
import { TeacherWorkspaceIcon } from '@/shared/layouts/TeacherLayout/TeacherWorkspaceIcon'
import '@/shared/layouts/TeacherLayout/teacher-workspace.css'

function TeacherTopbarItem({ label, icon, to, end = false }: { label: string; icon: ReactNode; to?: string; end?: boolean }) {
  if (!to) return <button type="button" className="teacher-workspace__nav-link" disabled title="Đang phát triển">{icon}<span>{label}</span></button>
  return <NavLink to={to} end={end} className={({ isActive }) => `teacher-workspace__nav-link${isActive ? ' is-active' : ''}`}>{icon}<span>{label}</span></NavLink>
}

export function TeacherLayout() {
  const profile = useProfileDetails()
  const location = useLocation()
  const classId = new URLSearchParams(location.search).get('classId')
  const overviewPath = teacherOverviewPath(classId ?? undefined)
  const studentsPath = `${ROUTES.teacherStudents}${classId ? `?classId=${encodeURIComponent(classId)}` : ''}`
  const isOverview = location.pathname === ROUTES.teacherClasses
  const isStudents = location.pathname === ROUTES.teacherStudents

  return (
    <div className="teacher-workspace">
      <header className="teacher-workspace__topbar">
        <NavLink to={overviewPath} className="teacher-workspace__brand" aria-label="TuteClass Teacher Workspace">
          <img src="/assets/lam/logo-rmbg.png" alt="TuteClass" />
        </NavLink>
        <nav className="teacher-workspace__nav" aria-label="Điều hướng giáo viên">
          <TeacherTopbarItem label="Trang chủ" icon={<TeacherWorkspaceIcon name="home" />} to={overviewPath} end />
          <TeacherTopbarItem label="Lịch" icon={<TeacherWorkspaceIcon name="calendar" />} />
          <TeacherTopbarItem label="Học viên" icon={<TeacherWorkspaceIcon name="people" />} to={studentsPath} />
          <TeacherTopbarItem label="Bài tập" icon={<TeacherWorkspaceIcon name="file" />} />
          <TeacherTopbarItem label="Báo cáo" icon={<TeacherWorkspaceIcon name="chart" />} />
        </nav>
        <label className="teacher-workspace__search">
          <TeacherWorkspaceIcon name="search" />
          <input disabled aria-label="Tìm kiếm lớp, học sinh, bài tập" placeholder="Tìm kiếm lớp, học sinh, bài tập..." />
        </label>
        <div className="teacher-workspace__actions">
          <NavLink to={ROUTES.teacherCreateClass} className="teacher-workspace__create-class"><span aria-hidden="true">+</span> Tạo lớp</NavLink>
          <NotificationBell triggerIcon={<TeacherWorkspaceIcon name="bell" />} />
          <UserDropdown profile={profile.data} profilePath={ROUTES.teacherProfile} />
        </div>
      </header>
      <div className={`teacher-workspace__main${isOverview ? ' teacher-workspace__main--overview' : ''}${isStudents ? ' teacher-workspace__main--students' : ''}`}>
        <Outlet />
      </div>
      <TeacherWorkspaceDock />
    </div>
  )
}
