import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { useVerifyEmail } from "@/features/auth/hooks/useEmailVerification";
import "@/features/auth/auth.css";

export default function VerifyEmailPage() {
  const flow = useVerifyEmail();
  return (
    <main className="auth-page">
      <section className="email-auth-card">
        <span
          className={`email-auth-card__icon email-auth-card__icon--${flow.state}`}
        >
          {flow.state === "loading" ? (
            <LoadingOutlined spin />
          ) : flow.state === "success" ? (
            <CheckCircleOutlined />
          ) : (
            <CloseCircleOutlined />
          )}
        </span>
        <h1>
          {flow.state === "loading"
            ? "Đang xác minh email"
            : flow.state === "success"
              ? "Xác minh thành công!"
              : "Không thể xác minh email"}
        </h1>
        <p>
          {flow.state === "loading"
            ? "Vui lòng chờ trong giây lát."
            : flow.state === "success"
              ? "Tài khoản của bạn đã sẵn sàng để sử dụng."
              : flow.error}
        </p>
        {flow.state === "success" && (
          <Link to="/login">
            <Button type="primary" block>
              Đăng nhập ngay
            </Button>
          </Link>
        )}
        {flow.state === "error" && (
          <Link to="/register/check-email">
            <Button block>Yêu cầu liên kết mới</Button>
          </Link>
        )}
      </section>
    </main>
  );
}
