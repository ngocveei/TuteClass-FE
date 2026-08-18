import { Alert, Button, Form, Input } from 'antd'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login } from '@/features/auth/api/auth.api'
import { AuthVisualPanel } from '@/features/auth/components/AuthVisualPanel'
import { GoogleAuthButton } from '@/features/auth/components/GoogleAuthButton'
import type { LoginRequest } from '@/features/auth/types/auth.types'
import type { RegistrationRole } from '@/features/auth/types/auth.types'
import { getApiErrorMessage } from '@/services/api/getApiErrorMessage'
import { ROUTES } from '@/shared/constants/routes'
import '@/features/auth/auth.css'
import '@/features/auth/auth-font.css'

export default function LoginViewPage() {
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)
  const [googleRole, setGoogleRole] = useState<RegistrationRole>('student')
  const navigate = useNavigate()
  const location = useLocation()

  const submit = async (values: LoginRequest) => {
    setPending(true); setError(undefined)
    try {
      const result = await login(values)
      const requested = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
      const home: Record<string, string> = { Teacher: ROUTES.teacherClasses, Student: ROUTES.studentClasses, Admin: ROUTES.adminUsers }
      navigate(requested || home[result.user.roleName] || '/', { replace: true })
    } catch (reason) { setError(getApiErrorMessage(reason)) } finally { setPending(false) }
  }

  return (
    <main className="auth-page-old">
      <div className="auth-split auth-split--login">
        <AuthVisualPanel mode="login" />
        <section className="auth-form-panel">
          <h2>Đăng nhập</h2><p>Vui lòng đăng nhập để truy cập tài khoản của bạn.</p>
          <Form<LoginRequest> layout="vertical" onFinish={submit} disabled={pending} requiredMark={false}>
            {error && <Alert type="error" showIcon message={error} />}
            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email là bắt buộc.' }, { type: 'email', message: 'Email không đúng định dạng.' }]}>
              <Input size="large" autoComplete="email" placeholder="Nhập email của bạn" />
            </Form.Item>
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Mật khẩu là bắt buộc.' }]}>
              <Input.Password size="large" autoComplete="current-password" placeholder="Nhập mật khẩu" />
            </Form.Item>
            <div className="auth-forgot"><Link to="/forgot-password">Quên mật khẩu?</Link></div>
            <Button type="primary" htmlType="submit" loading={pending} size="large" block>Đăng nhập</Button>
            <div className="auth-divider"><span>hoặc</span></div>
            <div className="google-role-label">Nếu đăng nhập Google lần đầu</div>
            <div className="google-roles">
              <button type="button" className={googleRole === 'student' ? 'active' : ''} onClick={() => setGoogleRole('student')}>Học sinh</button>
              <button type="button" className={googleRole === 'teacher' ? 'active' : ''} onClick={() => setGoogleRole('teacher')}>Giáo viên</button>
            </div>
            <GoogleAuthButton mode="login" role={googleRole} disabled={pending} onError={setError} />
          </Form>
        </section>
      </div>
    </main>
  )
}
