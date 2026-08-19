import { UserOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { GoogleAuthButton } from "@/features/auth/components/GoogleAuthButton";
import type {
  RegisterFormValues,
  useRegister,
} from "@/features/auth/hooks/useRegister";
import { useGoogleAuth } from "@/features/auth/hooks/useGoogleAuth";
import {
  normalizeEmail,
  normalizeFullName,
  validateEmail,
  validateFullName,
} from "@/features/auth/utils/authValidation";
import {
  validateConfirmPassword,
  validatePassword,
} from "@/shared/utils/passwordValidation";

export function RegisterForm({
  auth,
}: {
  auth: ReturnType<typeof useRegister>;
}) {
  const [form] = Form.useForm<RegisterFormValues>();
  const googleDisabled = auth.isPending || !auth.termsAccepted;
  const google = useGoogleAuth({
    mode: "register",
    role: auth.selectedRole,
    disabled: googleDisabled,
    onError: auth.setExternalError,
  });
  return (
    <Form<RegisterFormValues>
      form={form}
      initialValues={{ termsAccepted: false }}
      onValuesChange={(changed) => {
        if ("termsAccepted" in changed)
          auth.setTermsAccepted(Boolean(changed.termsAccepted));
      }}
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
      <div
        className="auth-role-selector"
        role="radiogroup"
        aria-label="Vai trò"
      >
        {(["teacher", "student"] as const).map((role) => (
          <div
            key={role}
            tabIndex={0}
            role="radio"
            aria-checked={auth.selectedRole === role}
            className={`auth-role-card ${auth.selectedRole === role ? "auth-role-card--active" : ""}`}
            onClick={() => auth.setSelectedRole(role)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ")
                auth.setSelectedRole(role);
            }}
          >
            <div className="auth-role-card__left">
              <UserOutlined className="auth-role-card__icon" />
              <span>{role === "teacher" ? "Giáo viên" : "Học sinh"}</span>
            </div>
            <div className="auth-role-card__radio">
              {auth.selectedRole === role && (
                <div className="auth-role-card__radio-inner" />
              )}
            </div>
          </div>
        ))}
      </div>
      <Form.Item
        name="fullName"
        label="Họ và tên"
        rules={[
          {
            validator: (_, value) => {
              const message = validateFullName(value);
              return message
                ? Promise.reject(new Error(message))
                : Promise.resolve();
            },
          },
        ]}
      >
        <Input
          autoComplete="name"
          placeholder="Nhập họ và tên đầy đủ"
          onBlur={(event) =>
            form.setFieldValue(
              "fullName",
              normalizeFullName(event.target.value),
            )
          }
        />
      </Form.Item>
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
          autoComplete="email"
          placeholder="Nhập email của bạn"
          onBlur={(event) =>
            form.setFieldValue("email", normalizeEmail(event.target.value))
          }
        />
      </Form.Item>
      <Form.Item
        name="password"
        label="Mật khẩu"
        extra="8–100 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt; không dùng khoảng trắng."
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
          autoComplete="new-password"
          placeholder="Nhập mật khẩu"
        />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        label="Xác nhận mật khẩu"
        dependencies={["password"]}
        rules={[
          ({ getFieldValue }) => ({
            validator: (_, value) => {
              const message = validateConfirmPassword(
                getFieldValue("password"),
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
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu"
        />
      </Form.Item>
      <Form.Item
        name="termsAccepted"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(
                    new Error(
                      "Bạn cần đồng ý Điều khoản sử dụng và Chính sách bảo mật.",
                    ),
                  ),
          },
        ]}
      >
        <Checkbox>
          Tôi đồng ý với{" "}
          <Link to="/terms" target="_blank" className="terms-link">
            Điều khoản sử dụng
          </Link>{" "}
          và{" "}
          <Link to="/privacy" target="_blank" className="terms-link">
            Chính sách bảo mật
          </Link>{" "}
          của TuteClass.
        </Checkbox>
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        block
        loading={auth.isPending}
        className="auth-btn-submit"
      >
        Đăng ký
      </Button>
      <div className="auth-divider">hoặc</div>
      <GoogleAuthButton
        mode="register"
        disabled={googleDisabled}
        google={google}
      />
    </Form>
  );
}
