import { DownOutlined } from '@ant-design/icons'
import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ROUTES, teacherOverviewPath } from '@/shared/constants/routes'
import { TeacherWorkspaceIcon } from '@/shared/layouts/TeacherLayout/TeacherWorkspaceIcon'

function DockItem({ label, icon, to }: { label: string; icon: ReactNode; to?: string }) {
  if (!to) {
    return <button type="button" className="teacher-workspace-dock__item" disabled title="Đang phát triển">{icon}<span>{label}</span></button>
  }
  return <NavLink to={to} className={({ isActive }) => `teacher-workspace-dock__item${isActive ? ' is-active' : ''}`} title={label}>{icon}<span>{label}</span></NavLink>
}

export function TeacherWorkspaceDock() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const classId = new URLSearchParams(location.search).get('classId')
  const overviewPath = teacherOverviewPath(classId ?? undefined)
  const studentsPath = `${ROUTES.teacherStudents}${classId ? `?classId=${encodeURIComponent(classId)}` : ''}`

  useEffect(() => {
    setIsCollapsed(window.localStorage.getItem('teacherDockCollapsed') === 'true')
  }, [])

  const toggleDock = () => {
    setIsCollapsed((current) => {
      const next = !current
      window.localStorage.setItem('teacherDockCollapsed', String(next))
      return next
    })
  }

  return (
    <div className={`teacher-workspace-dock-shell${isCollapsed ? ' is-collapsed' : ''}`}>
      <div className="teacher-workspace-dock">
        <svg className="teacher-workspace-dock__cradle" viewBox="0 0 524 56" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
          <path d="M 56 0 L 468 0 A 26 26 0 0 1 494 26 A 30 30 0 0 0 524 56 L 0 56 A 30 30 0 0 0 30 26 A 26 26 0 0 1 56 0 Z" />
        </svg>
        <nav className="teacher-workspace-dock__nav" aria-label="Điều hướng nhanh giáo viên">
          <DockItem label="Tổng quan" icon={<TeacherWorkspaceIcon name="grid" />} to={overviewPath} />
          <DockItem label="Lịch dạy" icon={<TeacherWorkspaceIcon name="calendar" />} />
          <DockItem label="Học viên" icon={<TeacherWorkspaceIcon name="people" />} to={studentsPath} />
          <DockItem label="Học phí" icon={<TeacherWorkspaceIcon name="card" />} to={ROUTES.teacherTuition} />
          <DockItem label="Bài tập" icon={<TeacherWorkspaceIcon name="file" />} />
          <DockItem label="Tài liệu" icon={<TeacherWorkspaceIcon name="book" />} />
          <DockItem label="Trao đổi" icon={<TeacherWorkspaceIcon name="message" />} />
          <DockItem label="Trợ lý AI" icon={<TeacherWorkspaceIcon name="sparkles" />} />
        </nav>
      </div>
      <button type="button" className="teacher-workspace-dock__toggle" onClick={toggleDock} aria-label={isCollapsed ? 'Mở thanh điều hướng nhanh' : 'Thu gọn thanh điều hướng nhanh'}>
        <DownOutlined />
      </button>
    </div>
  )
}
