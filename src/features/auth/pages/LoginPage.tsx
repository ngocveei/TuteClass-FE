import { Button, Card, Form, Input, Typography, message } from 'antd'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiClient } from '@/services/api/apiClient'
import { getApiErrorMessage } from '@/services/api/getApiErrorMessage'
import { setTokens } from '@/services/auth/tokenStorage'
import { ROUTES } from '@/shared/constants/routes'

interface LoginValues {
  email: string
  password: string
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
  user: { roleName: string }
}

export default function LoginPage() {
  const [isSubmitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = async (values: LoginValues) => {
    setSubmitting(true)
    try {
      const { data } = await apiClient.post<LoginResponse>('/api/auth/login', values)
      setTokens(data)
      const requestedPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
      const homeByRole: Record<string, string> = {
        Teacher: ROUTES.teacherClasses,
        Student: ROUTES.studentClasses,
        Admin: ROUTES.adminUsers,
      }
      navigate(requestedPath || homeByRole[data.user.roleName] || ROUTES.login, { replace: true })
    } catch (error) {
      message.error(getApiErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="auth-card">
      <Typography.Title level={2}>Đăng nhập</Typography.Title>
      <Form<LoginValues> layout="vertical" onFinish={handleLogin} disabled={isSubmitting}>
        <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
          <Input autoComplete="email" />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Đăng nhập</Button>
      </Form>
    </Card>
  )
}
