import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

const Locations: React.FC = () => {
  const { isArabic } = useLanguage();

  return (
    <section
      id="locations"
      aria-labelledby="locations-title"
      className="py-20 px-4 bg-cream-dark"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-10"
        >
          <span className="text-crimson text-xs font-semibold tracking-[0.2em] uppercase">
            {isArabic ? 'موقعنا' : 'Our Location'}
          </span>
          <h2 id="locations-title" className="section-title mt-2">
            {isArabic ? 'شيف الفريج المعمورة' : 'Chef Alfreej Maamoura'}
          </h2>
          <div className="gold-divider" />
        </motion.div>

        {/* Google Maps embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-cream shadow-lg"
          style={{ height: '400px' }}
        >
          <iframe
            title={isArabic ? 'شيف الفريج المعمورة - الموقع' : 'Chef Alfreej Maamoura - Location'}
            src="https://maps.google.com/maps?q=Chef+Alfreej+Maamoura+Kitchen+%D8%B4%D9%8A%D9%81+%D8%A7%D9%84%D9%81%D8%B1%D9%8A%D8%AC+%D8%A7%D9%84%D9%85%D8%B9%D9%85%D9%88%D8%B1%D8%A9&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        {/* Get Directions button */}
        <div className="flex justify-center mt-6">
          <a
            href="https://maps.google.com/maps?q=Chef+Alfreej+Maamoura+Kitchen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                       border-2 border-gold/30 text-gold font-semibold text-sm
                       hover:bg-gold hover:text-black transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {isArabic ? 'احصل على الاتجاهات' : 'Get Directions'}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Locations;
