import React, { useState } from 'react';
import Layout from './Layout';
import LiveOrders from './pages/LiveOrders';
import MenuAvailability from './pages/MenuAvailability';
import OrderHistory from './pages/OrderHistory';
import UserSettings from './pages/UserSettings';
import Management from './pages/Management';
import { getUsers, saveUsers, KEYS } from './utils/storage';

export { getUsers, saveUsers };

export default function AdminApp() {
  const [session, setSession] = useState(() => {
    try {
      const s = localStorage.getItem(KEYS.SESSION);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [page, setPage] = useState('orders');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const users = getUsers();
    const key = username.toLowerCase().trim();
    const user = users[key];
    if (!user || user.password !== password) {
      setError('Invalid username or password');
      return;
    }
    const s = { username: key, role: user.role, displayName: user.displayName };
    localStorage.setItem(KEYS.SESSION, JSON.stringify(s));
    setSession(s);
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem(KEYS.SESSION);
    setSession(null);
    setPage('orders');
    setUsername('');
    setPassword('');
  };

  const updateSession = (s) => {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(s));
    setSession(s);
  };

  // ── Login screen ───────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        dir="ltr"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #111 100%)',
        }}
      >
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Chef Alfreej" className="w-16 h-16 mx-auto mb-3 object-contain" />
            <h1 style={{ color: '#C8963E' }} className="text-xl font-bold">Chef Alfreej</h1>
            <p style={{ color: 'rgba(255,255,255,0.35)' }} className="text-sm mt-1">Kitchen Dashboard</p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}
            className="rounded-2xl p-6 space-y-4"
          >
            <div>
              <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: '0.1em' }}
                className="block font-semibold uppercase mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                placeholder="kitchen  or  manager"
                autoComplete="username"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${error ? '#e53e3e' : 'rgba(255,255,255,0.1)'}`,
                  color: 'white',
                }}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                onFocus={e => (e.target.style.borderColor = '#C8963E')}
                onBlur={e => (e.target.style.borderColor = error ? '#e53e3e' : 'rgba(255,255,255,0.1)')}
              />
            </div>

            <div>
              <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: '0.1em' }}
                className="block font-semibold uppercase mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${error ? '#e53e3e' : 'rgba(255,255,255,0.1)'}`,
                    color: 'white',
                  }}
                  className="w-full px-4 py-3 pr-10 rounded-xl text-sm outline-none transition-colors"
                  onFocus={e => (e.target.style.borderColor = '#C8963E')}
                  onBlur={e => (e.target.style.borderColor = error ? '#e53e3e' : 'rgba(255,255,255,0.1)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs hover:text-white transition-colors"
                >
                  {showPw ? 'hide' : 'show'}
                </button>
              </div>
            </div>

            {error && (
              <p style={{ color: '#fc8181' }} className="text-xs">{error}</p>
            )}

            <button
              type="submit"
              style={{ background: '#C8963E', color: '#000' }}
              className="w-full py-3 rounded-xl font-bold text-sm hover:brightness-110 transition-all active:scale-[0.98]"
            >
              Login
            </button>
          </form>

          <p style={{ color: 'rgba(255,255,255,0.15)' }} className="text-center text-xs mt-6">
            Chef Alfreej © 2017 — Internal Dashboard
          </p>
        </div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <Layout session={session} page={page} setPage={setPage} onLogout={handleLogout}>
      {page === 'orders'     && <LiveOrders />}
      {page === 'menu'       && <MenuAvailability />}
      {page === 'history'    && <OrderHistory />}
      {page === 'settings'   && <UserSettings session={session} updateSession={updateSession} />}
      {page === 'management' && session.role === 'manager' && <Management />}
    </Layout>
  );
}
