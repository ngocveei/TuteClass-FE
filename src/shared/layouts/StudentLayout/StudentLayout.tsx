import { ReadOutlined } from '@ant-design/icons'
import { AppLayout } from '@/shared/layouts/AppLayout'
import { ROUTES } from '@/shared/constants/routes'

const studentMenu = [
  { key: ROUTES.studentClasses, icon: <ReadOutlined />, label: 'Lớp của tôi' },
]

export function StudentLayout() {
  return <AppLayout menuItems={studentMenu} homePath={ROUTES.studentClasses} roleLabel="Học viên" />
}
