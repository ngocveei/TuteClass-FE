import {
  ArrowLeftOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import {
  useChangePassword,
  type ChangePasswordValues,
} from "@/features/profile/hooks/useChangePassword";

interface ProfilePasswordViewProps {
  profilePath: string;
}

export function ProfilePasswordView({ profilePath }: ProfilePasswordViewProps) {
  const { form, error, pending, submit } = useChangePassword();

  return (
    <section className="password-view">
      <header>
        <div>
          <h2>Đổi mật khẩu</h2>
          <p>Cập nhật mật khẩu để bảo vệ tài khoản của bạn.</p>
        </div>
        <Link to={profilePath}>
          <ArrowLeftOutlined /> Quay lại
        </Link>
      </header>

      <div className="password-view-body">
        <aside>
          <div>
            <SafetyCertificateOutlined />
          </div>
          <span>••••••••</span>
          <p>
            Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và
            ký tự đặc biệt.
          </p>
        </aside>

        <Form<ChangePasswordValues>
          form={form}
          layout="vertical"
          onFinish={submit}
        >
          {error && <Alert type="error" showIcon message={error} />}
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại *"
            rules={[{ required: true }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới *"
            extra="Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
            rules={[
              { required: true },
              { min: 8 },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S+$/,
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới *"
            dependencies={["newPassword"]}
            rules={[
              ({ getFieldValue }) => ({
                validator: (_, value) =>
                  value === getFieldValue("newPassword")
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp."),
                      ),
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <footer>
            <Link to={profilePath}>
              <Button>Hủy</Button>
            </Link>
            <Button type="primary" htmlType="submit" loading={pending}>
              Lưu thay đổi
            </Button>
          </footer>
        </Form>
      </div>
    </section>
  );
}
