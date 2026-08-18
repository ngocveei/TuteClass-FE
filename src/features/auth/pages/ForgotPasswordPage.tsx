import {
  ArrowLeftOutlined,
  CustomerServiceOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { GoogleMark } from "@/features/auth/components/GoogleAuthButton";
import { useForgotPassword } from "@/features/auth/hooks/usePasswordRecovery";
import {
  normalizeEmail,
  validateEmail,
} from "@/features/auth/utils/authValidation";
import "@/features/auth/auth.css";
import "@/features/auth/recovery.css";

export default function ForgotPasswordPage() {
  const auth = useForgotPassword();
  const [form] = Form.useForm<{ email: string }>();
  return (
    <main className="auth-page">
      <div className="auth-card-split auth-card-split--forgot">
        <div className="auth-card-left">
          <div>
            <h1 className="auth-card-title">Quên mật khẩu?</h1>
            <p className="auth-card-sub">
              TuteClass luôn sẵn sàng
              <br />
              để giúp bạn.
            </p>
          </div>
          <div className="auth-illustration-wrap">
            <img
              src="/assets/auth/forgotpassword-amico.png"
              alt="Khôi phục mật khẩu"
              className="auth-illustration-img"
            />
          </div>
          <div className="auth-guarantee-pills">
            <Benefit
              icon={<MailOutlined />}
              tone="blue"
              title="Khôi phục nhanh chóng"
            >
              Nhận hướng dẫn đặt lại mật khẩu qua email của bạn.
            </Benefit>
            <Benefit
              icon={<SafetyCertificateOutlined />}
              tone="green"
              title="An toàn & bảo mật"
            >
              Chúng tôi đảm bảo thông tin của bạn được bảo vệ tuyệt đối.
            </Benefit>
            <Benefit
              icon={<CustomerServiceOutlined />}
              tone="sky"
              title="Hỗ trợ khi bạn cần"
            >
              Đội ngũ TuteClass luôn sẵn sàng hỗ trợ bạn.
            </Benefit>
          </div>
        </div>
        <div className="auth-card-right">
          <div className="auth-top-back">
            <Link to="/login" className="auth-back-link">
              <ArrowLeftOutlined /> Quay lại đăng nhập
            </Link>
          </div>
          <div className="auth-forgot-form-wrap">
            <div className="auth-form-head">
              <h2 className="auth-form-title">Quên mật khẩu</h2>
              <p className="auth-form-sub">
                Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
              </p>
            </div>
            {auth.error && <Alert type="error" showIcon message={auth.error} />}
            <Form
              form={form}
              layout="vertical"
              className="auth-form"
              onFinish={({ email }) => void auth.submit(email)}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    validator: (_, value) => {
                      const message = validateEmail(value);
                      return message
                        ? Promise.reject(new Error(message))
                        : Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  autoComplete="email"
                  placeholder="Nhập email của bạn"
                  onBlur={(event) =>
                    form.setFieldValue(
                      "email",
                      normalizeEmail(event.target.value),
                    )
                  }
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={auth.isSubmitting}
                className="auth-btn-submit"
              >
                Gửi hướng dẫn đặt lại mật khẩu
              </Button>
            </Form>
            <div className="auth-divider">hoặc</div>
            <Link to="/login" className="auth-btn-google">
              <GoogleMark />
              Tiếp tục với Google
            </Link>
            <p className="auth-footer-text">
              Nhớ mật khẩu?{" "}
              <Link to="/login" className="auth-switch-link">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Benefit({
  icon,
  tone,
  title,
  children,
}: {
  icon: React.ReactNode;
  tone: string;
  title: string;
  children: string;
}) {
  return (
    <div className="guarantee-pill-item">
      <div className={`pill-icon-circle ${tone}`}>{icon}</div>
      <div className="pill-text-wrap">
        <span className="pill-title">{title}</span>
        <span className="pill-sub">{children}</span>
      </div>
    </div>
  );
}
