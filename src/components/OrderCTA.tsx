import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import ArabesquePattern from './ArabesquePattern';

const deliveryPlatforms = [
  {
    nameAr: 'سنونو',
    nameEn: 'Snoonu',
    href: 'https://snoonu.com/restaurants/chef-alfreej',
    logo: '/logos/snoonu.png',
  },
  {
    nameAr: 'طلبات',
    nameEn: 'Talabat',
    href: 'https://www.talabat.com/qatar/restaurant/738463/chef-alfreej?aid=1635',
    logo: '/logos/talabat.png',
  },
  {
    nameAr: 'رفيق',
    nameEn: 'Rafeeq',
    href: 'https://www.gorafeeq.com/en/home/restaurants/chef-alfreej-19191',
    logo: '/logos/rafeeq.png',
  },
];

const badges = [
  { icon: '⚡', key: 'order.badge1' },
  { icon: '🌙', key: 'order.badge3' },
];

const OrderCTA: React.FC = () => {
  const { t } = useTranslation();
  const { isArabic } = useLanguage();

  return (
    <section
      id="order"
      aria-labelledby="order-title"
      className="relative py-24 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #000000 0%, #0A0A0A 50%, #000000 100%)' }}
    >
      <ArabesquePattern color="#C8963E" opacity={0.07} />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(200,150,62,0.1) 0%, transparent 70%)',
        }}
      />

      {/* Top / bottom accent lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-6"
        >
          {/* App icon */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl
                       border border-gold/30"
            style={{ background: 'linear-gradient(135deg, #C8963E 0%, #E0B060 100%)' }}
            aria-hidden="true"
          >
            🛵
          </div>

          {/* Title */}
          <div>
            <h2
              id="order-title"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-cream leading-tight"
            >
              {t('order.title')}
            </h2>
            <p className="text-gold mt-2 text-base font-medium">{t('order.subtitle')}</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-px bg-gold/40" />
            <span className="text-gold/60" aria-hidden="true">◆</span>
            <div className="w-12 h-px bg-gold/40" />
          </div>

          {/* Description */}
          <p className="text-cream/65 text-base md:text-lg leading-relaxed max-w-xl">
            {t('order.description')}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {badges.map(({ icon, key }) => (
              <span
                key={key}
                className="flex items-center gap-2 px-4 py-2 rounded-full
                           bg-white/5 border border-white/10 text-cream/70 text-sm"
              >
                <span aria-hidden="true">{icon}</span>
                {t(key)}
              </span>
            ))}
          </div>

          {/* Delivery platform logos */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-4">
            {deliveryPlatforms.map((platform) => (
              <motion.a
                key={platform.nameEn}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl
                           bg-white/5 border border-white/10 hover:border-gold/40
                           transition-all duration-200 group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg
                                flex items-center justify-center bg-white">
                  <img
                    src={platform.logo}
                    alt={platform.nameEn}
                    className="w-14 h-14 object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
                <span className="text-white/70 text-xs font-semibold group-hover:text-gold transition-colors">
                  {isArabic ? platform.nameAr : platform.nameEn}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OrderCTA;
