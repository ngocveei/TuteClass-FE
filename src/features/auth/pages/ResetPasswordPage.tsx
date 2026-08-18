import { ArrowLeftOutlined, KeyOutlined, LockOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resetPassword } from '@/features/auth/api/auth.api'
import { getApiErrorMessage } from '@/services/api/getApiErrorMessage'
import '@/features/auth/recovery.css'

interface ResetForm { otp: string; newPassword: string; confirmPassword: string }
export default function ResetPasswordPage() {
  const [error,setError]=useState<string>(); const [success,setSuccess]=useState(false); const [pending,setPending]=useState(false)
  const submit=async(v:ResetForm)=>{setPending(true);setError(undefined);try{await resetPassword(v.otp,v.newPassword);setSuccess(true)}catch(reason){setError(getApiErrorMessage(reason))}finally{setPending(false)}}
  return <main className="recovery-page"><section className="reset-card"><Link to="/login"><ArrowLeftOutlined/> Quay lại đăng nhập</Link><div className="reset-head"><KeyOutlined/><h1>Tạo mật khẩu mới</h1><p>Mật khẩu mới phải đáp ứng chính sách bảo mật của TuteClass.</p></div>{success?<><Alert type="success" showIcon message="Đặt lại mật khẩu thành công!"/><Link to="/login"><Button type="primary" block size="large">Đăng nhập ngay</Button></Link></>:<Form<ResetForm> layout="vertical" onFinish={submit}>{error&&<Alert type="error" showIcon message={error}/>}<Form.Item name="otp" label="Mã OTP (6 chữ số)" rules={[{required:true},{len:6},{pattern:/^\d{6}$/}]}><Input prefix={<KeyOutlined/>} maxLength={6} size="large"/></Form.Item><Form.Item name="newPassword" label="Mật khẩu mới" rules={[{required:true},{min:8},{pattern:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S+$/}]}><Input.Password prefix={<LockOutlined/>} size="large"/></Form.Item><Form.Item name="confirmPassword" label="Xác nhận mật khẩu" dependencies={['newPassword']} rules={[({getFieldValue})=>({validator:(_,v)=>v===getFieldValue('newPassword')?Promise.resolve():Promise.reject(new Error('Mật khẩu xác nhận không khớp.'))})]}><Input.Password prefix={<LockOutlined/>} size="large"/></Form.Item><Button type="primary" htmlType="submit" loading={pending} block size="large">Đặt lại mật khẩu</Button></Form>}</section></main>
}
