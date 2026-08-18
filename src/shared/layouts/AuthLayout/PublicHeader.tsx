import { Link, useLocation } from 'react-router-dom'
import '@/shared/layouts/AuthLayout/public-header.css'

export function PublicHeader() {
  const location = useLocation()

  const scrollToSection = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname !== '/') return

    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="public-nav">
      <div className="public-nav__inner">
        <Link to="/" className="public-brand">
          <img src="/assets/lam/logo-rmbg.png" alt="TuteClass" />
        </Link>
        <nav>
          <a href="/#s-solution" onClick={scrollToSection('s-solution')}>
            Tính năng
          </a>
          <a href="/#s-showcase" onClick={scrollToSection('s-showcase')}>
            Demo
          </a>
          <a href="/#s-start" onClick={scrollToSection('s-start')}>
            Bắt đầu
          </a>
        </nav>
        <div>
          <Link to="/login">Đăng nhập</Link>
          <Link to="/register" className="public-nav__cta">
            Bắt đầu miễn phí
          </Link>
        </div>
      </div>
    </header>
  )
}
