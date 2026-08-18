import { Link, useLocation } from "react-router-dom";
import "@/features/auth/auth.css";

export default function LegalPage() {
  const privacy = useLocation().pathname === "/privacy";
  return (
    <main className="legal-page">
      <section>
        <h1>{privacy ? "Chính sách bảo mật" : "Điều khoản sử dụng"}</h1>
        <p>Nội dung pháp lý chính thức sẽ được công bố tại đây.</p>
        <Link to="/register">Quay lại đăng ký</Link>
      </section>
    </main>
  );
}
