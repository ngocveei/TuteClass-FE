import { ArrowLeftOutlined, CalendarOutlined, CheckCircleOutlined, TeamOutlined } from '@ant-design/icons'
import { Alert } from 'antd'
import { Link, useParams } from 'react-router-dom'
import { useClass } from '@/features/classes/hooks/useClass'
import { getClassStatusText } from '@/features/classes/utils/class.utils'
import { getApiErrorMessage } from '@/services/api/getApiErrorMessage'
import { Loading } from '@/shared/components/Loading/Loading'
import { ROUTES } from '@/shared/constants/routes'
import '@/features/classes/classes.css'

export default function ClassDetailPage() {
  const { classId = '' } = useParams()
  const classQuery = useClass(classId)

  if (classQuery.isLoading) return <Loading />
  if (classQuery.isError) {
    return <Alert type="error" showIcon message="Không thể tải lớp học" description={getApiErrorMessage(classQuery.error)} />
  }
  if (!classQuery.data) return null

  const item = classQuery.data
  return <main className="classes-page class-detail-old"><Link className="class-detail-old__back" to={ROUTES.teacherClasses}><ArrowLeftOutlined /> Quay lại danh sách lớp</Link><section className="class-detail-old__hero"><span className={`class-old-card__status${item.status==='Completed'?' class-old-card__status--completed':''}`}>{getClassStatusText(item.status)}</span><h1>{item.name}</h1><p>{item.description||'Chưa có mô tả cho lớp học này.'}</p></section><section className="class-detail-old__stats"><div className="class-detail-stat"><span><TeamOutlined /></span><div><small>Học viên</small><strong>{item.studentCount} học sinh</strong></div></div><div className="class-detail-stat"><span><CheckCircleOutlined /></span><div><small>Trạng thái</small><strong>{getClassStatusText(item.status)}</strong></div></div><div className="class-detail-stat"><span><CalendarOutlined /></span><div><small>Ngày tạo</small><strong>{item.createdAt?new Intl.DateTimeFormat('vi-VN').format(new Date(item.createdAt)):'Chưa cập nhật'}</strong></div></div></section><section className="class-detail-old__panel"><h2>Hoạt động của lớp</h2><p>Các buổi học, bài tập và hoạt động gần đây sẽ hiển thị tại đây.</p></section></main>
}
