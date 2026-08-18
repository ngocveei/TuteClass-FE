import { TeamOutlined } from '@ant-design/icons'
import { AppLayout } from '@/shared/layouts/AppLayout'
import { ROUTES } from '@/shared/constants/routes'

const teacherMenu = [
  { key: ROUTES.teacherClasses, icon: <TeamOutlined />, label: 'Lớp học' },
]

export function TeacherLayout() {
  return <AppLayout menuItems={teacherMenu} homePath={ROUTES.teacherClasses} roleLabel="Giáo viên" />
}
