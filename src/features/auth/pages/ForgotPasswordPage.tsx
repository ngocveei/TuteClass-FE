import { ArrowLeftOutlined, CustomerServiceOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input } from 'antd'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword } from '@/features/auth/api/auth.api'
import { getApiErrorMessage } from '@/services/api/getApiErrorMessage'
import '@/features/auth/recovery.css'
import '@/features/auth/recovery-match.css'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()
  const submit = async ({ email }: { email: string }) => { setPending(true); setError(undefined); try { await forgotPassword(email); navigate('/reset-password') } catch (reason) { setError(getApiErrorMessage(reason)) } finally { setPending(false) } }
  return <main className="recovery-page"><div className="recovery-split">
    <section className="recovery-visual"><div><h1>Quên mật khẩu?</h1><p>TuteClass luôn sẵn sàng<br/>để giúp bạn.</p></div><img src="/assets/auth/forgotpassword-amico.png" alt="Khôi phục mật khẩu"/><div className="recovery-benefits"><div><MailOutlined/><span><b>Khôi phục nhanh chóng</b><small>Nhận hướng dẫn đặt lại mật khẩu qua email.</small></span></div><div><SafetyCertificateOutlined/><span><b>An toàn & bảo mật</b><small>Thông tin của bạn luôn được bảo vệ.</small></span></div><div><CustomerServiceOutlined/><span><b>Hỗ trợ khi bạn cần</b><small>Đội ngũ TuteClass luôn sẵn sàng hỗ trợ.</small></span></div></div></section>
    <section className="recovery-form"><Link to="/login"><ArrowLeftOutlined/> Quay lại đăng nhập</Link><div><h2>Quên mật khẩu</h2><p>Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.</p>{error&&<Alert type="error" showIcon message={error}/>}<Form onFinish={submit} layout="vertical"><Form.Item name="email" label="Email" rules={[{required:true},{type:'email'}]}><Input prefix={<MailOutlined/>} size="large" placeholder="Nhập email của bạn"/></Form.Item><Button type="primary" htmlType="submit" loading={pending} block size="large">Gửi hướng dẫn đặt lại mật khẩu</Button></Form><div className="recovery-divider"><span>hoặc</span></div><Link to="/login" className="recovery-google"><span>G</span> Tiếp tục với Google</Link><p className="recovery-login">Nhớ mật khẩu? <Link to="/login">Đăng nhập ngay</Link></p></div></section>
  </div></main>
}
