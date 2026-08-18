import { SearchOutlined, TeamOutlined } from '@ant-design/icons'
import '@/features/administration/administration.css'

export default function AdminUsersPage() {
  return <main className="admin-users-old"><header><h1>Quản lý người dùng</h1><p>Xem và quản lý tài khoản giáo viên, học sinh trong hệ thống.</p></header><section className="admin-users-old__card"><div className="admin-users-old__toolbar"><label className="admin-users-old__search"><SearchOutlined /><input aria-label="Tìm kiếm người dùng" placeholder="Tìm theo tên hoặc email..." /></label></div><div className="admin-users-old__empty"><div><span><TeamOutlined /></span><b>Chưa có dữ liệu người dùng</b><p>Dữ liệu từ hệ thống sẽ hiển thị tại đây.</p></div></div></section></main>
}
