import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { MenuItem } from '../data/menuData';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const addItem = useCallback((menuItem: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === menuItem.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === menuItem.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item: menuItem, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
    } else {
      setItems((prev) =>
        prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity: qty } : ci))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(() => items.reduce((sum, ci) => sum + ci.quantity, 0), [items]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, ci) => {
        const price = ci.item.promoPrice ?? (typeof ci.item.price === 'number' ? ci.item.price : 0);
        return sum + price * ci.quantity;
      }, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items, addItem, removeItem, updateQuantity, clearCart,
      itemCount, subtotal, isCartOpen, setCartOpen, isCheckoutOpen, setCheckoutOpen,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, isCartOpen, isCheckoutOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
