import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import ArabesquePattern from './ArabesquePattern';

const WHATSAPP_NUMBER = '97474466445';

const BookingForm = () => {
  const { isArabic } = useLanguage();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: '',
    guests: '',
    notes: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = isArabic
      ? `*حجز عزيمة جديد*%0A` +
        `الاسم: ${form.name}%0A` +
        `الهاتف: +974${form.phone}%0A` +
        `التاريخ: ${form.date}%0A` +
        `عدد الضيوف: ${form.guests}%0A` +
        `طلبات خاصة: ${form.notes || 'لا يوجد'}`
      : `*New Booking Request*%0A` +
        `Name: ${form.name}%0A` +
        `Phone: +974${form.phone}%0A` +
        `Date: ${form.date}%0A` +
        `Guests: ${form.guests}%0A` +
        `Special Requests: ${form.notes || 'None'}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section
      id="booking"
      aria-labelledby="booking-title"
      className="py-20 px-4 bg-black relative overflow-hidden"
    >
      <ArabesquePattern color="#C8963E" opacity={0.04} />

      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-10"
        >
          <span className="text-crimson text-xs font-semibold tracking-[0.2em] uppercase">
            {isArabic ? 'طلبات خاصة' : 'Special Orders'}
          </span>
          <h2
            id="booking-title"
            className="text-3xl md:text-4xl font-bold text-gold mt-2 leading-tight"
          >
            {isArabic ? 'احجز عزيمتك' : 'Book Your Feast'}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4 text-white/50 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
              <path strokeLinecap="round" strokeWidth={1.5} d="M12 6v6l4 2" />
            </svg>
            <span>{isArabic ? 'يتطلب حجز مسبق قبل 24 ساعة' : 'Requires 24-hour advance booking'}</span>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 space-y-5"
        >
          {/* Row 1: Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-2">
                {isArabic ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder={isArabic ? 'اسمك' : 'Your name'}
                className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3
                           text-white text-sm placeholder:text-white/25
                           focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-2">
                {isArabic ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={isArabic ? 'رقم الهاتف' : 'Phone number'}
                  className="w-full bg-[#111111] border border-white/10 rounded-xl pe-4 ps-16 py-3
                             text-white text-sm placeholder:text-white/25
                             focus:outline-none focus:border-gold/50 transition-colors"
                />
                <span className="absolute top-1/2 -translate-y-1/2 start-4 text-white/40 text-sm pointer-events-none">
                  +974
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Date + Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-2">
                <svg className="w-3.5 h-3.5 inline-block me-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={1.5} />
                  <path strokeWidth={1.5} d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {isArabic ? 'تاريخ المناسبة' : 'Event Date'}
              </label>
              <input
                type="date"
                name="date"
                required
                value={form.date}
                onChange={handleChange}
                className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3
                           text-white text-sm
                           focus:outline-none focus:border-gold/50 transition-colors
                           [color-scheme:dark]"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-white/60 text-xs font-medium mb-2">
                <svg className="w-3.5 h-3.5 inline-block me-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {isArabic ? 'عدد الضيوف' : 'Number of Guests'}
              </label>
              <input
                type="number"
                name="guests"
                required
                min="1"
                value={form.guests}
                onChange={handleChange}
                placeholder={isArabic ? 'مثال: 30' : 'e.g. 30'}
                className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3
                           text-white text-sm placeholder:text-white/25
                           focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-white/60 text-xs font-medium mb-2">
              {isArabic ? 'طلبات خاصة' : 'Special Requests'}
            </label>
            <textarea
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              placeholder={isArabic ? 'أي متطلبات غذائية أو تفضيلات...' : 'Any dietary requirements or preferences...'}
              className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3
                         text-white text-sm placeholder:text-white/25 resize-none
                         focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-crimson text-white font-bold text-base
                       hover:bg-crimson-light transition-all duration-200
                       active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.214l-.252-.156-2.905.863.863-2.905-.156-.252A8 8 0 1112 20z" />
            </svg>
            {isArabic ? 'إرسال طلب الحجز' : 'Send Booking Request'}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default BookingForm;
