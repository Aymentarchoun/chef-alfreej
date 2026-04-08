import { useState } from 'react';
import { menuItems as baseItems, mainSections } from '../../data/menuData';
import {
  getOverrides, saveOverrides, getAdditions, saveAdditions,
  getCustomSections, saveCustomSections,
  getCustomSubcategories, saveCustomSubcategories,
} from '../utils/storage';


const EMPTY_FORM = () => ({
  nameAr: '', nameEn: '', descriptionAr: '', descriptionEn: '',
  price: 0, promoPrice: undefined, emoji: '🍽️', image: '',
  category: 'daily', subcategory: 'meals',
});

const EMPTY_SECTION = () => ({ nameAr: '', nameEn: '', icon: '🍽️' });
const EMPTY_SUBCAT  = () => ({ nameAr: '', nameEn: '', icon: '🍽️', sectionKey: '' });

const baseSections = mainSections.filter(s => !s.isLink);

function buildSubcatMap(customSubcats) {
  const map = {};
  mainSections.forEach(s => s.subcategories.forEach(sc => { map[sc.key] = sc.nameEn; }));
  customSubcats.forEach(sc => { map[sc.key] = sc.nameEn; });
  return map;
}

export default function Management() {
  const [overrides, setOverrides]         = useState(getOverrides);
  const [additions, setAdditions]         = useState(getAdditions);
  const [customSections, setCustomSections]   = useState(getCustomSections);
  const [customSubcats, setCustomSubcats]   = useState(getCustomSubcategories);
  const [editTarget, setEditTarget]       = useState(null);
  const [form, setForm]                   = useState(EMPTY_FORM());
  const [showAdd, setShowAdd]             = useState(false);

  // Section modal
  const [showAddSection, setShowAddSection] = useState(false);
  const [sectionForm, setSectionForm]       = useState(EMPTY_SECTION());

  // Subcategory modal
  const [showAddSubcat, setShowAddSubcat] = useState(false);
  const [subcatForm, setSubcatForm]       = useState(EMPTY_SUBCAT());

  // All sections (base + custom)
  const sections = [
    ...baseSections,
    ...customSections.map(s => ({
      key: s.key, nameAr: s.nameAr, nameEn: s.nameEn, icon: s.icon,
      color: 'gold', bgClass: '', activeBg: '', borderClass: '',
      subcategories: customSubcats.filter(sc => sc.sectionKey === s.key).map(sc => ({
        key: sc.key, nameAr: sc.nameAr, nameEn: sc.nameEn, icon: sc.icon,
      })),
      isLink: false,
    })),
  ];

  const subcatMap = buildSubcatMap(customSubcats);

  const saveSection = () => {
    if (!sectionForm.nameEn.trim()) return;
    const key = `custom-sec-${Date.now()}`;
    const updated = [...customSections, { ...sectionForm, key }];
    setCustomSections(updated);
    saveCustomSections(updated);
    setShowAddSection(false);
    setSectionForm(EMPTY_SECTION());
    flash('Section added!');
  };

  const deleteSection = (key) => {
    const updated = customSections.filter(s => s.key !== key);
    setCustomSections(updated);
    saveCustomSections(updated);
    // remove associated subcategories
    const updatedSubs = customSubcats.filter(sc => sc.sectionKey !== key);
    setCustomSubcats(updatedSubs);
    saveCustomSubcategories(updatedSubs);
    flash('Section deleted.');
  };

  const saveSubcat = () => {
    if (!subcatForm.nameEn.trim() || !subcatForm.sectionKey) return;
    const key = `custom-sub-${Date.now()}`;
    const updated = [...customSubcats, { ...subcatForm, key }];
    setCustomSubcats(updated);
    saveCustomSubcategories(updated);
    setShowAddSubcat(false);
    setSubcatForm(EMPTY_SUBCAT());
    flash('Subcategory added!');
  };

  const deleteSubcat = (key) => {
    const updated = customSubcats.filter(sc => sc.key !== key);
    setCustomSubcats(updated);
    saveCustomSubcategories(updated);
    flash('Subcategory deleted.');
  };

  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState('all');
  const [saved, setSaved] = useState('');

  const flash = (msg) => { setSaved(msg); setTimeout(() => setSaved(''), 2000); };

  // ── Edit base item ────────────────────────────────────────────────────────
  const startEdit = (id) => {
    const base = baseItems.find(i => i.id === id);
    const ov   = overrides[id] ?? {};
    setEditTarget({ type: 'base', id });
    setForm({
      nameAr:        ov.nameAr        ?? base.nameAr,
      nameEn:        ov.nameEn        ?? base.nameEn,
      descriptionAr: ov.descriptionAr ?? base.descriptionAr,
      descriptionEn: ov.descriptionEn ?? base.descriptionEn,
      price:         (ov.price        ?? base.price),
      promoPrice:    ov.promoPrice !== undefined ? (ov.promoPrice ?? undefined) : base.promoPrice,
      emoji:         ov.emoji         ?? base.emoji,
      image:         ov.image         ?? base.image ?? '',
      category:      base.category,
      subcategory:   base.subcategory,
    });
    setShowAdd(false);
  };

  // ── Edit added item ───────────────────────────────────────────────────────
  const startEditAdded = (id) => {
    const item = additions.find(i => i.id === id);
    setEditTarget({ type: 'added', id });
    setForm({ ...item, image: item.image ?? '' });
    setShowAdd(false);
  };

  const cancelEdit = () => { setEditTarget(null); setForm(EMPTY_FORM()); };

  const saveEdit = () => {
    if (!editTarget) return;
    if (editTarget.type === 'base') {
      const base = baseItems.find(i => i.id === editTarget.id);
      const ov = {};
      if (form.nameAr        !== base.nameAr)        ov.nameAr        = form.nameAr;
      if (form.nameEn        !== base.nameEn)        ov.nameEn        = form.nameEn;
      if (form.descriptionAr !== base.descriptionAr) ov.descriptionAr = form.descriptionAr;
      if (form.descriptionEn !== base.descriptionEn) ov.descriptionEn = form.descriptionEn;
      if (form.price         !== base.price)         ov.price         = form.price;
      if (form.emoji         !== base.emoji)         ov.emoji         = form.emoji;
      if (form.image !== (base.image ?? ''))         ov.image         = form.image;
      if (form.promoPrice !== base.promoPrice)       ov.promoPrice    = form.promoPrice ?? null;
      const updated = { ...overrides, [editTarget.id]: ov };
      setOverrides(updated); saveOverrides(updated);
    } else {
      const updated = additions.map(i =>
        i.id === editTarget.id
          ? { ...i, ...form, id: editTarget.id }
          : i
      );
      setAdditions(updated); saveAdditions(updated);
    }
    setEditTarget(null); setForm(EMPTY_FORM());
    flash('Saved!');
  };

  const resetOverride = (id) => {
    const updated = { ...overrides };
    delete updated[id];
    setOverrides(updated); saveOverrides(updated);
    flash('Reset to default.');
  };

  // ── Add new item ──────────────────────────────────────────────────────────
  const startAdd = () => {
    setShowAdd(true); setEditTarget(null); setForm(EMPTY_FORM());
  };

  const saveAdd = () => {
    if (!form.nameEn.trim() || !form.nameAr.trim()) return;
    const newItem = {
      ...form,
      id: `custom-${Date.now()}`,
      image: form.image || undefined,
      promoPrice: form.promoPrice || undefined,
    };
    const updated = [...additions, newItem];
    setAdditions(updated); saveAdditions(updated);
    setShowAdd(false); setForm(EMPTY_FORM());
    flash('Item added!');
  };

  const deleteAdded = (id) => {
    const updated = additions.filter(i => i.id !== id);
    setAdditions(updated); saveAdditions(updated);
    flash('Deleted.');
  };

  // ── All items combined ────────────────────────────────────────────────────
  const allItems = [
    ...baseItems.map(i => ({ ...i, ...overrides[i.id], id: i.id, _type: 'base' })),
    ...additions.map(i => ({ ...i, _type: 'added' })),
  ];

  const filtered = allItems.filter(i => {
    const matchSearch = !search ||
      i.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      i.nameAr.includes(search);
    const matchSection = activeSection === 'all' || i.category === activeSection;
    return matchSearch && matchSection;
  });

  const grouped = sections.map(s => ({
    section: s,
    items: filtered.filter(i => i.category === s.key),
  })).filter(g => g.items.length > 0);

  // ── Shared form renderer ─────────────────────────────────────────────────
  const renderForm = (onSave, onCancel, isNew = false) => {
    const subForSection = sections.find(s => s.key === form.category)?.subcategories ?? [];
    return (
      <div
        style={{ background: '#111', border: '1px solid rgba(200,150,62,0.3)', borderRadius: 16 }}
        className="p-5 mb-4 space-y-4"
      >
        <p style={{ color: '#C8963E' }} className="font-bold text-sm">{isNew ? '➕ Add New Item' : '✏️ Edit Item'}</p>

        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: 'Name (Arabic)', key: 'nameAr', dir: 'rtl' },
            { label: 'Name (English)', key: 'nameEn', dir: 'ltr' },
            { label: 'Description (Arabic)', key: 'descriptionAr', dir: 'rtl' },
            { label: 'Description (English)', key: 'descriptionEn', dir: 'ltr' },
          ].map(({ label, key, dir }) => (
            <div key={key}>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} className="block mb-1">{label}</label>
              <input
                type="text"
                dir={dir}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} className="block mb-1">Price (QR)</label>
            <input
              type="number" min={0}
              value={typeof form.price === 'number' ? form.price : ''}
              onChange={e => setForm(f => ({ ...f, price: e.target.value === '' ? 'market' : Number(e.target.value) }))}
              placeholder="0 = market"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
            />
          </div>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} className="block mb-1">Offer Price</label>
            <input
              type="number" min={0}
              value={form.promoPrice ?? ''}
              onChange={e => setForm(f => ({ ...f, promoPrice: e.target.value === '' ? undefined : Number(e.target.value) }))}
              placeholder="Leave empty"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
            />
          </div>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} className="block mb-1">Emoji</label>
            <input
              type="text"
              value={form.emoji}
              onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none text-center"
            />
          </div>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} className="block mb-1">Image URL/Path</label>
            <input
              type="text"
              value={form.image}
              onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
              placeholder="/menu/item.jpg"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
            />
          </div>
        </div>

        {isNew && (
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} className="block mb-1">Section</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({
                  ...f, category: e.target.value,
                  subcategory: sections.find(s => s.key === e.target.value)?.subcategories[0]?.key ?? '',
                }))}
                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              >
                {sections.map(s => <option key={s.key} value={s.key}>{s.nameEn}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} className="block mb-1">Subcategory</label>
              <select
                value={form.subcategory}
                onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))}
                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              >
                {subForSection.map(sc => <option key={sc.key} value={sc.key}>{sc.nameEn}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            onClick={onSave}
            style={{ background: '#C8963E', color: '#000' }}
            className="px-5 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all"
          >
            {isNew ? 'Add Item' : 'Save Changes'}
          </button>
          <button
            onClick={onCancel}
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
            className="px-5 py-2 rounded-xl text-sm font-medium hover:brightness-110 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 style={{ color: 'white' }} className="text-2xl font-bold">Management</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)' }} className="text-sm mt-0.5">
            Edit items · Add items · {additions.length} custom item{additions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {saved && (
            <span style={{ color: '#4ade80' }} className="text-sm font-medium">{saved}</span>
          )}
          <button
            onClick={() => { setShowAddSection(true); setShowAddSubcat(false); setShowAdd(false); }}
            style={{ background: 'rgba(139,92,246,0.15)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)' }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 transition-all"
          >
            ＋ Add Section
          </button>
          <button
            onClick={() => { setShowAddSubcat(true); setShowAddSection(false); setShowAdd(false); }}
            style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 transition-all"
          >
            ＋ Add Subcategory
          </button>
          <button
            onClick={startAdd}
            style={{ background: '#C8963E', color: '#000' }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 transition-all"
          >
            ＋ Add New Item
          </button>
        </div>
      </div>

      {/* Add Section modal */}
      {showAddSection && (
        <div style={{ background: '#111', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 16 }}
          className="p-5 mb-5 space-y-4">
          <p style={{ color: '#c084fc' }} className="font-bold text-sm">＋ Add New Section</p>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} className="block mb-1">Name (English)</label>
              <input type="text" value={sectionForm.nameEn}
                onChange={e => setSectionForm(f => ({ ...f, nameEn: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} className="block mb-1">Name (Arabic)</label>
              <input type="text" dir="rtl" value={sectionForm.nameAr}
                onChange={e => setSectionForm(f => ({ ...f, nameAr: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} className="block mb-1">Icon (emoji)</label>
              <input type="text" value={sectionForm.icon}
                onChange={e => setSectionForm(f => ({ ...f, icon: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none text-center" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={saveSection}
              style={{ background: '#c084fc', color: '#000' }}
              className="px-5 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all">
              Save Section
            </button>
            <button onClick={() => setShowAddSection(false)}
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
              className="px-5 py-2 rounded-xl text-sm font-medium hover:brightness-110 transition-all">
              Cancel
            </button>
          </div>

          {/* Existing custom sections list */}
          {customSections.length > 0 && (
            <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }} className="font-semibold uppercase mb-2">Custom Sections</p>
              <div className="space-y-1.5">
                {customSections.map(s => (
                  <div key={s.key} className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span style={{ color: 'white' }} className="text-sm">{s.icon} {s.nameEn} / {s.nameAr}</span>
                    <button onClick={() => deleteSection(s.key)}
                      style={{ color: '#fc8181' }} className="text-xs hover:brightness-110">✕ Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Subcategory modal */}
      {showAddSubcat && (
        <div style={{ background: '#111', border: '1px solid rgba(59,130,246,0.35)', borderRadius: 16 }}
          className="p-5 mb-5 space-y-4">
          <p style={{ color: '#60a5fa' }} className="font-bold text-sm">＋ Add New Subcategory</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} className="block mb-1">Name (English)</label>
              <input type="text" value={subcatForm.nameEn}
                onChange={e => setSubcatForm(f => ({ ...f, nameEn: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} className="block mb-1">Name (Arabic)</label>
              <input type="text" dir="rtl" value={subcatForm.nameAr}
                onChange={e => setSubcatForm(f => ({ ...f, nameAr: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} className="block mb-1">Icon (emoji)</label>
              <input type="text" value={subcatForm.icon}
                onChange={e => setSubcatForm(f => ({ ...f, icon: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none text-center" />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }} className="block mb-1">Parent Section</label>
              <select value={subcatForm.sectionKey}
                onChange={e => setSubcatForm(f => ({ ...f, sectionKey: e.target.value }))}
                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none">
                <option value="">— choose section —</option>
                {sections.map(s => <option key={s.key} value={s.key}>{s.icon} {s.nameEn}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={saveSubcat}
              style={{ background: '#60a5fa', color: '#000' }}
              className="px-5 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all">
              Save Subcategory
            </button>
            <button onClick={() => setShowAddSubcat(false)}
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
              className="px-5 py-2 rounded-xl text-sm font-medium hover:brightness-110 transition-all">
              Cancel
            </button>
          </div>

          {/* Existing custom subcategories list */}
          {customSubcats.length > 0 && (
            <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }} className="font-semibold uppercase mb-2">Custom Subcategories</p>
              <div className="space-y-1.5">
                {customSubcats.map(sc => (
                  <div key={sc.key} className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span style={{ color: 'white' }} className="text-sm">
                      {sc.icon} {sc.nameEn} / {sc.nameAr}
                      <span style={{ color: 'rgba(255,255,255,0.3)' }} className="text-xs ml-2">
                        → {sections.find(s => s.key === sc.sectionKey)?.nameEn ?? sc.sectionKey}
                      </span>
                    </span>
                    <button onClick={() => deleteSubcat(sc.key)}
                      style={{ color: '#fc8181' }} className="text-xs hover:brightness-110">✕ Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add item form */}
      {showAdd && renderForm(saveAdd, () => setShowAdd(false), true)}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search items…"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
          className="flex-1 min-w-40 px-4 py-2 rounded-xl text-sm outline-none"
        />
        <button
          onClick={() => setActiveSection('all')}
          style={activeSection === 'all'
            ? { background: 'rgba(200,150,62,0.12)', color: '#C8963E', border: '1px solid rgba(200,150,62,0.3)' }
            : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}
          className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
        >
          All
        </button>
        {sections.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={activeSection === s.key
              ? { background: 'rgba(200,150,62,0.12)', color: '#C8963E', border: '1px solid rgba(200,150,62,0.3)' }
              : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}
            className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          >
            {s.icon} {s.nameEn}
          </button>
        ))}
      </div>

      {/* Items grouped by section */}
      <div className="space-y-7">
        {grouped.map(({ section, items }) => {
          const isCustomSection = customSections.some(s => s.key === section.key);
          const sectionItemCount = allItems.filter(i => i.category === section.key).length;
          const canDeleteSection = isCustomSection && sectionItemCount === 0;

          return (
          <div key={section.key}>
            {/* Section header with optional trash */}
            <div className="flex items-center justify-between mb-3">
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: '0.1em' }}
                className="font-semibold uppercase">
                {section.icon} {section.nameEn}
              </p>
              {isCustomSection && (
                <button
                  onClick={() => canDeleteSection ? deleteSection(section.key) : flash('Remove all items first')}
                  title={canDeleteSection ? 'Delete section' : 'Cannot delete: section has items'}
                  style={{
                    color: canDeleteSection ? '#fc8181' : 'rgba(255,255,255,0.2)',
                    cursor: canDeleteSection ? 'pointer' : 'not-allowed',
                  }}
                  className="text-sm hover:brightness-110 transition-all"
                >
                  🗑
                </button>
              )}
            </div>

            {/* Group items by subcategory with sub-headers */}
            {(() => {
              const subcatKeys = [...new Set(items.map(i => i.subcategory))];
              return subcatKeys.map(scKey => {
                const scItems = items.filter(i => i.subcategory === scKey);
                const isCustomSC = customSubcats.some(sc => sc.key === scKey);
                const scItemCount = allItems.filter(i => i.subcategory === scKey).length;
                const canDeleteSC = isCustomSC && scItemCount === 0;
                const scName = subcatMap[scKey] ?? scKey;
                const scIcon = [...section.subcategories, ...customSubcats].find(sc => sc.key === scKey)?.icon ?? '';

                return (
                  <div key={scKey} className="mb-4">
                    {/* Subcategory header */}
                    <div className="flex items-center justify-between mb-2 px-1">
                      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, letterSpacing: '0.08em' }}
                        className="font-semibold uppercase">
                        {scIcon} {scName}
                      </p>
                      {isCustomSC && (
                        <button
                          onClick={() => canDeleteSC ? deleteSubcat(scKey) : flash('Remove all items in this subcategory first')}
                          title={canDeleteSC ? 'Delete subcategory' : 'Cannot delete: subcategory has items'}
                          style={{
                            color: canDeleteSC ? '#fc8181' : 'rgba(255,255,255,0.15)',
                            cursor: canDeleteSC ? 'pointer' : 'not-allowed',
                            fontSize: 13,
                          }}
                          className="hover:brightness-110 transition-all"
                        >
                          🗑
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
              {scItems.map(item => {
                const isEditing  = editTarget?.id === item.id;
                const isCustom   = item._type === 'added';
                const hasOv      = !isCustom && !!overrides[item.id] && Object.keys(overrides[item.id]).length > 0;

                return (
                  <div key={item.id}>
                    {isEditing && renderForm(saveEdit, cancelEdit)}

                    {!isEditing && (
                      <div
                        style={{
                          background: '#111',
                          border: `1px solid ${hasOv ? 'rgba(200,150,62,0.25)' : isCustom ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.07)'}`,
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                          style={{ background: 'rgba(255,255,255,0.06)' }}>
                          {item.image
                            ? <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                            : <span className="text-xl">{item.emoji}</span>}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p style={{ color: 'white' }} className="text-sm font-medium">{item.nameEn}</p>
                            {isCustom && (
                              <span style={{ background: 'rgba(139,92,246,0.12)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.25)' }}
                                className="px-1.5 py-0.5 rounded text-xs font-bold">custom</span>
                            )}
                            {hasOv && (
                              <span style={{ background: 'rgba(200,150,62,0.1)', color: '#C8963E', border: '1px solid rgba(200,150,62,0.25)' }}
                                className="px-1.5 py-0.5 rounded text-xs font-bold">modified</span>
                            )}
                          </div>
                          <p style={{ color: 'rgba(255,255,255,0.25)' }} className="text-xs" dir="rtl">{item.nameAr}</p>
                        </div>

                        <div className="text-right flex-shrink-0 mr-3">
                          <p style={{ color: '#C8963E' }} className="text-sm font-semibold">
                            {typeof item.price === 'number' ? `${item.price} QR` : 'Market'}
                          </p>
                          {item.promoPrice && (
                            <p style={{ color: '#4ade80' }} className="text-xs">Offer: {item.promoPrice} QR</p>
                          )}
                          <p style={{ color: 'rgba(255,255,255,0.25)' }} className="text-xs">
                            {subcatMap[item.subcategory] ?? item.subcategory}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => isCustom ? startEditAdded(item.id) : startEdit(item.id)}
                            style={{ background: 'rgba(200,150,62,0.1)', color: '#C8963E', border: '1px solid rgba(200,150,62,0.2)' }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:brightness-110 transition-all"
                          >
                            Edit
                          </button>
                          {hasOv && !isCustom && (
                            <button
                              onClick={() => resetOverride(item.id)}
                              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:brightness-110 transition-all"
                              title="Reset to default"
                            >
                              ↺
                            </button>
                          )}
                          {/* Trash — custom items only */}
                          {isCustom && (
                            <button
                              onClick={() => deleteAdded(item.id)}
                              style={{ background: 'rgba(239,68,68,0.08)', color: '#fc8181', border: '1px solid rgba(239,68,68,0.2)' }}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:brightness-110 transition-all"
                              title="Delete item"
                            >
                              🗑
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        );
        })}
      </div>
    </div>
  );
}
