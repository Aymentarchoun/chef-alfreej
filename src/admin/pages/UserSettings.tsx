import React, { useState } from 'react';
import { AdminSession, getUsers, saveUsers } from '../AdminApp';

interface Props {
  session: AdminSession;
  updateSession: (s: AdminSession) => void;
}

export default function UserSettings({ session, updateSession }: Props) {
  const [displayName, setDisplayName] = useState(session.displayName);
  const [currentPw, setCurrentPw]     = useState('');
  const [newPw, setNewPw]             = useState('');
  const [confirmPw, setConfirmPw]     = useState('');
  const [nameMsg, setNameMsg]         = useState('');
  const [pwMsg, setPwMsg]             = useState('');
  const [nameErr, setNameErr]         = useState(false);
  const [pwErr, setPwErr]             = useState(false);

  const saveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) { setNameErr(true); setNameMsg('Name cannot be empty.'); return; }
    const users = getUsers();
    users[session.username] = { ...users[session.username], displayName: displayName.trim() };
    saveUsers(users);
    const updated = { ...session, displayName: displayName.trim() };
    updateSession(updated);
    setNameErr(false);
    setNameMsg('Display name updated.');
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    const user  = users[session.username];
    if (currentPw !== user.password) { setPwErr(true); setPwMsg('Current password is incorrect.'); return; }
    if (newPw.length < 6)            { setPwErr(true); setPwMsg('New password must be at least 6 characters.'); return; }
    if (newPw !== confirmPw)         { setPwErr(true); setPwMsg('Passwords do not match.'); return; }
    users[session.username] = { ...user, password: newPw };
    saveUsers(users);
    setPwErr(false);
    setPwMsg('Password updated successfully.');
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
  };

  const card = { background: '#111', border: '1px solid rgba(255,255,255,0.08)' };

  return (
    <div className="max-w-lg">
      <h1 style={{ color: 'white' }} className="text-2xl font-bold mb-6">Account Settings</h1>

      {/* Profile info */}
      <div style={card} className="rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-4 mb-5">
          <div
            style={{ background: 'rgba(200,150,62,0.15)', color: '#C8963E' }}
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
          >
            {session.displayName[0]}
          </div>
          <div>
            <p style={{ color: 'white' }} className="font-bold text-base">{session.displayName}</p>
            <p style={{ color: 'rgba(255,255,255,0.35)' }} className="text-sm capitalize">{session.role}</p>
            <p style={{ color: 'rgba(255,255,255,0.25)' }} className="text-xs mt-0.5">@{session.username}</p>
          </div>
        </div>

        {/* Display name */}
        <form onSubmit={saveName} className="space-y-3">
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: '0.1em' }}
            className="font-semibold uppercase">Display Name</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={displayName}
              onChange={e => { setDisplayName(e.target.value); setNameMsg(''); }}
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${nameErr ? '#e53e3e' : 'rgba(255,255,255,0.1)'}`, color: 'white' }}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
            />
            <button
              type="submit"
              style={{ background: '#C8963E', color: '#000' }}
              className="px-4 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 transition-all"
            >
              Save
            </button>
          </div>
          {nameMsg && (
            <p style={{ color: nameErr ? '#fc8181' : '#4ade80' }} className="text-xs">{nameMsg}</p>
          )}
        </form>
      </div>

      {/* Change password */}
      <div style={card} className="rounded-2xl p-5">
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: '0.1em' }}
          className="font-semibold uppercase mb-4">Change Password</p>

        <form onSubmit={savePassword} className="space-y-3">
          {[
            { label: 'Current Password', val: currentPw, set: setCurrentPw },
            { label: 'New Password',     val: newPw,     set: setNewPw },
            { label: 'Confirm New',      val: confirmPw, set: setConfirmPw },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                className="block mb-1 font-medium">{label}</label>
              <input
                type="password"
                value={val}
                onChange={e => { set(e.target.value); setPwMsg(''); }}
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${pwErr ? '#e53e3e' : 'rgba(255,255,255,0.1)'}`, color: 'white' }}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              />
            </div>
          ))}

          {pwMsg && (
            <p style={{ color: pwErr ? '#fc8181' : '#4ade80' }} className="text-xs">{pwMsg}</p>
          )}

          <button
            type="submit"
            style={{ background: '#C8963E', color: '#000' }}
            className="w-full py-2.5 rounded-xl text-sm font-bold hover:brightness-110 transition-all mt-2"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
