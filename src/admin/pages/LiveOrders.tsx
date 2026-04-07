import React, { useState, useEffect, useRef } from 'react';
import { getOrders, saveOrders, Order } from '../utils/storage';
import { enableSound, isSoundEnabled, playOrderChime } from '../utils/sound';

const STATUS_STEPS: Order['status'][] = ['pending', 'preparing', 'ready', 'completed'];

const STATUS_META: Record<Order['status'], { label: string; bg: string; text: string; border: string }> = {
  pending:   { label: 'Pending',    bg: 'rgba(234,179,8,0.12)',    text: '#facc15', border: 'rgba(234,179,8,0.3)'   },
  preparing: { label: 'Preparing',  bg: 'rgba(59,130,246,0.12)',   text: '#60a5fa', border: 'rgba(59,130,246,0.3)'  },
  ready:     { label: 'Ready ✓',    bg: 'rgba(34,197,94,0.12)',    text: '#4ade80', border: 'rgba(34,197,94,0.3)'   },
  completed: { label: 'Completed',  bg: 'rgba(255,255,255,0.04)',  text: 'rgba(255,255,255,0.3)', border: 'rgba(255,255,255,0.08)' },
};

const PAYMENT_LABEL: Record<string, string> = {
  cash: 'Cash or Fawran',
  card: 'Card Link',
  pay_later: 'Pay Later',
};

function timeSince(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function LiveOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [soundOn, setSoundOn] = useState(isSoundEnabled);
  const prevPendingRef = useRef(0);

  const refresh = () => {
    const all = getOrders();
    const active = all.filter(o => o.status !== 'completed').reverse();
    setOrders(active);

    const pendingNow = active.filter(o => o.status === 'pending').length;
    if (pendingNow > prevPendingRef.current && isSoundEnabled()) {
      playOrderChime();
    }
    prevPendingRef.current = pendingNow;
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 2000);
    return () => clearInterval(id);
  }, []);

  const advanceStatus = (orderId: string) => {
    const all = getOrders();
    const updated = all.map(o => {
      if (o.id !== orderId) return o;
      const idx = STATUS_STEPS.indexOf(o.status);
      return { ...o, status: STATUS_STEPS[Math.min(idx + 1, STATUS_STEPS.length - 1)] };
    });
    saveOrders(updated);
    refresh();
  };

  const handleEnableSound = () => {
    enableSound();
    setSoundOn(true);
    playOrderChime();
  };

  const pendingCount  = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 style={{ color: 'white' }} className="text-2xl font-bold">Live Orders</h1>
          <div className="flex gap-3 mt-1.5">
            {pendingCount > 0 && (
              <span style={{ background: 'rgba(234,179,8,0.12)', color: '#facc15', border: '1px solid rgba(234,179,8,0.25)' }}
                className="px-2.5 py-0.5 rounded-full text-xs font-bold">
                {pendingCount} new
              </span>
            )}
            {preparingCount > 0 && (
              <span style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' }}
                className="px-2.5 py-0.5 rounded-full text-xs font-bold">
                {preparingCount} preparing
              </span>
            )}
            {orders.length === 0 && (
              <span style={{ color: 'rgba(255,255,255,0.3)' }} className="text-sm">No active orders</span>
            )}
          </div>
        </div>

        {soundOn ? (
          <div style={{ color: '#4ade80' }} className="flex items-center gap-1.5 text-sm font-medium">
            <span>🔔</span> Sound on
          </div>
        ) : (
          <button
            onClick={handleEnableSound}
            style={{ background: 'rgba(200,150,62,0.1)', color: '#C8963E', border: '1px solid rgba(200,150,62,0.3)' }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:brightness-110 transition-all"
          >
            🔔 Enable Sound Notifications
          </button>
        )}
      </div>

      {/* ── Empty state ─────────────────────────────────────────── */}
      {orders.length === 0 && (
        <div className="text-center py-32" style={{ color: 'rgba(255,255,255,0.15)' }}>
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-lg font-medium">Waiting for orders…</p>
          <p className="text-sm mt-1">New orders will appear here automatically</p>
        </div>
      )}

      {/* ── Order cards ─────────────────────────────────────────── */}
      <div className="space-y-4">
        {orders.map(order => {
          const meta = STATUS_META[order.status];
          const currentIdx = STATUS_STEPS.indexOf(order.status);
          const nextStatus = STATUS_STEPS[currentIdx + 1] as Order['status'] | undefined;

          return (
            <div
              key={order.id}
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}
              className="rounded-2xl overflow-hidden"
            >
              {/* Card header */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Status badge */}
                  <span
                    style={{ background: meta.bg, color: meta.text, border: `1px solid ${meta.border}` }}
                    className="px-3 py-0.5 rounded-full text-xs font-bold"
                  >
                    {meta.label}
                  </span>

                  {/* Time */}
                  <span style={{ color: 'rgba(255,255,255,0.3)' }} className="text-xs">{timeSince(order.timestamp)}</span>

                  {/* Delivery type */}
                  <span
                    style={order.deliveryMethod === 'delivery'
                      ? { background: 'rgba(139,92,246,0.12)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.25)' }
                      : { background: 'rgba(200,150,62,0.10)', color: '#C8963E', border: '1px solid rgba(200,150,62,0.2)' }}
                    className="px-2.5 py-0.5 rounded text-xs font-semibold"
                  >
                    {order.deliveryMethod === 'delivery' ? '🛵 Delivery' : '🏪 Pickup'}
                  </span>
                </div>

                <span style={{ color: '#C8963E' }} className="font-bold text-base">{order.total} QR</span>
              </div>

              {/* Card body */}
              <div className="px-5 py-4 grid md:grid-cols-2 gap-5">
                {/* Items */}
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, letterSpacing: '0.1em' }}
                    className="font-semibold uppercase mb-2">Items</p>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xl">{item.emoji}</span>
                        <span style={{ color: 'white' }} className="text-sm flex-1">{item.nameEn}</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }} className="text-sm">×{item.quantity}</span>
                        <span style={{ color: '#C8963E' }} className="text-xs font-semibold">{item.price * item.quantity} QR</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer */}
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, letterSpacing: '0.1em' }}
                    className="font-semibold uppercase mb-2">Customer</p>
                  <div className="space-y-1.5">
                    <p style={{ color: 'white' }} className="text-sm font-semibold">{order.customer.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.55)' }} className="text-sm">📞 {order.customer.phone}</p>
                    {order.customer.location && (
                      <p style={{ color: 'rgba(255,255,255,0.45)' }} className="text-xs leading-relaxed">
                        📍 {order.customer.location}
                      </p>
                    )}
                    {order.customer.coords && (
                      <a
                        href={`https://www.google.com/maps?q=${order.customer.coords.lat},${order.customer.coords.lng}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ color: '#60a5fa' }}
                        className="text-xs hover:underline inline-flex items-center gap-1"
                      >
                        🗺️ Open in Maps
                      </a>
                    )}
                    <p style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs">
                      💳 {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
                    </p>
                    {order.deliveryFee > 0 && (
                      <p style={{ color: 'rgba(255,255,255,0.3)' }} className="text-xs">
                        Delivery fee: {order.deliveryFee} QR
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {nextStatus && (
                <div className="px-5 py-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button
                    onClick={() => advanceStatus(order.id)}
                    style={{ background: '#C8963E', color: '#000' }}
                    className="px-5 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all active:scale-[0.97]"
                  >
                    → Mark as {STATUS_META[nextStatus].label}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
