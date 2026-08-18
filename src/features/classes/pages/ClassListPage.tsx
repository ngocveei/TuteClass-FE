import { CalendarOutlined, CheckSquareOutlined, ClockCircleOutlined, PlusOutlined, SettingOutlined, StarOutlined } from '@ant-design/icons'
import { Alert, Spin } from 'antd'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CreateClassModal } from '@/features/classes/components/CreateClassModal'
import { useClasses } from '@/features/classes/hooks/useClasses'
import { getApiErrorMessage } from '@/services/api/getApiErrorMessage'
import '@/features/classes/classes.css'
import '@/features/classes/teacher-dashboard.css'

export default function ClassListPage() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const classesQuery = useClasses()
  const[params,setParams]=useSearchParams()
  const classes=classesQuery.data??[];const selected=classes.find(x=>x.id===params.get('classId'))??classes[0]

  return <main className="teacher-dashboard">
    {classesQuery.isError && <Alert className="class-error-old" type="error" showIcon message="Không thể tải danh sách lớp" description={getApiErrorMessage(classesQuery.error)} action={<button className="classes-page__button" type="button" onClick={() => classesQuery.refetch()}>Thử lại</button>} />}
    {classesQuery.isLoading && <div className="class-state-old"><Spin size="large" /></div>}
    {!classesQuery.isError&&!classesQuery.isLoading&&!selected&&<section className="class-empty-old"><div><h2>Chưa có lớp học</h2><p>Hãy tạo lớp đầu tiên để bắt đầu quản lý học viên.</p><button className="classes-page__button classes-page__button--primary" type="button" onClick={()=>setCreateModalOpen(true)}><PlusOutlined/> Tạo lớp mới</button></div></section>}
    {selected&&<><header><div><h1>Tổng quan lớp <select value={selected.id} onChange={e=>setParams({classId:e.target.value})}>{classes.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></h1><p>Đây là tình hình lớp học hôm nay 👋</p></div><div className="teacher-head-actions"><button type="button"><SettingOutlined/></button><button type="button"><ClockCircleOutlined/> Duyệt {selected.pendingApprovalCount?`(${selected.pendingApprovalCount})`:''}</button><span>{new Date().toLocaleDateString('vi-VN')} <CalendarOutlined/></span></div></header><section className="teacher-kpis"><article><span><StarOutlined/></span><em>Chia sẻ</em><small>Mã mời vào lớp</small><strong>{selected.id.slice(0,8)}</strong></article><article><span><CalendarOutlined/></span><em>{selected.status==='Active'?'Đang học':'Đã xong'}</em><small>Học phí cần thu</small><strong>—</strong></article><article><span><CheckSquareOutlined/></span><em>Cập nhật</em><small>Bài cần chấm</small><strong>0 bài</strong></article><article><span><ClockCircleOutlined/></span><em>Tiến độ</em><small>Tiết đã dạy</small><strong>{selected.studentCount} học viên</strong></article></section><section className="teacher-panels"><article><h2><CalendarOutlined/> Lịch sắp tới <em>Cả tuần</em></h2><div className="teacher-panel-empty">Chưa có lịch dạy sắp tới.</div></article><article><h2><CheckSquareOutlined/> Việc cần làm <em>0/0</em><button type="button"><PlusOutlined/></button></h2><div className="teacher-panel-empty">Chưa có việc cần làm.</div></article></section></>}
    <CreateClassModal open={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
  </main>
}
