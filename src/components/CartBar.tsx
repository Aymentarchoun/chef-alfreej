import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../hooks/useLanguage';

const CartBar: React.FC = () => {
  const { itemCount, subtotal, setCartOpen } = useCart();
  const { isArabic } = useLanguage();

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          key="cart-bar"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pt-2 pointer-events-none"
        >
          <button
            onClick={() => setCartOpen(true)}
            className="pointer-events-auto w-full max-w-lg mx-auto flex items-center justify-between
                       gap-3 px-5 py-3.5 rounded-2xl bg-crimson text-white font-bold text-sm
                       shadow-2xl shadow-crimson/30 hover:bg-crimson-light
                       transition-all duration-200 active:scale-[0.98]"
          >
            {/* Left: cart icon + label */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5.6a1 1 0 00.9 1.4H17m-10 0a2 2 0 104 0m6 0a2 2 0 104 0" />
                </svg>
                <span className="absolute -top-2 -end-2 w-4.5 h-4.5 min-w-[18px] rounded-full bg-white
                                 text-crimson text-[10px] font-bold flex items-center justify-center leading-none">
                  {itemCount}
                </span>
              </div>
              <span className="text-sm">
                {isArabic ? 'سلة المشتريات' : 'Your Cart'}
              </span>
            </div>

            {/* Right: subtotal */}
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
              <span className="text-sm font-bold">
                {subtotal} {isArabic ? 'ر.ق' : 'QR'}
              </span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartBar;
