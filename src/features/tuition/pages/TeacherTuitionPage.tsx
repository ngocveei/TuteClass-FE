import { BarChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Alert, Button } from 'antd'
import '@/features/tuition/tuition.css'

export default function TeacherTuitionPage() {
  return (
    <main className="teacher-tuition">
      <header>
        <div><p>Teacher</p><h1>Tuition Fee Management</h1><span>Create tuition fees, configure recipients, confirm payments, and monitor outstanding balances.</span></div>
        <div><Button disabled>Create fee</Button><Button disabled>Send reminder</Button></div>
      </header>
      <section className="teacher-tuition__modules">
        <article><small>features/tuition</small><h2>Payment tracking</h2><p>Payment list, status filters, reminders, receipts, and confirmation actions.</p></article>
        <article><small>features/classes</small><h2>Class recipients</h2><p>Fee recipients are scoped by class membership.</p></article>
      </section>
      <section className="teacher-tuition__chart">
        <h2><BarChartOutlined /> Thống kê học phí</h2>
        <Alert type="info" showIcon icon={<InfoCircleOutlined />} title="Chưa có dữ liệu học phí" description="Backend chưa cung cấp contract học phí nên hệ thống không hiển thị số liệu minh họa." />
      </section>
    </main>
  )
}
