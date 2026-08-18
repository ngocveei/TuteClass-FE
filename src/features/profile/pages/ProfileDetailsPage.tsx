import { CheckCircleFilled, ClockCircleOutlined, CreditCardOutlined, EditOutlined, InfoCircleOutlined, MailOutlined, PhoneOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { Alert, Form, Input, Skeleton, message } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getMyProfile, updateMyProfile, updateTeacherBank, updateTeachingWindow } from '@/features/profile/api/profile.api'
import { ProfilePasswordView } from '@/features/profile/components/ProfilePasswordView'
import { ActiveSessionsPanel } from '@/features/profile/components/ActiveSessionsPanel'
import type { ProfileUpdate } from '@/features/profile/types/profile.types'
import { getApiErrorMessage } from '@/services/api/getApiErrorMessage'
import '@/features/profile/profile.css'

type BankValues={bankName:string;bankAccountNumber:string;bankAccountHolderName:string}
type WindowValues={start:string;end:string}
const shown=(value?:string|null)=>value?.trim()||'Chưa cập nhật'

export default function ProfileDetailsPage(){
  const[params]=useSearchParams();const qc=useQueryClient();const[editingProfile,setEditingProfile]=useState(false);const[editingBank,setEditingBank]=useState(false);const[editingWindow,setEditingWindow]=useState(false)
  const query=useQuery({queryKey:['profile','me'],queryFn:getMyProfile})
  const save=useMutation({mutationFn:updateMyProfile,onSuccess:data=>{qc.setQueryData(['profile','me'],data);setEditingProfile(false);message.success('Đã cập nhật hồ sơ.')}})
  const bank=useMutation({mutationFn:updateTeacherBank,onSuccess:data=>{qc.setQueryData(['profile','me'],data);setEditingBank(false);message.success('Đã cập nhật thông tin ngân hàng.')}})
  const teaching=useMutation({mutationFn:updateTeachingWindow,onSuccess:data=>{qc.setQueryData(['profile','me'],data);setEditingWindow(false);message.success('Đã cập nhật khung giờ dạy.')}})
  if(query.isLoading)return <div className="profile-match-shell"><Skeleton active/></div>
  if(query.isError||!query.data)return <Alert type="error" showIcon message="Không thể tải hồ sơ" description={getApiErrorMessage(query.error)}/>
  const p=query.data;const teacher=p.roleName==='Teacher';const role=teacher?'Giáo viên':'Học sinh';const profilePath=teacher?'/teacher/profile':'/student/profile'
  if(params.get('tab')==='password')return <div className="profile-match-shell"><ProfilePasswordView profilePath={profilePath}/></div>
  if(params.get('tab')==='sessions')return <div className="profile-match-shell"><ActiveSessionsPanel profilePath={profilePath}/></div>
  const profileInitial:ProfileUpdate={fullName:p.fullName,phone:p.phone??'',dateOfBirth:p.studentProfile?.dateOfBirth?.slice(0,10),schoolName:p.studentProfile?.schoolName??'',parentName:p.studentProfile?.parentName??'',parentPhone:p.studentProfile?.parentPhone??''}
  const bankInitial:BankValues={bankName:p.teacherBank?.bankName??'',bankAccountNumber:p.teacherBank?.bankAccountNumber??'',bankAccountHolderName:p.teacherBank?.bankAccountHolderName??''}
  const windowInitial:WindowValues={start:p.teachingWindow?.start??'07:00',end:p.teachingWindow?.end??'21:00'}
  return <main className="profile-match-shell">
    <section className="profile-match-card profile-main-old"><header><div><h2>Hồ sơ của tôi {p.emailVerified&&<span><CheckCircleFilled/> Đã xác thực email</span>}</h2><p>Xem và quản lý thông tin cá nhân của bạn.</p></div>{!editingProfile&&<button className="profile-edit-blue" type="button" onClick={()=>setEditingProfile(true)}><EditOutlined/> Chỉnh sửa</button>}</header>
      <div className="profile-match-body"><aside><div className="profile-match-avatar">{p.avatarUrl?<img src={p.avatarUrl} alt={p.fullName}/>:<img src="/assets/lam/orbit-core.png" alt=""/>}<button type="button" aria-label="Đổi ảnh đại diện">▣</button></div><h3>{p.fullName}</h3><b>{role}</b><div className="profile-contact"><small><MailOutlined/> {p.email}</small><small><PhoneOutlined/> {shown(p.phone)}</small></div></aside>
        <Form<ProfileUpdate> key={`${p.userId}-${editingProfile}`} layout="vertical" initialValues={profileInitial} onFinish={v=>save.mutate(v)}><div className="profile-info-table"><div><label>Họ và tên</label>{editingProfile?<Form.Item name="fullName" rules={[{required:true,message:'Vui lòng nhập họ tên.'}]}><Input/></Form.Item>:<strong>{p.fullName}</strong>}</div><div><label>Email</label><strong>{p.email} {p.emailVerified&&<CheckCircleFilled className="verified"/>}</strong></div><div><label>Số điện thoại</label>{editingProfile?<Form.Item name="phone"><Input/></Form.Item>:<strong>{shown(p.phone)}</strong>}</div><div><label>Vai trò</label><strong>{role}</strong></div>{!teacher&&<><div><label>Ngày sinh</label>{editingProfile?<Form.Item name="dateOfBirth"><Input type="date"/></Form.Item>:<strong>{shown(p.studentProfile?.dateOfBirth?.slice(0,10))}</strong>}</div><div><label>Trường học</label>{editingProfile?<Form.Item name="schoolName"><Input/></Form.Item>:<strong>{shown(p.studentProfile?.schoolName)}</strong>}</div></>}</div>{editingProfile&&<footer className="profile-form-actions"><button type="button" onClick={()=>setEditingProfile(false)}>Hủy</button><button className="primary" type="submit" disabled={save.isPending}>{save.isPending?'Đang lưu...':'Lưu thay đổi'}</button></footer>}</Form>
      </div>
    </section>
    {teacher&&<><section className="profile-match-card profile-section-old"><header><div><h2><CreditCardOutlined/> Thông tin tài khoản ngân hàng</h2><p>Dùng để nhận thanh toán học phí, hoàn tiền hoặc các giao dịch khác.</p></div>{!editingBank&&<button className="profile-edit-blue" type="button" onClick={()=>setEditingBank(true)}><EditOutlined/> Chỉnh sửa</button>}</header><Form<BankValues> key={`bank-${editingBank}`} initialValues={bankInitial} onFinish={v=>bank.mutate(v)}><div className="profile-three-fields">{(['bankName','bankAccountNumber','bankAccountHolderName'] as const).map((name,index)=><div key={name}><label>{['Ngân hàng','Số tài khoản','Chủ tài khoản'][index]}</label>{editingBank?<Form.Item name={name}><Input placeholder={['Ví dụ: Vietcombank','Nhập số tài khoản','Họ tên chủ tài khoản'][index]}/></Form.Item>:<strong>{shown(bankInitial[name])}</strong>}</div>)}</div>{editingBank&&<footer className="profile-form-actions"><button type="button" onClick={()=>setEditingBank(false)}>Hủy</button><button className="primary" type="submit" disabled={bank.isPending}>Lưu thay đổi</button></footer>}</Form><div className="bank-note"><InfoCircleOutlined/> Mỗi giáo viên chỉ có một bộ thông tin ngân hàng để nhận thanh toán.</div></section>
      <section className="profile-match-card profile-section-old"><header><div><h2><ClockCircleOutlined/> Khung giờ dạy</h2><p>Áp dụng cho tất cả lớp của bạn khi tạo lịch dạy.</p></div>{!editingWindow&&<button className="profile-edit-blue" type="button" onClick={()=>setEditingWindow(true)}><EditOutlined/> Chỉnh sửa</button>}</header><Form<WindowValues> key={`window-${editingWindow}`} initialValues={windowInitial} onFinish={v=>teaching.mutate(v)}><div className="profile-three-fields profile-window-fields"><div><label>Bắt đầu</label>{editingWindow?<Form.Item name="start"><Input type="time"/></Form.Item>:<strong>{windowInitial.start}</strong>}</div><div><label>Kết thúc</label>{editingWindow?<Form.Item name="end"><Input type="time"/></Form.Item>:<strong>{windowInitial.end}</strong>}</div></div>{editingWindow&&<footer className="profile-form-actions"><button type="button" onClick={()=>setEditingWindow(false)}>Hủy</button><button className="primary" type="submit" disabled={teaching.isPending}>Lưu khung giờ</button></footer>}</Form></section></>}
    <div className="profile-match-security"><SafetyCertificateOutlined/><div><b>Bảo mật thông tin</b><p>Chúng tôi cam kết bảo mật thông tin cá nhân và chỉ sử dụng cho mục đích vận hành hệ thống.</p></div></div>
  </main>
}
