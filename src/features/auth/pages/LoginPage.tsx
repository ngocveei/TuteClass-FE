import { Link } from "react-router-dom";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useLogin } from "@/features/auth/hooks/useLogin";
import "@/features/auth/auth.css";

export default function LoginPage() {
  const auth = useLogin();
  return (
    <main className="auth-page">
      <div className="auth-card-split auth-card-split--login">
        <div className="auth-card-left">
          <div className="auth-left-content">
            <h1 className="auth-left-title">
              Chào mừng trở lại<span>TuteClass!</span>
            </h1>
            <p className="auth-left-subtitle">
              Đăng nhập để tiếp tục hành trình học tập hiệu quả cùng chúng tôi.
            </p>
            <img
              src="/assets/sticker/img9.png"
              alt="TuteClass Learning"
              className="auth-left-illustration"
            />
            <div className="auth-left-list">
              <Feature icon="cap" title="Quản lý dễ dàng">
                Theo dõi lịch học, bài tập và tiến độ học tập mọi lúc, mọi nơi.
              </Feature>
              <Feature icon="users" title="Kết nối hiệu quả">
                Trao đổi, thảo luận và tương tác dễ dàng với giáo viên và bạn
                học.
              </Feature>
              <Feature icon="shield" title="An toàn & bảo mật">
                Thông tin của bạn luôn được bảo vệ tuyệt đối.
              </Feature>
            </div>
          </div>
          <div className="auth-left-footer">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </div>
        </div>
        <div className="auth-card-right">
          <h2 className="auth-right-title">Đăng nhập</h2>
          <p className="auth-right-subtitle">
            Vui lòng đăng nhập để truy cập tài khoản của bạn.
          </p>
          <LoginForm auth={auth} />
        </div>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: "cap" | "users" | "shield";
  title: string;
  children: string;
}) {
  const paths = {
    cap: (
      <>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </>
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
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
    <div className="auth-left-list-item">
      <div className={`auth-left-list-icon auth-left-list-icon--${icon}`}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {paths[icon]}
        </svg>
      </div>
      <div>
        <div className="auth-left-list-title">{title}</div>
        <p className="auth-left-list-desc">{children}</p>
      </div>
    </div>
  );
}
