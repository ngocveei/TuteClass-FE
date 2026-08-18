import { Link } from "react-router-dom";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useRegister } from "@/features/auth/hooks/useRegister";
import "@/features/auth/auth.css";

export default function RegisterPage() {
  const auth = useRegister();
  return (
    <main className="auth-page">
      <div className="auth-card-split auth-card-split--register">
        <div className="auth-card-left">
          <div className="auth-left-content">
            <h1 className="auth-left-title">
              Chào mừng đến với<span>TuteClass!</span>
            </h1>
            <p className="auth-left-subtitle">
              Nền tảng quản lý và học tập thông minh cho giáo viên và học sinh.
            </p>
            <img
              src="/assets/auth/register-illustration.png"
              alt="Giáo viên và học sinh cùng học tập với thiết bị số"
              className="auth-left-illustration"
            />
            <div className="auth-left-grid">
              <Feature title="Quản lý lớp học dễ dàng" kind="cap" />
              <Feature title="Theo dõi tiến độ học tập" kind="graph" />
              <Feature title="An toàn & bảo mật" kind="shield" />
            </div>
          </div>
          <div className="auth-left-footer">
            Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link>
          </div>
        </div>
        <div className="auth-card-right">
          <Link to="/login" className="auth-back-link">
            ← Quay lại
          </Link>
          <h2 className="auth-right-title">Đăng ký tài khoản</h2>
          <p className="auth-right-subtitle">
            Vui lòng điền thông tin để tạo tài khoản.
          </p>
          <RegisterForm auth={auth} />
        </div>
      </div>
    </main>
  );
}

function Feature({
  title,
  kind,
}: {
  title: string;
  kind: "cap" | "graph" | "shield";
}) {
  const paths = {
    cap: (
      <>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </>
    ),
    graph: (
      <>
        <path d="M3 3v18h18" />
        <rect x="7" y="11" width="3" height="6" />
        <rect x="12" y="7" width="3" height="10" />
        <rect x="17" y="13" width="3" height="4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };
  return (
    <div className="auth-left-grid-item">
      <div className={`auth-left-grid-icon auth-left-grid-icon--${kind}`}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {paths[kind]}
        </svg>
      </div>
      <div className="auth-left-grid-text">{title}</div>
    </div>
  );
}
