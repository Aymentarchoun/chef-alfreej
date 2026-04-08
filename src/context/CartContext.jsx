import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const addItem = useCallback((menuItem) => {
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

  const removeItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId, qty) => {
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
