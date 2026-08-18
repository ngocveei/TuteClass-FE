import { Link } from 'react-router-dom'
import { BarChartOutlined, ReadOutlined, SafetyCertificateOutlined } from '@ant-design/icons'

export function AuthVisualPanel({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login'
  return (
    <section className="auth-visual">
      <div>
        <h1>{isLogin ? 'Chào mừng trở lại' : 'Chào mừng đến với'} <span>TuteClass!</span></h1>
        <p>{isLogin ? 'Đăng nhập để tiếp tục hành trình học tập hiệu quả cùng chúng tôi.' : 'Nền tảng quản lý và học tập thông minh cho giáo viên và học sinh.'}</p>
        <img src={isLogin ? '/assets/sticker/img9.png' : '/assets/auth/register-illustration.png'} alt="TuteClass learning" />
        <div className={isLogin ? 'auth-feature-list' : 'auth-feature-grid'}>
          <div><b><ReadOutlined /></b><span>Quản lý lớp học dễ dàng</span></div>
          <div><b><BarChartOutlined /></b><span>Theo dõi tiến độ học tập</span></div>
          <div><b><SafetyCertificateOutlined /></b><span>An toàn & bảo mật</span></div>
        </div>
      </div>
      <footer>{isLogin ? <>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></> : <>Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link></>}</footer>
    </section>
  )
}
