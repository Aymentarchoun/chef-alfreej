import React, { useState } from 'react';
import { AdminSession, Page } from './AdminApp';

interface Props {
  session: AdminSession;
  page: Page;
  setPage: (p: Page) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const kitchenNav: { key: Page; label: string; icon: string }[] = [
  { key: 'orders',   label: 'Live Orders',    icon: '🔴' },
  { key: 'menu',     label: 'Menu',           icon: '📋' },
  { key: 'history',  label: 'Order History',  icon: '📜' },
  { key: 'settings', label: 'Settings',       icon: '⚙️'  },
];

const managerNav: { key: Page; label: string; icon: string }[] = [
  ...kitchenNav,
  { key: 'management', label: 'Management', icon: '🛠️' },
];

const S = {
  sidebar:  { background: '#0D0D0D', borderRight: '1px solid rgba(255,255,255,0.07)' },
  active:   { background: 'rgba(200,150,62,0.12)', color: '#C8963E', border: '1px solid rgba(200,150,62,0.25)' },
  inactive: { color: 'rgba(255,255,255,0.4)', border: '1px solid transparent' },
  gold:     '#C8963E',
};

export default function Layout({ session, page, setPage, onLogout, children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = session.role === 'manager' ? managerNav : kitchenNav;

  const NavItems = () => (
    <>
      {nav.map(item => (
        <button
          key={item.key}
          onClick={() => { setPage(item.key); setMobileOpen(false); }}
          style={page === item.key ? S.active : S.inactive}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
        >
          <span style={{ fontSize: 16 }}>{item.icon}</span>
          <span>{item.label}</span>
          {item.key === 'orders' && (
            <span
              style={{ background: '#e53e3e' }}
              className="ml-auto w-2 h-2 rounded-full animate-pulse"
            />
          )}
        </button>
      ))}
    </>
  );

  return (
    <div
      className="min-h-screen flex"
      dir="ltr"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#0A0A0A' }}
    >
      {/* ── Desktop Sidebar ───────────────────────────── */}
      <aside
        className="hidden md:flex w-60 flex-col flex-shrink-0"
        style={S.sidebar}
      >
        {/* Logo */}
        <div
          className="px-5 py-4 flex items-center gap-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <img src="/logo.png" alt="Chef Alfreej" className="w-8 h-8 object-contain" />
          <div>
            <p style={{ color: S.gold }} className="font-bold text-sm leading-tight">Chef Alfreej</p>
            <p style={{ color: 'rgba(255,255,255,0.25)' }} className="text-xs">Dashboard</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavItems />
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="px-4 py-2 flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'rgba(200,150,62,0.15)', color: S.gold }}
            >
              {session.displayName[0]}
            </div>
            <div className="min-w-0">
              <p style={{ color: 'white' }} className="text-sm font-semibold truncate">{session.displayName}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)' }} className="text-xs capitalize">{session.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{ color: 'rgba(255,255,255,0.35)' }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                       transition-all hover:bg-red-500/10 hover:!text-red-400"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile Header ─────────────────────────────── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-3"
           style={{ background: '#0D0D0D', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="w-7 h-7 object-contain" />
          <span style={{ color: S.gold }} className="font-bold text-sm">Chef Alfreej</span>
        </div>
        <button
          onClick={() => setMobileOpen(v => !v)}
          style={{ color: 'rgba(255,255,255,0.6)' }}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute left-0 top-0 bottom-0 w-64 pt-16 flex flex-col"
            style={S.sidebar}
            onClick={e => e.stopPropagation()}
          >
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <NavItems />
            </nav>
            <div className="px-3 py-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="px-4 py-2">
                <p style={{ color: 'white' }} className="text-sm font-semibold">{session.displayName}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)' }} className="text-xs capitalize">{session.role}</p>
              </div>
              <button
                onClick={onLogout}
                style={{ color: 'rgba(255,255,255,0.35)' }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                           transition-all hover:bg-red-500/10 hover:!text-red-400"
              >
                <span>🚪</span> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ──────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pt-0 md:pt-0">
        <div className="md:hidden h-14" /> {/* spacer for mobile header */}
        <div className="p-5 md:p-7 max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
