import {
  BellOutlined,
  BookOutlined,
  CalendarOutlined,
  FileTextOutlined,
  HomeOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useProfileDetails } from '@/features/profile'
import { UserDropdown } from '@/shared/layouts/AppLayout/UserDropdown'
import '@/shared/layouts/AppLayout/workspace.css'

export function WorkspaceLayout({ role }: { role: 'teacher' | 'student' }) {
  const profile = useProfileDetails()
  const location = useLocation()
  const teacher = role === 'teacher'
  const isProfile = location.pathname.includes('/profile')
  const home = teacher ? '/classes' : '/student/classes'
  const profilePath = teacher ? '/teacher/profile' : '/student/profile'

  return (
    <div className={`workspace-shell workspace-shell--${role}`}>
      <header className="workspace-header">
        <NavLink to={home} className="workspace-logo">
          <img src="/assets/lam/logo-rmbg.png" alt="TuteClass" />
        </NavLink>
        <nav>
          <NavLink to={home}><HomeOutlined /><span>Trang chủ</span></NavLink>
          <a className="disabled" title="Đang phát triển"><CalendarOutlined /><span>Lịch</span></a>
          <a className="disabled" title="Đang phát triển"><TeamOutlined /><span>Học viên</span></a>
          <a className="disabled" title="Đang phát triển"><FileTextOutlined /><span>Bài tập</span></a>
          <a className="disabled" title="Đang phát triển"><BookOutlined /><span>Tài liệu</span></a>
        </nav>
        <label className="workspace-search">
          <SearchOutlined />
          <input placeholder="Tìm kiếm lớp, học sinh, bài tập..." disabled />
        </label>
        <button className="workspace-bell" type="button" disabled title="Đang phát triển"><BellOutlined /></button>
        <UserDropdown profile={profile.data} profilePath={profilePath} />
      </header>
      <div className="workspace-body">
        <main className={`workspace-content${isProfile ? ' workspace-content--profile' : ''}`}><Outlet /></main>
      </div>
    </div>
  )
}
