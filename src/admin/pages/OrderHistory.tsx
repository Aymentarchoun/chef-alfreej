import React, { useState, useMemo } from 'react';
import { getOrders, Order } from '../utils/storage';

const PAYMENT_LABEL: Record<string, string> = {
  cash: 'Cash or Fawran',
  card: 'Card Link',
  pay_later: 'Pay Later',
};

function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function OrderHistory() {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);

  const allOrders = useMemo(() => getOrders(), []);

  const dayOrders = useMemo(
    () => allOrders.filter(o => o.timestamp.startsWith(selectedDate)).reverse(),
    [allOrders, selectedDate]
  );

  const stats = useMemo(() => {
    const revenue    = dayOrders.reduce((s, o) => s + o.total, 0);
    const pickup     = dayOrders.filter(o => o.deliveryMethod === 'pickup').length;
    const delivery   = dayOrders.filter(o => o.deliveryMethod === 'delivery').length;
    const completed  = dayOrders.filter(o => o.status === 'completed').length;
    return { revenue, pickup, delivery, completed };
  }, [dayOrders]);

  // Unique dates that have orders
  const datesWithOrders = useMemo(() => {
    const s = new Set(allOrders.map(o => o.timestamp.slice(0, 10)));
    return [...s].sort().reverse();
  }, [allOrders]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 style={{ color: 'white' }} className="text-2xl font-bold">Order History</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)' }} className="text-sm mt-0.5">
            {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          max={today}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
          className="px-4 py-2 rounded-xl text-sm outline-none"
        />
      </div>

      {/* Stats bar */}
      {dayOrders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Orders', value: dayOrders.length, color: 'white' },
            { label: 'Revenue', value: `${stats.revenue} QR`, color: '#C8963E' },
            { label: 'Pickup', value: stats.pickup, color: '#C8963E' },
            { label: 'Delivery', value: stats.delivery, color: '#c084fc' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}
              className="rounded-xl px-4 py-3 text-center"
            >
              <p style={{ color }} className="text-xl font-bold">{value}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)' }} className="text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {dayOrders.length === 0 && (
        <div className="text-center py-32" style={{ color: 'rgba(255,255,255,0.15)' }}>
          <p className="text-4xl mb-4">📜</p>
          <p className="text-lg font-medium">No orders on this date</p>
          {datesWithOrders.length > 0 && (
            <div className="mt-6">
              <p className="text-sm mb-3">Jump to a date with orders:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {datesWithOrders.slice(0, 7).map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    style={{ background: 'rgba(200,150,62,0.1)', color: '#C8963E', border: '1px solid rgba(200,150,62,0.25)' }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium hover:brightness-110 transition-all"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Orders list */}
      <div className="space-y-2">
        {dayOrders.map(order => (
          <details
            key={order.id}
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}
            className="rounded-2xl overflow-hidden group"
          >
            <summary className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none select-none
                                hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs font-mono">{fmt(order.timestamp)}</span>

                <span
                  style={order.deliveryMethod === 'delivery'
                    ? { background: 'rgba(139,92,246,0.12)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.2)' }
                    : { background: 'rgba(200,150,62,0.1)', color: '#C8963E', border: '1px solid rgba(200,150,62,0.2)' }}
                  className="px-2 py-0.5 rounded text-xs font-semibold"
                >
                  {order.deliveryMethod === 'delivery' ? '🛵 Delivery' : '🏪 Pickup'}
                </span>

                <span style={{ color: 'white' }} className="text-sm font-medium">{order.customer.name}</span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  style={order.status === 'completed'
                    ? { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                >
                  {order.status}
                </span>
                <span style={{ color: '#C8963E' }} className="font-bold">{order.total} QR</span>
                <span style={{ color: 'rgba(255,255,255,0.25)' }} className="text-xs group-open:rotate-180 transition-transform inline-block">▼</span>
              </div>
            </summary>

            {/* Expanded detail */}
            <div
              className="px-5 pb-4 pt-3 grid md:grid-cols-2 gap-5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, letterSpacing: '0.1em' }}
                  className="font-semibold uppercase mb-2">Items</p>
                <div className="space-y-1.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-lg">{item.emoji}</span>
                      <span style={{ color: 'white' }} className="text-sm flex-1">{item.nameEn}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }} className="text-sm">×{item.quantity}</span>
                      <span style={{ color: '#C8963E' }} className="text-xs font-semibold">{item.price * item.quantity} QR</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Subtotal</span>
                    <span style={{ color: 'white' }}>{order.subtotal} QR</span>
                  </div>
                  {order.deliveryFee > 0 && (
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>Delivery</span>
                      <span style={{ color: 'white' }}>{order.deliveryFee} QR</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold">
                    <span style={{ color: 'white' }}>Total</span>
                    <span style={{ color: '#C8963E' }}>{order.total} QR</span>
                  </div>
                </div>
              </div>

              <div>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, letterSpacing: '0.1em' }}
                  className="font-semibold uppercase mb-2">Customer</p>
                <div className="space-y-1.5">
                  <p style={{ color: 'white' }} className="text-sm font-semibold">{order.customer.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.55)' }} className="text-sm">📞 {order.customer.phone}</p>
                  {order.customer.location && (
                    <p style={{ color: 'rgba(255,255,255,0.45)' }} className="text-xs">📍 {order.customer.location}</p>
                  )}
                  <p style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs">
                    💳 {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
