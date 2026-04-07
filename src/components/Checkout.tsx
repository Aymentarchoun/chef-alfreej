import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../hooks/useLanguage';

type DeliveryOption = 'pickup' | 'delivery';
type PaymentMethod = 'cash' | 'card' | 'pay_later';
type Step = 'review' | 'details' | 'confirmed';
type LocationStatus = 'idle' | 'loading' | 'found' | 'error';

const DELIVERY_FEE = 10;
const PAY_LATER_THRESHOLD = 800;

const Checkout: React.FC = () => {
  const { items, subtotal, clearCart, isCheckoutOpen, setCheckoutOpen } = useCart();
  const { isArabic } = useLanguage();

  const [step, setStep] = useState<Step>('review');
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('pickup');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
  const [locationAddress, setLocationAddress] = useState('');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocationCoords({ lat, lng });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': isArabic ? 'ar' : 'en' } }
          );
          const data = await res.json();
          setLocationAddress(data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } catch {
          setLocationAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
        setLocationStatus('found');
        setErrors((p) => ({ ...p, location: '' }));
      },
      () => setLocationStatus('error')
    );
  };

  const deliveryFee = deliveryOption === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const handleClose = () => {
    setCheckoutOpen(false);
    setStep('review');
    setDeliveryOption('pickup');
    setName('');
    setPhone('');
    setLocationStatus('idle');
    setLocationAddress('');
    setLocationCoords(null);
    setPaymentMethod('cash');
    setErrors({});
  };

  const handleProceedToDetails = () => {
    setStep('details');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = isArabic ? 'الاسم مطلوب' : 'Name is required';
    if (!phone.trim()) errs.phone = isArabic ? 'رقم الهاتف مطلوب' : 'Phone is required';
    if (deliveryOption === 'delivery' && locationStatus !== 'found')
      errs.location = isArabic ? 'يرجى تحديد موقعك' : 'Please detect your location';
    return errs;
  };

  const handleConfirm = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Save order to localStorage for kitchen dashboard
    const order = {
      id: `order-${Date.now()}`,
      timestamp: new Date().toISOString(),
      items: items.map((ci) => ({
        id: ci.item.id,
        nameAr: ci.item.nameAr,
        nameEn: ci.item.nameEn,
        emoji: ci.item.emoji,
        price: ci.item.promoPrice ?? (typeof ci.item.price === 'number' ? ci.item.price : 0),
        quantity: ci.quantity,
      })),
      deliveryMethod: deliveryOption,
      customer: {
        name,
        phone,
        ...(deliveryOption === 'delivery'
          ? { location: locationAddress, coords: locationCoords }
          : {}),
      },
      paymentMethod: deliveryOption === 'pickup' ? 'cash' : paymentMethod,
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
    };

    const existing = JSON.parse(localStorage.getItem('kitchen_orders') ?? '[]');
    localStorage.setItem('kitchen_orders', JSON.stringify([...existing, order]));

    setStep('confirmed');
  };

  const handleDone = () => {
    clearCart();
    handleClose();
  };

  if (!isCheckoutOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="checkout-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md overflow-y-auto"
      >
        <div className="min-h-screen flex items-start justify-center px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-lg bg-[#0A0A0A] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {step === 'details' && (
                  <button
                    onClick={() => setStep('review')}
                    className="p-1.5 text-white/40 hover:text-white transition-colors"
                    aria-label={isArabic ? 'رجوع' : 'Back'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <h2 className="text-gold font-bold text-lg">
                  {step === 'review'
                    ? (isArabic ? 'الفاتورة' : 'Your Bill')
                    : step === 'details'
                    ? (isArabic ? 'تفاصيل الطلب' : 'Order Details')
                    : (isArabic ? 'تم الطلب' : 'Order Placed')}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 text-white/40 hover:text-white transition-colors"
                aria-label={isArabic ? 'إغلاق' : 'Close'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── STEP 1: Review bill + choose delivery method ── */}
            {step === 'review' && (
              <>
                {/* Bill items */}
                <div className="px-6 py-4 space-y-3">
                  <div className="flex items-center justify-between text-white/30 text-xs uppercase tracking-wider pb-2 border-b border-white/5">
                    <span>{isArabic ? 'الصنف' : 'Item'}</span>
                    <span>{isArabic ? 'المبلغ' : 'Amount'}</span>
                  </div>
                  {items.map((ci) => {
                    const price = ci.item.promoPrice ?? (typeof ci.item.price === 'number' ? ci.item.price : 0);
                    return (
                      <div key={ci.item.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-lg">{ci.item.emoji}</span>
                          <div className="min-w-0">
                            <p className="text-white truncate">{isArabic ? ci.item.nameAr : ci.item.nameEn}</p>
                            <p className="text-white/30 text-xs">{price} x {ci.quantity}</p>
                          </div>
                        </div>
                        <span className="text-white font-medium ms-3 flex-shrink-0">
                          {price * ci.quantity} {isArabic ? 'ر.ق' : 'QR'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery method */}
                <div className="px-6 py-4 border-t border-white/5">
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
                    {isArabic ? 'طريقة الاستلام' : 'Delivery Method'}
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={() => setDeliveryOption('pickup')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-start transition-all duration-200 ${
                        deliveryOption === 'pickup' ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        deliveryOption === 'pickup' ? 'border-gold' : 'border-white/30'
                      }`}>
                        {deliveryOption === 'pickup' && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">
                          {isArabic ? 'استلام من المطعم' : 'Pick from Restaurant'}
                        </p>
                        <p className="text-white/40 text-xs mt-0.5">
                          {isArabic ? 'شيف الفريج المعمورة' : 'Chef Alfreej Maamoura'}
                        </p>
                      </div>
                      <span className="text-green-400 text-xs font-bold flex-shrink-0">
                        {isArabic ? 'مجاناً' : 'FREE'}
                      </span>
                    </button>

                    <button
                      onClick={() => setDeliveryOption('delivery')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-start transition-all duration-200 ${
                        deliveryOption === 'delivery' ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        deliveryOption === 'delivery' ? 'border-gold' : 'border-white/30'
                      }`}>
                        {deliveryOption === 'delivery' && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">
                          {isArabic ? 'توصيل' : 'Delivery'}
                        </p>
                        <p className="text-white/40 text-xs mt-0.5">
                          {isArabic ? 'خلال 35-45 دقيقة تقريباً' : 'Approx. 35-45 minutes'}
                        </p>
                      </div>
                      <span className="text-gold text-xs font-bold flex-shrink-0">
                        +{DELIVERY_FEE} {isArabic ? 'ر.ق' : 'QR'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Totals */}
                <div className="px-6 py-4 border-t border-white/5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span className="text-white">{subtotal} {isArabic ? 'ر.ق' : 'QR'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">{isArabic ? 'التوصيل' : 'Delivery'}</span>
                    <span className={deliveryFee === 0 ? 'text-green-400' : 'text-white'}>
                      {deliveryFee === 0 ? (isArabic ? 'مجاناً' : 'FREE') : `${deliveryFee} ${isArabic ? 'ر.ق' : 'QR'}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-white/10">
                    <span className="text-white">{isArabic ? 'الإجمالي' : 'Total'}</span>
                    <span className="text-gold text-lg">{total} {isArabic ? 'ر.ق' : 'QR'}</span>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={handleProceedToDetails}
                    className="w-full py-3.5 rounded-xl bg-crimson text-white font-bold text-sm
                               flex items-center justify-center gap-2 hover:bg-crimson-light
                               transition-all active:scale-[0.98]"
                  >
                    {isArabic ? 'التالي' : 'Next'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 2: Customer details ── */}
            {step === 'details' && (
              <>
                <div className="px-6 py-5 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                      {isArabic ? 'الاسم' : 'Name'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
                      placeholder={isArabic ? 'أدخل اسمك' : 'Enter your name'}
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm
                                  placeholder-white/20 outline-none transition-colors
                                  focus:border-gold ${errors.name ? 'border-crimson' : 'border-white/10'}`}
                    />
                    {errors.name && <p className="text-crimson text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                      {isArabic ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: '' })); }}
                      placeholder={isArabic ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                      className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm
                                  placeholder-white/20 outline-none transition-colors
                                  focus:border-gold ${errors.phone ? 'border-crimson' : 'border-white/10'}`}
                    />
                    {errors.phone && <p className="text-crimson text-xs mt-1">{errors.phone}</p>}
                  </div>

                  {/* Delivery-only fields */}
                  {deliveryOption === 'delivery' && (
                    <>
                      {/* Location */}
                      <div>
                        <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                          {isArabic ? 'الموقع' : 'Location'}
                        </label>

                        {locationStatus === 'idle' && (
                          <button
                            type="button"
                            onClick={detectLocation}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border
                                        text-sm font-semibold transition-all
                                        ${errors.location ? 'border-crimson text-crimson' : 'border-white/20 text-white/70 hover:border-gold hover:text-gold'}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {isArabic ? 'تحديد موقعي الحالي' : 'Detect My Location'}
                          </button>
                        )}

                        {locationStatus === 'loading' && (
                          <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-white/40 text-sm">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            {isArabic ? 'جاري تحديد الموقع...' : 'Detecting location...'}
                          </div>
                        )}

                        {locationStatus === 'error' && (
                          <div className="space-y-2">
                            <p className="text-crimson text-xs px-1">
                              {isArabic
                                ? 'تعذّر تحديد الموقع. يرجى السماح بالوصول إلى الموقع.'
                                : 'Could not detect location. Please allow location access.'}
                            </p>
                            <button
                              type="button"
                              onClick={detectLocation}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-crimson/50 text-crimson text-sm font-semibold hover:border-crimson transition-all"
                            >
                              {isArabic ? 'حاول مجدداً' : 'Try Again'}
                            </button>
                          </div>
                        )}

                        {locationStatus === 'found' && locationCoords && (
                          <div className="space-y-2">
                            <div className="rounded-xl overflow-hidden border border-white/10" style={{ height: 180 }}>
                              <iframe
                                title="delivery-location"
                                width="100%"
                                height="180"
                                style={{ border: 0 }}
                                loading="lazy"
                                src={`https://www.google.com/maps?q=${locationCoords.lat},${locationCoords.lng}&z=16&output=embed`}
                              />
                            </div>
                            <p className="text-white/60 text-xs px-1 leading-relaxed">{locationAddress}</p>
                            <button
                              type="button"
                              onClick={detectLocation}
                              className="text-gold/60 hover:text-gold text-xs transition-colors"
                            >
                              {isArabic ? '↻ تحديث الموقع' : '↻ Re-detect'}
                            </button>
                          </div>
                        )}

                        {errors.location && locationStatus !== 'found' && (
                          <p className="text-crimson text-xs mt-1">{errors.location}</p>
                        )}
                      </div>

                      {/* Payment method */}
                      <div>
                        <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                          {isArabic ? 'طريقة الدفع' : 'Payment Method'}
                        </label>
                        <div className="flex flex-col gap-2">
                          {/* Cash */}
                          <button
                            onClick={() => setPaymentMethod('cash')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-start transition-all duration-200 ${
                              paymentMethod === 'cash' ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              paymentMethod === 'cash' ? 'border-gold' : 'border-white/30'
                            }`}>
                              {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                            </div>
                            <span className="text-white text-sm font-semibold">
                              {isArabic ? 'كاش أو فوران' : 'Cash or Fawran'}
                            </span>
                          </button>

                          {/* Card link */}
                          <button
                            onClick={() => setPaymentMethod('card')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-start transition-all duration-200 ${
                              paymentMethod === 'card' ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              paymentMethod === 'card' ? 'border-gold' : 'border-white/30'
                            }`}>
                              {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-white text-sm font-semibold">
                                {isArabic ? 'دفع بالبطاقة (رابط)' : 'Pay by Card (Link)'}
                              </p>
                              <p className="text-white/40 text-xs mt-0.5">
                                {isArabic ? 'سيتم إرسال رابط الدفع عبر الهاتف' : 'Payment link sent to your phone'}
                              </p>
                            </div>
                          </button>

                          {/* Pay later — only if total > 800 QAR */}
                          {total > PAY_LATER_THRESHOLD && (
                            <button
                              onClick={() => setPaymentMethod('pay_later')}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-start transition-all duration-200 ${
                                paymentMethod === 'pay_later' ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                paymentMethod === 'pay_later' ? 'border-gold' : 'border-white/30'
                              }`}>
                                {paymentMethod === 'pay_later' && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-white text-sm font-semibold">
                                  {isArabic ? 'ادفع لاحقاً' : 'Pay Later'}
                                </p>
                                <p className="text-white/40 text-xs mt-0.5">
                                  {isArabic ? 'متاح للطلبات فوق 800 ر.ق' : 'Available for orders above 800 QR'}
                                </p>
                              </div>
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Order summary */}
                  <div className="bg-white/5 rounded-xl px-4 py-3 flex justify-between items-center border border-white/10">
                    <span className="text-white/60 text-sm">{isArabic ? 'الإجمالي' : 'Total'}</span>
                    <span className="text-gold font-bold text-lg">{total} {isArabic ? 'ر.ق' : 'QR'}</span>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button
                    onClick={handleConfirm}
                    className="w-full py-3.5 rounded-xl bg-crimson text-white font-bold text-sm
                               flex items-center justify-center gap-2 hover:bg-crimson-light
                               transition-all active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isArabic ? 'تأكيد الطلب' : 'Confirm Order'}
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 3: Confirmed ── */}
            {step === 'confirmed' && (
              <div className="px-6 py-12 flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30
                                flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-xl">
                  {isArabic ? 'تم تأكيد طلبك!' : 'Order Confirmed!'}
                </h3>
                <p className="text-white/50 text-sm max-w-xs">
                  {deliveryOption === 'pickup'
                    ? (isArabic
                        ? 'يرجى التوجه إلى شيف الفريج المعمورة لاستلام طلبك'
                        : 'Please visit Chef Alfreej Maamoura to pick up your order')
                    : (isArabic
                        ? 'سيتم توصيل طلبك خلال 35-45 دقيقة تقريباً'
                        : 'Your order will be delivered in approx. 35-45 minutes')}
                </p>
                <p className="text-gold font-bold text-2xl mt-2">
                  {total} {isArabic ? 'ر.ق' : 'QR'}
                </p>
                <button
                  onClick={handleDone}
                  className="mt-4 px-8 py-3 rounded-xl bg-gold text-black font-bold text-sm
                             hover:bg-gold-light transition-all active:scale-[0.98]"
                >
                  {isArabic ? 'تم' : 'Done'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Checkout;
