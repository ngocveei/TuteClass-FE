import { Alert, Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { GoogleAuthButton } from "@/features/auth/components/GoogleAuthButton";
import type { useLogin } from "@/features/auth/hooks/useLogin";
import { useGoogleAuth } from "@/features/auth/hooks/useGoogleAuth";
import type { LoginRequest } from "@/features/auth/types/auth.types";

export function LoginForm({ auth }: { auth: ReturnType<typeof useLogin> }) {
  const google = useGoogleAuth({
    mode: "login",
    role: auth.googleRole,
    disabled: auth.isPending,
    onError: auth.setExternalError,
  });

  return (
    <Form<LoginRequest>
      layout="vertical"
      onFinish={(values) => void auth.submit(values)}
      className="auth-form"
    >
      {auth.error && (
        <Alert
          type="error"
          showIcon
          message={auth.error}
          className="auth-form__alert"
        />
      )}
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Email là bắt buộc." },
          { type: "email", message: "Email không đúng định dạng." },
        ]}
      >
        <Input autoComplete="email" placeholder="Nhập email của bạn" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Mật khẩu"
        rules={[{ required: true, message: "Mật khẩu là bắt buộc." }]}
      >
        <Input.Password
          autoComplete="current-password"
          placeholder="Nhập mật khẩu"
        />
      </Form.Item>
      <div className="auth-form__row-between">
        <Link to="/forgot-password" className="auth-form__forgot-link">
          Quên mật khẩu?
        </Link>
      </div>
      <Button
        type="primary"
        htmlType="submit"
        block
        loading={auth.isPending}
        className="auth-btn-submit"
      >
        Đăng nhập
      </Button>
      <div className="auth-divider">hoặc</div>
      <div className="google-login-role">
        <span className="google-login-role__label">
          Nếu đăng nhập Google lần đầu
        </span>
        <div
          className="google-login-role__options"
          role="radiogroup"
          aria-label="Vai trò Google login lần đầu"
        >
          <button
            type="button"
            className={`google-login-role__option ${auth.googleRole === "student" ? "google-login-role__option--active" : ""}`}
            onClick={() => auth.setGoogleRole("student")}
          >
            Học sinh
          </button>
          <button
            type="button"
            className={`google-login-role__option ${auth.googleRole === "teacher" ? "google-login-role__option--active" : ""}`}
            onClick={() => auth.setGoogleRole("teacher")}
          >
            Giáo viên
          </button>
        </div>
      </div>
      <GoogleAuthButton
        mode="login"
        disabled={auth.isPending}
        google={google}
      />
    </Form>
  );
}
