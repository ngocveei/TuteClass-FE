import { Link, useLocation } from 'react-router-dom'

export function PublicHeader() {
  const location = useLocation()
  const scroll = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') { event.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }
  }
  return <header className="public-nav"><div className="public-nav__inner">
    <Link to="/" className="public-brand"><img src="/assets/lam/logo-rmbg.png" alt="TuteClass" /></Link>
    <nav><a href="/#s-solution" onClick={scroll('s-solution')}>Tính năng</a><a href="/#s-showcase" onClick={scroll('s-showcase')}>Demo</a><a href="/#s-start" onClick={scroll('s-start')}>Bắt đầu</a></nav>
    <div><Link to="/login">Đăng nhập</Link><Link to="/register" className="public-nav__cta">Bắt đầu miễn phí</Link></div>
  </div></header>
}
