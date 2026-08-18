import { BellOutlined, DesktopOutlined, DownOutlined, LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'
import { useLocation } from 'react-router-dom'
import { useSessionControls } from '@/features/auth'
import type { UserProfile } from '@/features/profile'
import { ROUTES } from '@/shared/constants/routes'

export function UserDropdown({ profile, profilePath }: { profile?: UserProfile; profilePath: string }) {
  const controls = useSessionControls()
  const location = useLocation()
  if (!profile) return <div className="workspace-user-skeleton" />
  const initials = profile.fullName.split(' ').slice(-2).map((part) => part[0]).join('').toUpperCase()
  const selected = new URLSearchParams(location.search).get('tab') || 'profile'
  const notificationsPath = profile.roleName === 'Teacher' ? ROUTES.teacherNotifications : '/student/notifications'
  const items = [
    { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ của tôi', onClick: () => controls.navigateTo(profilePath) },
    { key: 'password', icon: <LockOutlined />, label: 'Đổi mật khẩu', onClick: () => controls.navigateTo(`${profilePath}?tab=password`) },
    { key: 'sessions', icon: <DesktopOutlined />, label: 'Phiên đăng nhập', onClick: () => controls.navigateTo(`${profilePath}?tab=sessions`) },
    { key: 'notifications', icon: <BellOutlined />, label: 'Thông báo', onClick: () => controls.navigateTo(notificationsPath) },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, danger: true, disabled: controls.isPending, label: controls.isPending ? 'Đang đăng xuất...' : 'Đăng xuất', onClick: () => void controls.signOut() },
  ]
  return <Dropdown menu={{ items, selectedKeys: [selected] }} trigger={['click']} placement="bottomRight" overlayClassName="workspace-user-menu"><button type="button" className="workspace-user"><span className="workspace-avatar">{profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : initials}</span><span><b>{profile.fullName}</b><small>{profile.roleName === 'Teacher' ? 'Giáo viên' : 'Học sinh'}</small></span><DownOutlined /></button></Dropdown>
}
