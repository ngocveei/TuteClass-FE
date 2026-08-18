import { MailOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input } from 'antd'
import { Link } from 'react-router-dom'
import { useCheckEmail } from '@/features/auth/hooks/useEmailVerification'
import { normalizeEmail, validateEmail } from '@/features/auth/utils/authValidation'
import '@/features/auth/auth.css'

export default function CheckEmailPage() {
  const flow = useCheckEmail()
  const [form] = Form.useForm<{ email: string }>()

  if (!flow.context) {
    return (
      <main className="auth-page">
        <section className="email-auth-card">
          <span className="email-auth-card__icon"><MailOutlined /></span>
          <h1>Gửi lại email xác minh</h1>
          <p>Nhập email đã đăng ký để nhận một liên kết xác minh mới.</p>
          {flow.error && <Alert type="error" showIcon message={flow.error} />}
          <Form
            form={form}
            layout="vertical"
            className="auth-form email-resend-form"
            onFinish={({ email }) => flow.requestForEmail(email)}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[{
                validator: (_, value) => {
                  const error = validateEmail(value)
                  return error ? Promise.reject(new Error(error)) : Promise.resolve()
                },
              }]}
            >
              <Input
                autoComplete="email"
                placeholder="Nhập email cần xác minh"
                onBlur={(event) => (
                  form.setFieldValue('email', normalizeEmail(event.target.value))
                )}
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={flow.pending}
              className="auth-btn-submit"
            >
              Gửi email xác minh
            </Button>
          </Form>
          <Link to="/login">Quay lại đăng nhập</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <section className="email-auth-card">
        <span className="email-auth-card__icon"><MailOutlined /></span>
        <h1>Kiểm tra email của bạn</h1>
        <p>
          Chúng tôi đã gửi liên kết xác minh đến <strong>{flow.context.email}</strong>.
        </p>
        {flow.notice && <Alert type="success" showIcon message={flow.notice} />}
        {flow.error && <Alert type="error" showIcon message={flow.error} />}
        <Button
          type="primary"
          block
          loading={flow.pending}
          disabled={flow.resendSeconds > 0}
          onClick={flow.resend}
        >
          {flow.resendSeconds > 0
            ? `Gửi lại sau ${flow.resendSeconds}s`
            : 'Gửi lại email xác minh'}
        </Button>
        <Link to="/login">Quay lại đăng nhập</Link>
      </section>
    </main>
  )
}
