import { Link } from 'react-router-dom';
import type { LandingFlowController } from '../types/landing.types';
import { HeroSection, PainSection, ShowcaseSection, SolutionSection, StartSection } from './LandingSections';
import './LandingScreen.css';

export function LandingScreen({ flow }: { flow: LandingFlowController }) {
  const {
    activeSection, showcaseRole, showcaseTab, startRole, snapRootRef, railItems,
    scrollToSection, setShowcaseRole, setShowcaseTab, setStartRole,
  } = flow;

  return (
    <div style={{ height: 'calc(100vh - 69px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* SIDE RAIL */}
      <aside className="side-rail" aria-label="Điều hướng trang">
        {railItems.map((item) => (
          <button
            key={item.id}
            className={`side-rail-item ${activeSection === item.id ? 'active' : ''}`}
            type="button"
            onClick={() => scrollToSection(item.id)}
            aria-label={item.label}
          >
            <span className="side-rail-label">{item.label}</span>
            <span className="side-rail-bar" aria-hidden="true"></span>
          </button>
        ))}
      </aside>

      <main className="snap-root" id="snapRoot" ref={snapRootRef}>
        {/* SECTION 1 — HERO */}
        <HeroSection>
          <div className="hero-shell">
            <img className="lam-decor lam-decor--1" src="/assets/sticker/img3.png" alt="" aria-hidden="true" />
            <img className="lam-decor lam-decor--2" src="/assets/sticker/img9.png" alt="" aria-hidden="true" />

            <div className="hero-grid">
              <div className="hero-copy">
                <div className="hero-badge-row lam-rise lam-rise-d1">
                  <div className="hero-badge">✦ Dành riêng cho giáo viên dạy thêm</div>
                  <img className="hero-badge-sticker float-soft" src="/assets/sticker/img1.png" alt="" aria-hidden="true" style={{ animationDelay: '0.5s' }} />
                </div>
                <h1 className="lam-rise lam-rise-d2">
                  <span className="lam-line">Dạy dễ dàng.</span>
                  <span className="lam-gradient">Quản lý thông minh.</span>
                </h1>
                <p className="hero-lead lam-rise lam-rise-d3">Tất cả công cụ bạn cần để quản lý lớp học, giao dạy hiệu quả và nâng cao kết quả học tập.</p>
                <div className="hero-cta lam-rise lam-rise-d4">
                  <Link to="/register" className="btn btn-primary">
                    Bắt đầu miễn phí
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </Link>
                  <button type="button" className="btn btn-ghost" onClick={() => scrollToSection('s-showcase')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4V8z"/></svg>
                    Xem demo
                  </button>
                </div>
                <div className="hero-trust lam-rise lam-rise-d5">
                  <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg> Miễn phí 14 ngày</span>
                  <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg> Không cần thẻ tín dụng</span>
                  <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11h3a2 2 0 0 0 2-2V6a2 2 0 0 1 2-2h3"/><path d="M21 11h-3a2 2 0 0 1-2-2V6a2 2 0 0 0-2-2h-3"/><path d="M7 21v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/></svg> Hỗ trợ mọi lúc</span>
                </div>
                <img className="hero-sticker-bottom lam-rise lam-rise-d6" src="/assets/sticker/img2.png" alt="" aria-hidden="true" />
              </div>

              <div className="lam-orbit-wrap lam-rise lam-rise-d2">
                <div className="lam-orbit" aria-hidden="true">
                  <div className="lam-orbit-glow"></div>
                  <div className="lam-orbit-ring"></div>
                  <svg className="lam-orbit-svg" viewBox="0 0 680 600" fill="none" aria-hidden="true">
                    <g className="orbit-layer-slow">
                      <circle cx="340" cy="300" r="245" stroke="#ff8a3d" strokeWidth="1.4" opacity="0.52"/>
                      <circle className="orbit-dash" cx="340" cy="300" r="245" stroke="#ff5c00" strokeWidth="1.3" opacity="0.46"/>
                      <ellipse cx="340" cy="300" rx="245" ry="150" stroke="#0b2f66" strokeWidth="1.1" opacity="0.24"/>
                      <circle className="orbit-glow-dot" cx="585" cy="300" r="7" fill="#ff5c00"/>
                      <circle className="orbit-glow-dot" cx="340" cy="55" r="5" fill="#0b2f66"/>
                      <circle className="orbit-glow-dot" cx="128" cy="423" r="4" fill="#ffb15f"/>
                    </g>
                    <g className="orbit-layer-fast">
                      <ellipse className="orbit-dash" cx="340" cy="300" rx="150" ry="245" stroke="#0b2f66" strokeWidth="1.1" opacity="0.3"/>
                      <circle className="orbit-glow-dot" cx="340" cy="545" r="5" fill="#ff5c00"/>
                      <circle className="orbit-glow-dot" cx="552" cy="178" r="6" fill="#0b2f66"/>
                    </g>
                  </svg>

                  <div className="lam-orbit-core-wrap">
                    <div className="lam-orbit-core">
                      <span className="lam-orbit-core-glow"></span>
                      <span className="orbit-core-sparkle orbit-core-sparkle--1"><svg viewBox="0 0 24 24"><path d="M12 1.8L14.8 9.2L22.2 12L14.8 14.8L12 22.2L9.2 14.8L1.8 12L9.2 9.2L12 1.8Z"/></svg></span>
                      <span className="orbit-core-sparkle orbit-core-sparkle--2"><svg viewBox="0 0 24 24"><path d="M12 1.8L14.8 9.2L22.2 12L14.8 14.8L12 22.2L9.2 14.8L1.8 12L9.2 9.2L12 1.8Z"/></svg></span>
                      <span className="orbit-core-sparkle orbit-core-sparkle--3"><svg viewBox="0 0 24 24"><path d="M12 1.8L14.8 9.2L22.2 12L14.8 14.8L12 22.2L9.2 14.8L1.8 12L9.2 9.2L12 1.8Z"/></svg></span>
                      <span className="orbit-core-sparkle orbit-core-sparkle--4"><svg viewBox="0 0 24 24"><path d="M12 1.8L14.8 9.2L22.2 12L14.8 14.8L12 22.2L9.2 14.8L1.8 12L9.2 9.2L12 1.8Z"/></svg></span>
                      <span className="orbit-core-sparkle orbit-core-sparkle--5"><svg viewBox="0 0 24 24"><path d="M12 1.8L14.8 9.2L22.2 12L14.8 14.8L12 22.2L9.2 14.8L1.8 12L9.2 9.2L12 1.8Z"/></svg></span>
                      <span className="orbit-core-sparkle orbit-core-sparkle--6"><svg viewBox="0 0 24 24"><path d="M12 1.8L14.8 9.2L22.2 12L14.8 14.8L12 22.2L9.2 14.8L1.8 12L9.2 9.2L12 1.8Z"/></svg></span>
                      <span className="book-spine-glow"></span>
                      <img src="/assets/lam/orbit-core.png" alt="" />
                    </div>
                  </div>

                  <div className="lam-orbit-satellite"><div className="lam-orbit-satellite-dot"></div></div>

                  <div className="lam-orbit-node-pos lam-orbit-node-pos--1">
                    <div className="lam-orbit-node-wrap">
                      <div className="lam-orbit-node" style={{ animationDelay: '0s' }}>
                        <div className="lam-node-halo" style={{ background: '#ff5c00' }}></div>
                        <div className="lam-node-ring" style={{ background: 'conic-gradient(from 0deg, transparent, #ff5c00, transparent 35%, transparent 100%)' }}><div className="lam-node-ring-inner"></div></div>
                        <span className="lam-node-status" style={{ background: '#ff5c00', boxShadow: '0 0 18px #ff5c00' }}></span>
                        <div className="lam-node-icon" style={{ background: 'linear-gradient(135deg,#ff5c00,#ff5c00cc)', boxShadow: '0 14px 34px rgba(255,92,0,.27)' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></div>
                        <span className="lam-node-label">Lịch học</span>
                        <span className="lam-node-caption">Quản lý lịch học</span>
                      </div>
                    </div>
                  </div>
                  <div className="lam-orbit-node-pos lam-orbit-node-pos--2">
                    <div className="lam-orbit-node-wrap">
                      <div className="lam-orbit-node" style={{ animationDelay: '0.4s' }}>
                        <div className="lam-node-halo" style={{ background: '#8b5cf6' }}></div>
                        <div className="lam-node-ring" style={{ background: 'conic-gradient(from 0deg, transparent, #8b5cf6, transparent 35%, transparent 100%)' }}><div className="lam-node-ring-inner"></div></div>
                        <span className="lam-node-status" style={{ background: '#8b5cf6', boxShadow: '0 0 18px #8b5cf6' }}></span>
                        <div className="lam-node-icon" style={{ background: 'linear-gradient(135deg,#8b5cf6,#8b5cf6cc)', boxShadow: '0 14px 34px rgba(139,92,246,.27)' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/></svg></div>
                        <span className="lam-node-label">Tiến độ</span>
                        <span className="lam-node-caption">Theo dõi kết quả</span>
                      </div>
                    </div>
                  </div>
                  <div className="lam-orbit-node-pos lam-orbit-node-pos--3">
                    <div className="lam-orbit-node-wrap">
                      <div className="lam-orbit-node" style={{ animationDelay: '0.8s' }}>
                        <div className="lam-node-halo" style={{ background: '#2f7cff' }}></div>
                        <div className="lam-node-ring" style={{ background: 'conic-gradient(from 0deg, transparent, #2f7cff, transparent 35%, transparent 100%)' }}><div className="lam-node-ring-inner"></div></div>
                        <span className="lam-node-status" style={{ background: '#2f7cff', boxShadow: '0 0 18px #2f7cff' }}></span>
                        <div className="lam-node-icon" style={{ background: 'linear-gradient(135deg,#2f7cff,#2f7cffcc)', boxShadow: '0 14px 34px rgba(47,124,255,.27)' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                        <span className="lam-node-label">Lớp học</span>
                        <span className="lam-node-caption">Quản lý học sinh</span>
                      </div>
                    </div>
                  </div>
                  <div className="lam-orbit-node-pos lam-orbit-node-pos--4">
                    <div className="lam-orbit-node-wrap">
                      <div className="lam-orbit-node" style={{ animationDelay: '1.2s' }}>
                        <div className="lam-node-halo" style={{ background: '#20a66a' }}></div>
                        <div className="lam-node-ring" style={{ background: 'conic-gradient(from 0deg, transparent, #20a66a, transparent 35%, transparent 100%)' }}><div className="lam-node-ring-inner"></div></div>
                        <span className="lam-node-status" style={{ background: '#20a66a', boxShadow: '0 0 18px #20a66a' }}></span>
                        <div className="lam-node-icon" style={{ background: 'linear-gradient(135deg,#20a66a,#20a66acc)', boxShadow: '0 14px 34px rgba(32,166,106,.27)' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                        <span className="lam-node-label">Trao đổi</span>
                        <span className="lam-node-caption">Kết nối tức thì</span>
                      </div>
                    </div>
                  </div>
                  <div className="lam-orbit-node-pos lam-orbit-node-pos--5">
                    <div className="lam-orbit-node-wrap">
                      <div className="lam-orbit-node" style={{ animationDelay: '1.6s' }}>
                        <div className="lam-node-halo" style={{ background: '#f59e0b' }}></div>
                        <div className="lam-node-ring" style={{ background: 'conic-gradient(from 0deg, transparent, #f59e0b, transparent 35%, transparent 100%)' }}><div className="lam-node-ring-inner"></div></div>
                        <span className="lam-node-status" style={{ background: '#f59e0b', boxShadow: '0 0 18px #f59e0b' }}></span>
                        <div className="lam-node-icon" style={{ background: 'linear-gradient(135deg,#f59e0b,#f59e0bcc)', boxShadow: '0 14px 34px rgba(245,158,11,.27)' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></div>
                        <span className="lam-node-label">Bài tập</span>
                        <span className="lam-node-caption">Tạo và giao bài</span>
                      </div>
                    </div>
                  </div>
                  <div className="lam-orbit-node-pos lam-orbit-node-pos--6">
                    <div className="lam-orbit-node-wrap">
                      <div className="lam-orbit-node" style={{ animationDelay: '2s' }}>
                        <div className="lam-node-halo" style={{ background: '#ec4899' }}></div>
                        <div className="lam-node-ring" style={{ background: 'conic-gradient(from 0deg, transparent, #ec4899, transparent 35%, transparent 100%)' }}><div className="lam-node-ring-inner"></div></div>
                        <span className="lam-node-status" style={{ background: '#ec4899', boxShadow: '0 0 18px #ec4899' }}></span>
                        <div className="lam-node-icon" style={{ background: 'linear-gradient(135deg,#ec4899,#ec4899cc)', boxShadow: '0 14px 34px rgba(236,72,153,.27)' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4 10-10"/></svg></div>
                        <span className="lam-node-label">Chấm bài</span>
                        <span className="lam-node-caption">Nhận xét rõ ràng</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </HeroSection>

        {/* SECTION 2 — PAIN POINTS */}
        <PainSection>
          <div className="pain-wrap">
            <header className="pain-head reveal">
              <h2>Quản lý lớp học theo cách cũ <span className="pain-accent">khiến bạn tốn quá nhiều thời gian</span></h2>
            </header>

            <img
              className="pain-visual reveal reveal-d1"
              src="/Problem.png"
              alt="Giáo viên phải dùng nhiều công cụ rời rạc"
              width="1200"
              height="700"
              loading="lazy"
            />
          </div>
        </PainSection>

        {/* SECTION 3 — SOLUTION */}
        <SolutionSection>
          <div className="solution-wrap">
            <header className="solution-head reveal">
              <h2>Một nền tảng <span className="hl">duy nhất</span>,<br />giải quyết <span className="hl">toàn bộ</span> việc quản lý lớp học</h2>
            </header>

            <div className="solution-grid reveal reveal-d1">
              <article className="sol-card sol-card--green">
                <div className="sol-card-head">
                  <div className="sol-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div>
                    <h3>Quản lý lớp học</h3>
                    <p>Lịch học, điểm danh, học phí và thông tin học sinh</p>
                  </div>
                </div>
                <div className="sol-card-preview">
                  <video
                    src="/demos/solution-calendar.mp4"
                    poster="/Solution_Calendar.png"
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label="Demo lịch dạy và điểm danh — TuteClass"
                  ></video>
                </div>
              </article>

              <article className="sol-card sol-card--blue">
                <div className="sol-card-head">
                  <div className="sol-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                  </div>
                  <div>
                    <h3>Quản lý học tập</h3>
                    <p>Giao bài, chấm điểm và theo dõi tiến độ</p>
                  </div>
                </div>
                <div className="sol-card-preview">
                  <video
                    src="/demos/solution-learning.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label="Demo quản lý bài tập và chấm điểm — TuteClass"
                  ></video>
                </div>
              </article>

              <article className="sol-card sol-card--purple">
                <div className="sol-card-head">
                  <div className="sol-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8V5"/><circle cx="9" cy="14" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/><path d="M9 5h6"/></svg>
                  </div>
                  <div>
                    <h3>AI Teaching Assistant</h3>
                    <p>Trợ lý AI hỗ trợ giáo viên dạy học mọi lúc mọi nơi</p>
                  </div>
                </div>
                <div className="sol-card-preview">
                  <video
                    src="/demos/solution-ai.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label="Demo AI Teaching Assistant — TuteClass"
                  ></video>
                </div>
              </article>
            </div>

            <div className="solution-benefits reveal reveal-d2">
              <div className="sol-benefit">
                <div className="sol-ben-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div>
                <div className="sol-ben-text"><span className="sol-ben-top">Tiết kiệm 70% thời gian</span></div>
              </div>
              <div className="sol-benefit">
                <div className="sol-ben-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></div>
                <div className="sol-ben-text"><span className="sol-ben-top">Dữ liệu an toàn</span></div>
              </div>
              <div className="sol-benefit">
                <div className="sol-ben-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 18v-4M8 18V8M12 18v-2M16 18V4M20 18v-6"/><path d="M20 6l2-2"/></svg></div>
                <div className="sol-ben-text"><span className="sol-ben-top">Nâng cao hiệu quả</span></div>
              </div>
              <div className="sol-benefit">
                <div className="sol-ben-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
                <div className="sol-ben-text"><span className="sol-ben-top">Gắn kết dễ dàng</span></div>
              </div>
            </div>
          </div>
        </SolutionSection>

        {/* SECTION 4 — SHOWCASE */}
        <ShowcaseSection>
          <div className="container showcase-wrap">
            <div className="showcase-head">
              <h2 className="section-title reveal">Xem TuteClass hoạt động</h2>

              <div className="show-toolbar reveal reveal-d1">
                <div className="show-role-toggle" role="tablist" aria-label="Vai trò">
                  <button
                    type="button"
                    className={`show-role-btn ${showcaseRole === 'teacher' ? 'active' : ''}`}
                    onClick={() => setShowcaseRole('teacher')}
                  >
                    Giáo viên
                  </button>
                  <button
                    type="button"
                    className={`show-role-btn ${showcaseRole === 'student' ? 'active' : ''}`}
                    onClick={() => setShowcaseRole('student')}
                  >
                    Học sinh
                  </button>
                </div>
                <div className="show-tabs" role="tablist" aria-label="Tính năng">
                  {(['overview', 'schedule', 'assignment', 'documents', 'discussion'] as const).map((tabKey) => (
                    <button
                      key={tabKey}
                      type="button"
                      className={`show-tab ${showcaseTab === tabKey ? 'active' : ''}`}
                      onClick={() => setShowcaseTab(tabKey)}
                      role="tab"
                    >
                      {tabKey === 'overview' && 'Tổng quan'}
                      {tabKey === 'schedule' && 'Lịch'}
                      {tabKey === 'assignment' && 'Bài tập'}
                      {tabKey === 'documents' && 'Tài liệu'}
                      {tabKey === 'discussion' && 'Trao đổi'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="showcase-body">
              {/* Tab: Tổng quan */}
              {showcaseTab === 'overview' && (
                <div className="show-panel active reveal reveal-d2">
                  {showcaseRole === 'teacher' ? (
                    <div className="show-role-panel active">
                      <div className="show-visual">
                        <img src="/teacher-overview-demo-lam-style.png" alt="Tổng quan lớp — TuteClass" />
                      </div>
                      <div className="show-copy">
                        <h3>Tổng quan lớp học theo thời gian thực</h3>
                        <ul className="show-list">
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Chuyên cần học sinh</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Tình trạng học phí</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Bài cần chấm</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Tiến độ học tập</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="show-role-panel active">
                      <div className="show-visual">
                        <div className="stu-card">
                          <b>Toán 9A · Buổi tiếp theo: Thứ 5, 14:00</b>
                          <small>Chương 4 — Phương trình bậc hai</small>
                          <div className="stu-progress"><i style={{ width: '72%' }}></i></div>
                        </div>
                        <div className="stu-card">
                          <b>Bài tập tuần 18</b>
                          <small>Hạn nộp: 22/06 · Chưa nộp</small>
                          <div className="stu-progress"><i style={{ width: '0%' }}></i></div>
                        </div>
                        <div className="stu-card">
                          <b>Điểm kiểm tra chương 3</b>
                          <small>8.5/10 · Nhận xét: Tốt, cần luyện thêm hình học</small>
                          <div className="stu-progress"><i style={{ width: '85%' }}></i></div>
                        </div>
                      </div>
                      <div className="show-copy">
                        <h3>Tổng quan học tập cá nhân</h3>
                        <ul className="show-list">
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Lịch học sắp tới</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Bài tập cần nộp</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Điểm & nhận xét mới</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Tiến độ từng môn</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Lịch */}
              {showcaseTab === 'schedule' && (
                <div className="show-panel active reveal reveal-d2">
                  {showcaseRole === 'teacher' ? (
                    <div className="show-role-panel active">
                      <div className="show-visual">
                        <div className="cal-head"><b>Tháng 6, 2025</b><small style={{ color: 'var(--muted)' }}>Tuần 25</small></div>
                        <div className="cal-grid">
                          <div className="cal-day">T2</div><div className="cal-day">T3</div><div className="cal-day">T4</div>
                          <div className="cal-day event">5</div><div className="cal-day">6</div><div className="cal-day warn">7</div><div className="cal-day">8</div>
                          <div className="cal-day">9</div><div className="cal-day event">10</div><div className="cal-day">11</div>
                          <div className="cal-day">12</div><div className="cal-day today">13</div><div className="cal-day event">14</div>
                          <div className="cal-day">15</div><div className="cal-day">16</div><div className="cal-day warn">17</div><div className="cal-day">18</div>
                          <div className="cal-day event">19</div><div className="cal-day">20</div><div className="cal-day">21</div>
                        </div>
                      </div>
                      <div className="show-copy">
                        <h3>Quản lý lịch dạy trực quan</h3>
                        <ul className="show-list">
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Lịch tuần & lịch tháng</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Phát hiện xung đột tự động</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Nhắc lịch trước buổi dạy</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Quản lý nhiều lớp cùng lúc</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="show-role-panel active">
                      <div className="show-visual">
                        <div className="cal-head"><b>Tuần này</b><small style={{ color: 'var(--muted)' }}>3 buổi học</small></div>
                        <div className="assign-item done"><span className="chk"></span><div><b>Thứ 3 · Toán 9A</b><small>08:00 – 10:00 · Phòng A2</small></div><span className="assign-tag" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>Sắp tới</span></div>
                        <div className="assign-item"><span className="chk"></span><div><b>Thứ 5 · Toán 9A</b><small>14:00 – 16:00 · Chương 4</small></div><span className="assign-tag" style={{ background: 'var(--blue-bg)', color: 'var(--blue)' }}>Đã xếp lịch</span></div>
                        <div className="assign-item"><span className="chk"></span><div><b>Thứ 7 · Ôn tập</b><small>09:00 – 11:00 · Kiểm tra giữa kỳ</small></div><span className="assign-tag" style={{ background: 'var(--amber-bg)', color: 'var(--amber)' }}>Lưu ý</span></div>
                      </div>
                      <div className="show-copy">
                        <h3>Lịch học cá nhân</h3>
                        <ul className="show-list">
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Xem lịch theo tuần</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Nhắc buổi học sắp tới</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Theo dõi nhiều lớp</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Không bỏ lỡ buổi học</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Bài tập */}
              {showcaseTab === 'assignment' && (
                <div className="show-panel active reveal reveal-d2">
                  {showcaseRole === 'teacher' ? (
                    <div className="show-role-panel active">
                      <div className="show-visual">
                        <div className="assign-item done"><span className="chk"></span><div><b>Bài tập chương 3 — Đại số</b><small>28/30 học sinh đã nộp</small></div><span className="assign-tag" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>Đã chấm</span></div>
                        <div className="assign-item"><span className="chk"></span><div><b>Kiểm tra 15 phút — Hình học</b><small>Hạn: Thứ 6, 20/06</small></div><span className="assign-tag" style={{ background: 'var(--amber-bg)', color: 'var(--amber)' }}>Chờ nộp</span></div>
                        <div className="assign-item"><span className="chk"></span><div><b>Bài luyện tập — Phương trình</b><small>12 học sinh chưa nộp</small></div><span className="assign-tag" style={{ background: 'var(--rose-bg)', color: 'var(--rose)' }}>Quá hạn</span></div>
                      </div>
                      <div className="show-copy">
                        <h3>Giao bài và chấm điểm dễ dàng</h3>
                        <ul className="show-list">
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Giao bài cho cả lớp</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Theo dõi tình trạng nộp bài</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Chấm điểm & phản hồi</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Quản lý deadline</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="show-role-panel active">
                      <div className="show-visual">
                        <div className="assign-item"><span className="chk"></span><div><b>Bài tập tuần 18 — Đại số</b><small>Hạn nộp: 22/06 · Chưa nộp</small></div><span className="assign-tag" style={{ background: 'var(--amber-bg)', color: 'var(--amber)' }}>Cần làm</span></div>
                        <div className="assign-item done"><span className="chk"></span><div><b>Kiểm tra 15 phút chương 2</b><small>Đã nộp · Điểm: 8.0</small></div><span className="assign-tag" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>Đã chấm</span></div>
                        <div className="assign-item done"><span className="chk"></span><div><b>Luyện tập phương trình</b><small>Đã nộp · Chờ chấm</small></div><span className="assign-tag" style={{ background: 'var(--blue-bg)', color: 'var(--blue)' }}>Đã nộp</span></div>
                      </div>
                      <div className="show-copy">
                        <h3>Nộp bài và nhận kết quả</h3>
                        <ul className="show-list">
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Nộp bài online</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Xem hạn nộp rõ ràng</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Nhận điểm & nhận xét</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Ôn lại bài đã làm</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Tài liệu */}
              {showcaseTab === 'documents' && (
                <div className="show-panel active reveal reveal-d2">
                  {showcaseRole === 'teacher' ? (
                    <div className="show-role-panel active">
                      <div className="show-visual">
                        <div className="doc-item"><span className="doc-ic" style={{ background: 'var(--amber-bg)' }}>📁</span><div><b>Chương 4 — Phương trình</b><small>12 tài liệu · Cập nhật 2 ngày trước</small></div></div>
                        <div className="doc-item"><span className="doc-ic" style={{ background: 'var(--blue-bg)' }}>📄</span><div><b>Đề kiểm tra giữa kỳ.pdf</b><small>Toán 9A · 2.4 MB</small></div></div>
                        <div className="doc-item"><span className="doc-ic" style={{ background: 'var(--green-bg)' }}>📊</span><div><b>Bảng điểm tháng 6.xlsx</b><small>Dùng nội bộ · 540 KB</small></div></div>
                      </div>
                      <div className="show-copy">
                        <h3>Kho tài liệu tập trung</h3>
                        <ul className="show-list">
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Tổ chức theo lớp & chương</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Chia sẻ cho học sinh</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Không còn file rải rác</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Dễ tìm & cập nhật</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="show-role-panel active">
                      <div className="show-visual">
                        <div className="doc-item"><span className="doc-ic" style={{ background: 'var(--blue-bg)' }}>📄</span><div><b>Bài giảng chương 4.pdf</b><small>Giáo viên gửi · Hôm qua</small></div></div>
                        <div className="doc-item"><span className="doc-ic" style={{ background: 'var(--green-bg)' }}>📝</span><div><b>Đề luyện tập tuần 18</b><small>Toán 9A · DOCX</small></div></div>
                        <div className="doc-item"><span className="doc-ic" style={{ background: 'var(--violet-bg)' }}>📎</span><div><b>Video ôn tập chương 3</b><small>Link bài giảng · 18 phút</small></div></div>
                      </div>
                      <div className="show-copy">
                        <h3>Tài liệu học tập luôn sẵn sàng</h3>
                        <ul className="show-list">
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Nhận tài liệu từ giáo viên</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Tải về & xem lại</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Phân loại theo môn</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Không bỏ sót bài giảng</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Trao đổi */}
              {showcaseTab === 'discussion' && (
                <div className="show-panel active reveal reveal-d2">
                  {showcaseRole === 'teacher' ? (
                    <div className="show-role-panel active">
                      <div className="show-visual">
                        <div className="disc-thread">
                          <b>Hỏi bài chương 4 — Phương trình bậc hai</b>
                          <p>Em chưa hiểu cách dùng delta để xét nghiệm, thầy/cô giải thích giúp ạ?</p>
                          <div className="disc-meta"><span className="disc-tag">Toán 9A</span><span>Minh Anh · 3 phản hồi</span><span>Chưa trả lời</span></div>
                        </div>
                        <div className="disc-thread">
                          <b>Thông báo lịch kiểm tra giữa kỳ</b>
                          <p>Đã ghim trong nhóm lớp. Học sinh vui lòng xác nhận đã đọc.</p>
                          <div className="disc-meta"><span className="disc-tag">Đã ghim</span><span>28/30 đã xem</span></div>
                        </div>
                      </div>
                      <div className="show-copy">
                        <h3>Trao đổi & hỏi đáp tập trung</h3>
                        <ul className="show-list">
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Thảo luận theo lớp</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Không bỏ sót câu hỏi</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Ghim thông báo quan trọng</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Thay thế chat rời rạc</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="show-role-panel active">
                      <div className="show-visual">
                        <div className="disc-thread">
                          <b>Câu hỏi của bạn</b>
                          <p>Làm sao để nhận biết phương trình vô nghiệm khi a ≠ 0?</p>
                          <div className="disc-meta"><span className="disc-tag">Đã gửi</span><span>Chờ giáo viên trả lời</span></div>
                        </div>
                        <div className="disc-thread">
                          <b>Phản hồi từ giáo viên</b>
                          <p>Khi Δ &lt; 0 thì phương trình vô nghiệm. Em xem lại ví dụ 3 ở bài giảng nhé.</p>
                          <div className="disc-meta"><span className="disc-tag" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>Đã trả lời</span><span>10 phút trước</span></div>
                        </div>
                      </div>
                      <div className="show-copy">
                        <h3>Hỏi bài và trao đổi dễ dàng</h3>
                        <ul className="show-list">
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Đặt câu hỏi trong lớp</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Nhận phản hồi từ giáo viên</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Xem thông báo đã ghim</li>
                          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Lịch sử trao đổi rõ ràng</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </ShowcaseSection>

        {/* SECTION 5 — START TRIAL */}
        <StartSection>
          <div className="container start-wrap">
            <div className="start-hero reveal">
              <span className="start-badge">✨ Dùng thử miễn phí</span>
              <h2>Bắt đầu với TuteClass ngay hôm nay</h2>
              <div className="start-role-toggle show-role-toggle" role="tablist" aria-label="Vai trò">
                <button
                  type="button"
                  className={`start-role-btn show-role-btn ${startRole === 'teacher' ? 'active' : ''}`}
                  onClick={() => setStartRole('teacher')}
                >
                  Giáo viên
                </button>
                <button
                  type="button"
                  className={`start-role-btn show-role-btn ${startRole === 'student' ? 'active' : ''}`}
                  onClick={() => setStartRole('student')}
                >
                  Học sinh
                </button>
              </div>
            </div>

            {startRole === 'teacher' ? (
              <div className="start-role-panel active reveal reveal-d1">
                <p className="start-hero-lead">Thiết lập lớp học trong vài phút — quản lý lịch dạy, học phí và bài tập tập trung một nơi.</p>
                <div className="start-steps">
                  <div className="start-step">
                    <span className="start-step-num">1</span>
                    <b>Đăng ký tài khoản</b>
                    <small>Chỉ cần email hoặc số điện thoại</small>
                  </div>
                  <div className="start-step">
                    <span className="start-step-num">2</span>
                    <b>Thiết lập lớp học</b>
                    <small>Thêm học sinh, lịch dạy và học phí</small>
                  </div>
                  <div className="start-step">
                    <span className="start-step-num">3</span>
                    <b>Bắt đầu giảng dạy</b>
                    <small>Quản lý bài tập, tài liệu và theo dõi tiến độ</small>
                  </div>
                </div>
                <div className="start-actions">
                  <Link to="/register" className="btn btn-primary btn-lg">Dùng thử miễn phí <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
                  <Link to="/login" className="btn btn-ghost btn-lg">Đăng nhập</Link>
                </div>
                <div className="start-trust">
                  <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Không cần cài đặt</span>
                  <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Hỗ trợ tiếng Việt</span>
                  <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Dữ liệu bảo mật</span>
                </div>
              </div>
            ) : (
              <div className="start-role-panel active reveal reveal-d1">
                <p className="start-hero-lead">Tham gia lớp học dễ dàng — xem lịch, nộp bài và theo dõi tiến độ học tập mọi lúc.</p>
                <div className="start-steps">
                  <div className="start-step">
                    <span className="start-step-num">1</span>
                    <b>Đăng ký tài khoản</b>
                    <small>Email hoặc mã lớp từ giáo viên</small>
                  </div>
                  <div className="start-step">
                    <span className="start-step-num">2</span>
                    <b>Tham gia lớp học</b>
                    <small>Xem lịch học, tài liệu và bài tập được giao</small>
                  </div>
                  <div className="start-step">
                    <span className="start-step-num">3</span>
                    <b>Học tập mỗi ngày</b>
                    <small>Nộp bài, xem điểm và trao đổi với giáo viên</small>
                  </div>
                </div>
                <div className="start-actions">
                  <Link to="/register" className="btn btn-primary btn-lg">Tham gia ngay <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
                  <Link to="/login" className="btn btn-ghost btn-lg">Đăng nhập</Link>
                </div>
                <div className="start-trust">
                  <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Theo dõi tiến độ</span>
                  <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Nhận thông báo bài tập</span>
                  <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4 10-10"/></svg> Học mọi lúc, mọi nơi</span>
                </div>
              </div>
            )}

            <p className="snap-footer reveal reveal-d4">© 2025 TuteClass · Nền tảng quản lý lớp học thêm thông minh</p>
          </div>
        </StartSection>
      </main>
    </div>
  );
}
