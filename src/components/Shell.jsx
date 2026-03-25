import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme, Ico, Avatar, Btn } from './ui'
import DB from '../db'

const NAV = [
  { path:'/',              label:'Dashboard',        section:'Discover',    badge:'',  bnLabel:'Home',     icon:'dashboard' },
  { path:'/matches',       label:'Co-founder Match', section:'',            badge:'',  bnLabel:'Match',    icon:'matches' },
  { path:'/ideas',         label:'Startup Ideas',    section:'',            badge:'',  bnLabel:'Ideas',    icon:'ideas' },
  { path:'/skills',        label:'Skill Search',     section:'',            badge:'',  bnLabel:null,       icon:'skills' },
  { path:'/chat',          label:'Founder Chat',     section:'Collaborate', badge:'3', bnLabel:'Chat',     icon:'chat', dot:true },
  { path:'/my-startups',   label:'My Startups',      section:'',            badge:'',  bnLabel:null,       icon:'mystartups' },
  { path:'/progress',      label:'Progress Tracker', section:'Growth',      badge:'',  bnLabel:'Progress', icon:'progress' },
  { path:'/investors',     label:'Investor Radar',   section:'',            badge:'',  bnLabel:null,       icon:'investors' },
  { path:'/investor-match',label:'Investor Match',   section:'',            badge:'',  bnLabel:null,       icon:'imatch' },
  { path:'/analytics',     label:'Analytics',        section:'',            badge:'',  bnLabel:null,       icon:'analytics' },
  { path:'/profile',       label:'My Profile',       section:'Account',     badge:'',  bnLabel:'Profile',  icon:'profile' },
]

const BNAV = NAV.filter(n => n.bnLabel)

export default function Shell({ children, title, subtitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useTheme(user?.accentColor || '#5b7fff')

  // Calculate unread messages
  useEffect(() => {
    if (user) {
      const count = DB.getUnreadCount(user.id)
      setUnreadCount(count)
    }
  }, [user])

  // Listen for messages read events
  useEffect(() => {
    const handleMessagesRead = () => {
      if (user) {
        const count = DB.getUnreadCount(user.id)
        setUnreadCount(count)
      }
    }
    window.addEventListener('messagesRead', handleMessagesRead)
    return () => window.removeEventListener('messagesRead', handleMessagesRead)
  }, [user])

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="fm-shell">

      {/* ── Mobile overlay ── */}
      <div
        className={`fm-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* ── SIDEBAR ── */}
      <aside className={`fm-sidebar${sidebarOpen ? ' open' : ''}`}>

        {/* Logo / Brand */}
        <button
          className="fm-logo-btn"
          onClick={() => { navigate('/'); closeSidebar() }}
          aria-label="FounderMatch home"
        >
          <div className="fm-logo-icon">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="6" cy="5" r="2.5" fill="white"/>
              <circle cx="11" cy="8" r="2" fill="white" opacity=".7"/>
              <path d="M1 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          Founder<span style={{ color:'var(--acc)' }}>Match</span>
          {/* Mobile close button */}
          <span
            role="button"
            tabIndex={0}
            className="fm-sidebar-close"
            onClick={e => { e.stopPropagation(); closeSidebar() }}
            onKeyDown={e => e.key === 'Enter' && (e.stopPropagation(), closeSidebar())}
            aria-label="Close navigation"
          >
            <Ico name="close" size={16}/>
          </span>
        </button>

        {/* Nav Items */}
        {NAV.map(item => (
          <div key={item.path}>
            {item.section && (
              <div className="fm-nav-section">{item.section}</div>
            )}
            <button
              className={`fm-nav-item${pathname === item.path ? ' active' : ''}`}
              onClick={() => { navigate(item.path); closeSidebar() }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                style={{ opacity: pathname === item.path ? 1 : .65, flexShrink: 0 }}>
                <Ico name={item.icon}/>
              </svg>
              {item.label}
              {item.badge && (
                <span className="fm-nav-badge">{item.badge}</span>
              )}
            </button>
          </div>
        ))}

        {/* Sidebar Footer — User info */}
        {user && (
          <div
            className="fm-sidebar-footer"
            onClick={() => navigate('/profile')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate('/profile')}
          >
            <Avatar initials={user.initials} avClass={user.avClass}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{
                fontSize:'12px', fontWeight:600,
                fontFamily:"'Syne',sans-serif",
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>
                {user.name}
              </div>
              <div style={{ fontSize:'11px', color:'var(--muted)' }}>
                {user.role} · {user.city}
              </div>
            </div>
            <Btn size="sm" onClick={e => { e.stopPropagation(); navigate('/profile') }} style={{ flexShrink:0 }}>
              Edit
            </Btn>
          </div>
        )}
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="fm-main">

        {/* Topbar */}
        <header className="fm-topbar">
          <div className="fm-topbar-left">
            {/* Hamburger — shown on mobile */}
            <button
              className="fm-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
            >
              <Ico name="menu" size={20}/>
            </button>

            <div style={{ minWidth:0 }}>
              <div className="fm-topbar-title" style={{
                fontFamily:"'Syne',sans-serif",
                fontSize:'15px', fontWeight:700,
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
              }}>
                {title}
              </div>
              <div className="fm-topbar-sub" style={{
                fontSize:'11px', color:'var(--muted)',
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
              }}>
                {subtitle}
              </div>
            </div>
          </div>

          <div className="fm-topbar-right">
            {/* Search — hidden on mobile */}
            <div className="fm-search fm-hide-mobile">
              <Ico name="search" size={12} style={{ color:'var(--muted)', flexShrink:0 }}/>
              <input
                type="text"
                placeholder="Search…"
                aria-label="Search"
              />
            </div>

            {/* Notification bell */}
            <div
              className="fm-bell"
              onClick={() => navigate('/chat')}
              role="button"
              aria-label={unreadCount > 0 ? `${unreadCount} unread messages` : 'Messages'}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate('/chat')}
            >
              <Ico name="bell" size={14} style={{ color:'var(--muted)' }}/>
              {unreadCount > 0 && (
                <div className="fm-bell-badge">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </div>

            {/* Post Idea CTA — hidden on mobile */}
            <Btn
              variant="primary"
              onClick={() => navigate('/ideas')}
              className="fm-hide-mobile"
            >
              <Ico name="plus" size={12}/> Post Idea
            </Btn>

            {/* User pill */}
            {user && (
              <div
                className="fm-user-pill"
                onClick={() => navigate('/profile')}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate('/profile')}
                aria-label="My profile"
              >
                <Avatar initials={user.initials} avClass={user.avClass} size="sm"/>
                <div
                  className="fm-user-pill-name"
                  style={{ fontSize:'12px', fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}
                >
                  {user.name}
                </div>
              </div>
            )}

            <Btn size="sm" onClick={logout}>Sign out</Btn>
          </div>
        </header>

        {/* Page Content */}
        <div className="fm-page">
          <div className="fm-page-inner">
            {children}
          </div>
        </div>
      </div>

      {/* ── BOTTOM NAV (mobile) ── */}
      <nav
        className="fm-bottom-nav"
        style={{ gridTemplateColumns: `repeat(${BNAV.length}, 1fr)` }}
        aria-label="Main navigation"
      >
        {BNAV.map(item => (
          <button
            key={item.path}
            className={`fm-bnav-item${pathname === item.path ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
            aria-current={pathname === item.path ? 'page' : undefined}
          >
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
              <Ico name={item.icon}/>
            </svg>
            {item.bnLabel}
            {item.dot && pathname !== item.path && (
              <div className="fm-bnav-dot" aria-hidden="true"/>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
