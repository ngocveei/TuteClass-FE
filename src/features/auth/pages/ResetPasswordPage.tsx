import {
  ArrowLeftOutlined,
  KeyOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { useResetPassword } from "@/features/auth/hooks/usePasswordRecovery";
import {
  validateConfirmPassword,
  validatePassword,
} from "@/shared/utils/passwordValidation";
import "@/features/auth/recovery.css";

interface Values {
  newPassword: string;
  confirmPassword: string;
}
const countdown = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export default function ResetPasswordPage() {
  const auth = useResetPassword();
  const canSubmit = Boolean(auth.pendingReset && auth.otpSecondsRemaining > 0);
  return (
    <main className="recovery-page">
      <section className="reset-card">
        <Link to="/login">
          <ArrowLeftOutlined /> Quay lại đăng nhập
        </Link>
        <div className="reset-head">
          <KeyOutlined />
          <h1>Tạo mật khẩu mới</h1>
          <p>Mật khẩu mới phải đáp ứng chính sách bảo mật của TuteClass.</p>
        </div>
        {auth.otpSecondsRemaining > 0 && !auth.success && (
          <Alert
            className="reset-countdown"
            type="info"
            showIcon
            message={`Mã OTP còn hiệu lực trong ${countdown(auth.otpSecondsRemaining)}.`}
          />
        )}
        {!auth.pendingReset && !auth.success && (
          <Alert
            type="warning"
            showIcon
            message="Bạn cần yêu cầu mã OTP trước khi đặt lại mật khẩu."
            action={
              <Link to="/forgot-password">
                <Button size="small">Yêu cầu mã</Button>
              </Link>
            }
          />
        )}
        {auth.success ? (
          <>
            <Alert
              type="success"
              showIcon
              message="Đặt lại mật khẩu thành công!"
            />
            <Link to="/login">
              <Button type="primary" block>
                Đăng nhập ngay
              </Button>
            </Link>
          </>
        ) : (
          <Form<Values>
            layout="vertical"
            onFinish={({ newPassword }) => void auth.submit(newPassword)}
          >
            {auth.notice && (
              <Alert type="success" showIcon message={auth.notice} />
            )}
            {auth.error && <Alert type="error" showIcon message={auth.error} />}
            <Form.Item label="Mã OTP (6 chữ số)" required>
              <div className="otp-grid">
                {auth.otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      auth.otpInputRefs.current[index] = element;
                    }}
                    className="otp-box"
                      inputMode="numeric"
                      maxLength={1}
                      disabled={!canSubmit}
                    value={digit}
                    onChange={(event) =>
                      auth.setDigit(index, event.target.value)
                    }
                    onPaste={(event) => {
                      event.preventDefault();
                      auth.pasteOtp(event.clipboardData.getData("text"));
                    }}
                  />
                ))}
              </div>
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                {
                  validator: (_, value) => {
                    const message = validatePassword(value);
                    return message
                      ? Promise.reject(new Error(message))
                      : Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mới"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={["newPassword"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator: (_, value) => {
                    const message = validateConfirmPassword(
                      getFieldValue("newPassword"),
                      value,
                    );
                    return message
                      ? Promise.reject(new Error(message))
                      : Promise.resolve();
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập lại mật khẩu mới"
              />
            </Form.Item>
            <div className="reset-actions">
              <Button
                loading={auth.isResending}
                disabled={!auth.pendingReset || auth.resendSecondsRemaining > 0}
                onClick={() => void auth.resend()}
              >
                {auth.resendSecondsRemaining > 0
                  ? `Gửi lại sau ${auth.resendSecondsRemaining}s`
                  : "Gửi lại mã"}
              </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={auth.isSubmitting}
                  disabled={!canSubmit}
              >
                Đặt lại mật khẩu
              </Button>
            </div>
          </Form>
        )}
      </section>
    </main>
  );
}
