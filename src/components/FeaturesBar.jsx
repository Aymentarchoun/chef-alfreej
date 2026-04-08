import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const features = [
  {
    titleKey: 'features.item1Title',
    descKey:  'features.item1Desc',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 3v1m0 16v1M5.3 5.3l.7.7m11.3-.7l-.7.7M3 12h1m16 0h1M6 12a6 6 0 1112 0 6 6 0 01-12 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7v5l3 3" />
      </svg>
    ),
  },
  {
    titleKey: 'features.item2Title',
    descKey:  'features.item2Desc',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    titleKey: 'features.item3Title',
    descKey:  'features.item3Desc',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5.6a1 1 0 00.9 1.4H17m-10 0a2 2 0 104 0m6 0a2 2 0 104 0" />
      </svg>
    ),
  },
  {
    titleKey: 'features.item4Title',
    descKey:  'features.item4Desc',
    icon: (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

const FeaturesBar = () => {
  const { t } = useTranslation();

  return (
    <section
      aria-label="features"
      className="relative bg-brown py-12 px-4 overflow-hidden"
    >
      {/* Subtle arabesque accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-gold/20
                        rtl:divide-x-reverse">
          {features.map(({ titleKey, descKey, icon }, i) => (
            <motion.div
              key={titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center px-4 md:px-8 gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20
                              flex items-center justify-center text-gold flex-shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-cream font-bold text-sm md:text-base leading-snug">
                  {t(titleKey)}
                </p>
                <p className="text-cream/50 text-xs md:text-sm mt-1">
                  {t(descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
