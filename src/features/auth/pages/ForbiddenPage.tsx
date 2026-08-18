import { SafetyCertificateOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";
import "@/features/auth/auth.css";

export default function ForbiddenPage() {
  return (
    <main className="legal-page">
      <section>
        <SafetyCertificateOutlined />
        <h1>Bạn không có quyền truy cập</h1>
        <p>Tài khoản hiện tại không được phép mở nội dung này.</p>
        <Link to="/">
          <Button type="primary">Về trang chủ</Button>
        </Link>
      </section>
    </main>
  );
}
