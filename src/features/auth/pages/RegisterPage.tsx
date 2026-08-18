import { UserOutlined } from '@ant-design/icons'
import { Alert, Button, Checkbox, Form, Input } from 'antd'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '@/features/auth/api/auth.api'
import { AuthVisualPanel } from '@/features/auth/components/AuthVisualPanel'
import { GoogleAuthButton } from '@/features/auth/components/GoogleAuthButton'
import type { RegisterRequest, RegistrationRole } from '@/features/auth/types/auth.types'
import { getApiErrorMessage } from '@/services/api/getApiErrorMessage'
import '@/features/auth/auth.css'
import '@/features/auth/auth-font.css'
import '@/features/auth/register.css'

interface RegisterForm extends RegisterRequest { confirmPassword: string }

export default function RegisterPage() {
  const [role, setRole] = useState<RegistrationRole>('teacher')
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()

  const submit = async (values: RegisterForm) => {
    setPending(true); setError(undefined)
    try {
      const result = await register({ ...values, role })
      navigate('/login', { replace: true, state: { registeredEmail: result.email } })
    } catch (reason) { setError(getApiErrorMessage(reason)) } finally { setPending(false) }
  }

  return (
    <main className="auth-page-old">
      <div className="auth-split auth-split--register">
        <AuthVisualPanel mode="register" />
        <section className="auth-form-panel">
          <Link to="/login" className="auth-back">← Quay lại</Link>
          <h2>Đăng ký tài khoản</h2><p>Vui lòng điền thông tin để tạo tài khoản.</p>
          <Form<RegisterForm> layout="vertical" onFinish={submit} disabled={pending} requiredMark={false}>
            {error && <Alert type="error" showIcon message={error} />}
            <div className="auth-roles">
              {(['teacher', 'student'] as const).map((value) => <button type="button" key={value} className={role === value ? 'active' : ''} onClick={() => setRole(value)}><UserOutlined /> {value === 'teacher' ? 'Giáo viên' : 'Học sinh'} <i /></button>)}
            </div>
            <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, whitespace: true }, { min: 2 }, { max: 50 }]}><Input size="large" autoComplete="name" placeholder="Nhập họ và tên đầy đủ" /></Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}><Input size="large" autoComplete="email" placeholder="Nhập email của bạn" /></Form.Item>
            <Form.Item name="password" label="Mật khẩu" extra="8–100 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt." rules={[{ required: true }, { min: 8 }, { max: 100 }, { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S+$/, message: 'Mật khẩu chưa đáp ứng yêu cầu.' }]}><Input.Password size="large" autoComplete="new-password" /></Form.Item>
            <Form.Item name="confirmPassword" label="Xác nhận mật khẩu" dependencies={['password']} rules={[{ required: true }, ({ getFieldValue }) => ({ validator: (_, value) => !value || getFieldValue('password') === value ? Promise.resolve() : Promise.reject(new Error('Mật khẩu xác nhận không khớp.')) })]}><Input.Password size="large" autoComplete="new-password" /></Form.Item>
            <Form.Item name="termsAccepted" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Bạn cần đồng ý với điều khoản sử dụng.')) }]}><Checkbox>Tôi đồng ý với <a href="#terms">Điều khoản sử dụng</a> và <a href="#privacy">Chính sách bảo mật</a>.</Checkbox></Form.Item>
            <Button type="primary" htmlType="submit" loading={pending} size="large" block>Đăng ký</Button>
            <div className="auth-divider"><span>hoặc</span></div>
            <GoogleAuthButton mode="register" role={role} disabled={pending} onError={setError} />
          </Form>
        </section>
      </div>
    </main>
  )
}
