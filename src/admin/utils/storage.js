// ─── Storage keys ─────────────────────────────────────────────────────────────

const KEYS = {
  ORDERS: 'kitchen_orders',
  AVAILABILITY: 'chef-menu-availability',
  OVERRIDES: 'chef-menu-overrides',
  ADDITIONS: 'chef-menu-additions',
  USERS: 'chef-admin-users',
  SESSION: 'chef-admin-session',
  CUSTOM_SECTIONS: 'chef-custom-sections',
  CUSTOM_SUBCATS: 'chef-custom-subcategories',
};

export { KEYS };

// ─── Orders ──────────────────────────────────────────────────────────────────

export function getOrders() {
  try { return JSON.parse(localStorage.getItem(KEYS.ORDERS) ?? '[]'); } catch { return []; }
}

export function saveOrders(orders) {
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
}

// ─── Availability ────────────────────────────────────────────────────────────

export function getAvailability() {
  try { return JSON.parse(localStorage.getItem(KEYS.AVAILABILITY) ?? '{}'); } catch { return {}; }
}

export function saveAvailability(map) {
  localStorage.setItem(KEYS.AVAILABILITY, JSON.stringify(map));
}

// ─── Overrides ───────────────────────────────────────────────────────────────

export function getOverrides() {
  try { return JSON.parse(localStorage.getItem(KEYS.OVERRIDES) ?? '{}'); } catch { return {}; }
}

export function saveOverrides(map) {
  localStorage.setItem(KEYS.OVERRIDES, JSON.stringify(map));
}

// ─── Additions ───────────────────────────────────────────────────────────────

export function getAdditions() {
  try { return JSON.parse(localStorage.getItem(KEYS.ADDITIONS) ?? '[]'); } catch { return []; }
}

export function saveAdditions(items) {
  localStorage.setItem(KEYS.ADDITIONS, JSON.stringify(items));
}

// ─── Custom sections ─────────────────────────────────────────────────────────

export function getCustomSections() {
  try { return JSON.parse(localStorage.getItem(KEYS.CUSTOM_SECTIONS) ?? '[]'); } catch { return []; }
}

export function saveCustomSections(items) {
  localStorage.setItem(KEYS.CUSTOM_SECTIONS, JSON.stringify(items));
}

// ─── Custom subcategories ─────────────────────────────────────────────────────

export function getCustomSubcategories() {
  try { return JSON.parse(localStorage.getItem(KEYS.CUSTOM_SUBCATS) ?? '[]'); } catch { return []; }
}

export function saveCustomSubcategories(items) {
  localStorage.setItem(KEYS.CUSTOM_SUBCATS, JSON.stringify(items));
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const DEFAULT_USERS = {
  kitchen: { password: 'Kitchen2017', role: 'kitchen', displayName: 'Kitchen' },
  manager: { password: 'Chefalfreej2017', role: 'manager', displayName: 'Manager' },
};

export function getUsers() {
  try {
    const stored = localStorage.getItem(KEYS.USERS);
    return stored ? { ...DEFAULT_USERS, ...JSON.parse(stored) } : DEFAULT_USERS;
  } catch { return DEFAULT_USERS; }
}

export function saveUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}
