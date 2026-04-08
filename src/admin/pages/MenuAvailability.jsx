import React, { useState } from 'react';
import { menuItems, mainSections } from '../../data/menuData';
import { getAvailability, saveAvailability } from '../utils/storage';

export default function MenuAvailability() {
  const [availability, setAvailability] = useState(getAvailability);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeSection, setActiveSection] = useState('all');

  const isAvail = (id) => availability[id] !== false;

  const toggle = (id) => {
    const updated = { ...availability, [id]: !isAvail(id) };
    setAvailability(updated);
    saveAvailability(updated);
  };

  const sections = mainSections.filter(s => !s.isLink);

  const filtered = menuItems.filter(item => {
    const matchSearch = !search ||
      item.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      item.nameAr.includes(search);
    const avail = isAvail(item.id);
    const matchFilter = filter === 'all' || (filter === 'available' ? avail : !avail);
    const matchSection = activeSection === 'all' || item.category === activeSection;
    return matchSearch && matchFilter && matchSection;
  });

  const grouped = sections.map(s => ({
    section: s,
    items: filtered.filter(item => item.category === s.key),
  })).filter(g => g.items.length > 0);

  const unavailCount = menuItems.filter(i => !isAvail(i.id)).length;

  const markAll = (available) => {
    const map = {};
    menuItems.forEach(i => { map[i.id] = available; });
    setAvailability(map);
    saveAvailability(map);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 style={{ color: 'white' }} className="text-2xl font-bold">Menu Availability</h1>
          <p style={{ color: unavailCount > 0 ? '#fc8181' : '#4ade80' }} className="text-sm mt-0.5 font-medium">
            {unavailCount > 0
              ? `${unavailCount} item${unavailCount !== 1 ? 's' : ''} unavailable`
              : '✓ All items available'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => markAll(true)}
            style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:brightness-110 transition-all"
          >
            Enable All
          </button>
          <button
            onClick={() => markAll(false)}
            style={{ background: 'rgba(239,68,68,0.1)', color: '#fc8181', border: '1px solid rgba(239,68,68,0.25)' }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:brightness-110 transition-all"
          >
            Disable All
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2 mb-5">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search items…"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
          className="flex-1 min-w-40 px-4 py-2 rounded-xl text-sm outline-none"
        />

        {/* Availability filter */}
        {['all', 'available', 'unavailable'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={filter === f
              ? { background: 'rgba(200,150,62,0.12)', color: '#C8963E', border: '1px solid rgba(200,150,62,0.3)' }
              : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}
            className="px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all hover:brightness-110"
          >
            {f}
          </button>
        ))}
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setActiveSection('all')}
          style={activeSection === 'all'
            ? { background: 'rgba(200,150,62,0.12)', color: '#C8963E', border: '1px solid rgba(200,150,62,0.3)' }
            : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
        >
          All Sections
        </button>
        {sections.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={activeSection === s.key
              ? { background: 'rgba(200,150,62,0.12)', color: '#C8963E', border: '1px solid rgba(200,150,62,0.3)' }
              : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
          >
            {s.icon} {s.nameEn}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-6">
        {grouped.map(({ section, items }) => (
          <div key={section.key}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: '0.1em' }}
              className="font-semibold uppercase mb-2.5">
              {section.icon} {section.nameEn}
            </p>
            <div className="space-y-2">
              {items.map(item => {
                const avail = isAvail(item.id);
                return (
                  <div
                    key={item.id}
                    style={{
                      background: avail ? 'rgba(255,255,255,0.03)' : 'rgba(239,68,68,0.05)',
                      border: `1px solid ${avail ? 'rgba(255,255,255,0.08)' : 'rgba(239,68,68,0.2)'}`,
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.06)' }}>
                      {item.image
                        ? <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                        : <span className="text-xl">{item.emoji}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ color: avail ? 'white' : 'rgba(255,255,255,0.35)' }} className="text-sm font-medium truncate">
                        {item.nameEn}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.25)' }} className="text-xs">{item.nameAr}</p>
                    </div>
                    <div className="text-right mr-3 flex-shrink-0">
                      <p style={{ color: '#C8963E' }} className="text-sm font-semibold">
                        {typeof item.price === 'number' ? `${item.price} QR` : 'Market'}
                      </p>
                      {item.promoPrice && (
                        <p style={{ color: '#4ade80' }} className="text-xs">Offer: {item.promoPrice} QR</p>
                      )}
                    </div>
                    {/* Toggle */}
                    <button
                      onClick={() => toggle(item.id)}
                      style={{ background: avail ? '#22c55e' : 'rgba(255,255,255,0.15)' }}
                      className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                      aria-label={avail ? 'Mark unavailable' : 'Mark available'}
                    >
                      <span
                        style={{ transform: avail ? 'translateX(22px)' : 'translateX(2px)' }}
                        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {grouped.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.2)' }} className="text-center py-16">No items match your filters</p>
        )}
      </div>
    </div>
  );
}
