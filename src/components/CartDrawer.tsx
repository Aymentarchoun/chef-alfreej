import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../hooks/useLanguage';

const WHATSAPP_NUMBER = '97474466445';

const CartDrawer: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, itemCount, subtotal, isCartOpen, setCartOpen, setCheckoutOpen } =
    useCart();
  const { isArabic } = useLanguage();

  const handleWhatsAppOrder = () => {
    const itemLines = items
      .map((ci) => {
        const name = isArabic ? ci.item.nameAr : ci.item.nameEn;
        const price = ci.item.promoPrice ?? (typeof ci.item.price === 'number' ? ci.item.price : 0);
        return `• ${name} x${ci.quantity} — ${price * ci.quantity} QR`;
      })
      .join('%0A');

    const message = isArabic
      ? `*طلب جديد من الموقع*%0A%0A${itemLines}%0A%0A*المجموع: ${subtotal} ر.ق*`
      : `*New Order from Website*%0A%0A${itemLines}%0A%0A*Total: ${subtotal} QR*`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handlePayment = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleContinueShopping = () => {
    setCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />

          {/* Popup */}
          <motion.div
            key="cart-popup"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 top-auto z-50 max-h-[85vh] w-auto max-w-lg mx-auto
                       bg-[#0A0A0A] rounded-2xl border border-white/10 shadow-2xl
                       flex flex-col overflow-hidden"
            aria-label={isArabic ? 'سلة المشتريات' : 'Shopping Cart'}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5.6a1 1 0 00.9 1.4H17m-10 0a2 2 0 104 0m6 0a2 2 0 104 0" />
                </svg>
                <h2 className="text-white font-bold text-lg">
                  {isArabic ? 'سلة المشتريات' : 'Your Cart'}
                </h2>
                {itemCount > 0 && (
                  <span className="bg-crimson text-white text-xs font-bold w-5 h-5 rounded-full
                                   flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 text-white/40 hover:text-white transition-colors"
                aria-label={isArabic ? 'إغلاق' : 'Close'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-white/20 gap-3">
                  <span className="text-5xl">🛒</span>
                  <p className="text-sm">{isArabic ? 'سلتك فارغة' : 'Your cart is empty'}</p>
                </div>
              ) : (
                items.map((ci) => {
                  const price = ci.item.promoPrice ?? (typeof ci.item.price === 'number' ? ci.item.price : 0);
                  return (
                    <div
                      key={ci.item.id}
                      className="flex gap-3 bg-white/5 rounded-xl p-3 border border-white/5"
                    >
                      {/* Emoji icon */}
                      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center
                                      text-2xl flex-shrink-0">
                        {ci.item.emoji}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-sm font-semibold truncate">
                          {isArabic ? ci.item.nameAr : ci.item.nameEn}
                        </h3>
                        <p className="text-gold text-xs mt-0.5">
                          {price} {isArabic ? 'ر.ق' : 'QR'}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center
                                       justify-center hover:bg-crimson transition-colors text-sm font-bold"
                            aria-label={isArabic ? 'إنقاص' : 'Decrease'}
                          >
                            −
                          </button>
                          <span className="text-white text-sm font-semibold w-6 text-center">
                            {ci.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center
                                       justify-center hover:bg-gold hover:text-black transition-colors text-sm font-bold"
                            aria-label={isArabic ? 'زيادة' : 'Increase'}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Line total + delete */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(ci.item.id)}
                          className="text-white/20 hover:text-crimson transition-colors"
                          aria-label={isArabic ? 'حذف' : 'Remove'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <span className="text-gold font-bold text-sm">
                          {price * ci.quantity} {isArabic ? 'ر.ق' : 'QR'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 px-5 py-4 space-y-3 flex-shrink-0">
                {/* Clear cart + Continue shopping */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={clearCart}
                    className="text-white/30 hover:text-crimson text-xs transition-colors"
                  >
                    {isArabic ? 'إفراغ السلة' : 'Clear Cart'}
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="text-gold/60 hover:text-gold text-xs transition-colors"
                  >
                    {isArabic ? 'متابعة التسوق' : 'Continue Shopping'}
                  </button>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">
                    {isArabic ? 'المجموع' : 'Subtotal'}
                  </span>
                  <span className="text-gold font-bold text-lg">
                    {subtotal} {isArabic ? 'ر.ق' : 'QR'}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2.5">
                  {/* WhatsApp order */}
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm
                               flex items-center justify-center gap-2 hover:brightness-110
                               transition-all active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.214l-.252-.156-2.905.863.863-2.905-.156-.252A8 8 0 1112 20z" />
                    </svg>
                    {isArabic ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
                  </button>

                  {/* Payment */}
                  <button
                    onClick={handlePayment}
                    className="w-full py-3 rounded-xl bg-crimson text-white font-bold text-sm
                               flex items-center justify-center gap-2 hover:bg-crimson-light
                               transition-all active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    {isArabic ? 'تأكيد الطلب' : 'Confirm Order'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
