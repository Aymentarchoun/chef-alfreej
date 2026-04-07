// ─── Order types ────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  nameAr: string;
  nameEn: string;
  emoji: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  timestamp: string;
  items: OrderItem[];
  deliveryMethod: 'pickup' | 'delivery';
  customer: {
    name: string;
    phone: string;
    location?: string;
    coords?: { lat: number; lng: number };
  };
  paymentMethod: 'cash' | 'card' | 'pay_later';
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
}

// ─── Menu overrides & additions ──────────────────────────────────────────────

export interface MenuOverride {
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price?: number | 'market';
  promoPrice?: number | null;
  emoji?: string;
  image?: string;
}

export interface AddedItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number | 'market';
  promoPrice?: number;
  emoji: string;
  image?: string;
  category: string;
  subcategory: string;
}

// ─── Admin users ─────────────────────────────────────────────────────────────

export interface StoredUser {
  password: string;
  role: 'kitchen' | 'manager';
  displayName: string;
}

// ─── Custom sections & subcategories ─────────────────────────────────────────

export interface CustomSection {
  key: string;
  nameAr: string;
  nameEn: string;
  icon: string;
}

export interface CustomSubcategory {
  key: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  sectionKey: string;
}

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
} as const;

export { KEYS };

// ─── Orders ──────────────────────────────────────────────────────────────────

export function getOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem(KEYS.ORDERS) ?? '[]'); } catch { return []; }
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
}

// ─── Availability ────────────────────────────────────────────────────────────

export function getAvailability(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(KEYS.AVAILABILITY) ?? '{}'); } catch { return {}; }
}

export function saveAvailability(map: Record<string, boolean>) {
  localStorage.setItem(KEYS.AVAILABILITY, JSON.stringify(map));
}

// ─── Overrides ───────────────────────────────────────────────────────────────

export function getOverrides(): Record<string, MenuOverride> {
  try { return JSON.parse(localStorage.getItem(KEYS.OVERRIDES) ?? '{}'); } catch { return {}; }
}

export function saveOverrides(map: Record<string, MenuOverride>) {
  localStorage.setItem(KEYS.OVERRIDES, JSON.stringify(map));
}

// ─── Additions ───────────────────────────────────────────────────────────────

export function getAdditions(): AddedItem[] {
  try { return JSON.parse(localStorage.getItem(KEYS.ADDITIONS) ?? '[]'); } catch { return []; }
}

export function saveAdditions(items: AddedItem[]) {
  localStorage.setItem(KEYS.ADDITIONS, JSON.stringify(items));
}

// ─── Custom sections ─────────────────────────────────────────────────────────

export function getCustomSections(): CustomSection[] {
  try { return JSON.parse(localStorage.getItem(KEYS.CUSTOM_SECTIONS) ?? '[]'); } catch { return []; }
}

export function saveCustomSections(items: CustomSection[]) {
  localStorage.setItem(KEYS.CUSTOM_SECTIONS, JSON.stringify(items));
}

// ─── Custom subcategories ─────────────────────────────────────────────────────

export function getCustomSubcategories(): CustomSubcategory[] {
  try { return JSON.parse(localStorage.getItem(KEYS.CUSTOM_SUBCATS) ?? '[]'); } catch { return []; }
}

export function saveCustomSubcategories(items: CustomSubcategory[]) {
  localStorage.setItem(KEYS.CUSTOM_SUBCATS, JSON.stringify(items));
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const DEFAULT_USERS: Record<string, StoredUser> = {
  kitchen: { password: 'Kitchen2017', role: 'kitchen', displayName: 'Kitchen' },
  manager: { password: 'Chefalfreej2017', role: 'manager', displayName: 'Manager' },
};

export function getUsers(): Record<string, StoredUser> {
  try {
    const stored = localStorage.getItem(KEYS.USERS);
    return stored ? { ...DEFAULT_USERS, ...JSON.parse(stored) } : DEFAULT_USERS;
  } catch { return DEFAULT_USERS; }
}

export function saveUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}
