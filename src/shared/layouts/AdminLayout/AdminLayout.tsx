import { UserOutlined } from '@ant-design/icons'
import { AppLayout } from '@/shared/layouts/AppLayout'
import { ROUTES } from '@/shared/constants/routes'

const adminMenu = [
  { key: ROUTES.adminUsers, icon: <UserOutlined />, label: 'Người dùng' },
]

export function AdminLayout() {
  return <AppLayout menuItems={adminMenu} homePath={ROUTES.adminUsers} roleLabel="Quản trị viên" />
}
