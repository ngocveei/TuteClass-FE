import { NotificationCenter } from '@/features/notifications/components/NotificationCenter'
import '@/features/notifications/notifications.css'

export default function TeacherNotificationsPage() {
  return (
    <main className="teacher-notifications">
      <section className="teacher-notifications__hero">
        <p>Teacher</p>
        <h1>Thông báo</h1>
        <span>Cập nhật về lịch dạy, học viên, điểm danh, học phí và hoạt động lớp học.</span>
      </section>
      <NotificationCenter />
    </main>
  )
}
