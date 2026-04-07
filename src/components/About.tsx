import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import ArabesquePattern from './ArabesquePattern';

const stats = [
  { valueKey: 'about.stat1Value', labelKey: 'about.stat1Label', accent: true  },
  { valueKey: 'about.stat3Value', labelKey: 'about.stat3Label', accent: false },
  { valueKey: 'about.stat4Value', labelKey: 'about.stat4Label', accent: false },
];

const About: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="py-20 px-4 bg-brown overflow-hidden relative"
    >
      <ArabesquePattern color="#C8963E" opacity={0.06} />

      {/* Top & bottom decorative lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className={`${isRTL ? 'lg:order-2' : 'lg:order-1'}`}
          >
            <span className="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase">
              {t('about.title')}
            </span>
            <h2
              id="about-title"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-cream mt-3 leading-tight"
            >
              {t('about.subtitle')}
            </h2>

            <div className="flex items-center gap-3 my-5">
              <div className="w-10 h-px bg-gold/60" />
              <span className="text-gold" aria-hidden="true">◆</span>
              <div className="w-10 h-px bg-gold/60" />
            </div>

            <p className="text-cream/75 text-base leading-loose mb-4">
              {t('about.story1')}
            </p>
            <p className="text-cream/60 text-sm leading-loose">
              {t('about.story2')}
            </p>

            {/* Inline badge */}
            <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-xl
                            bg-gold/10 border border-gold/20">
              <span className="text-2xl" aria-hidden="true">🏆</span>
              <div>
                <p className="text-gold font-bold text-sm">{t('about.stat1Label')}</p>
                <p className="text-cream/60 text-xs">{t('about.stat1Value')} ★★★★★</p>
              </div>
            </div>
          </motion.div>

          {/* Stats / decorative side */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`${isRTL ? 'lg:order-1' : 'lg:order-2'}`}
          >
            {/* Decorative frame */}
            <div className="relative">
              {/* Gold frame box */}
              <div
                className="rounded-2xl border border-gold/20 p-8 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(200,150,62,0.05) 0%, rgba(0,0,0,0.6) 100%)' }}
              >
                <ArabesquePattern color="#C8963E" opacity={0.12} />

                {/* Central chef hat illustration */}
                <div className="relative z-10 flex flex-col items-center mb-8">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-4 overflow-hidden"
                    style={{ background: 'radial-gradient(circle, rgba(200,150,62,0.2) 0%, transparent 70%)' }}
                  >
                    <img src="/logo.png" alt="Chef Alfreej" className="w-20 h-20 object-contain" />
                  </div>
                  <p className="text-gold/80 text-sm text-center italic">
                    {t('about.badge')}
                  </p>
                </div>

                {/* Stats grid */}
                <div className="relative z-10 grid grid-cols-2 gap-4">
                  {stats.map(({ valueKey, labelKey, accent }) => (
                    <div
                      key={valueKey}
                      className={`text-center p-4 rounded-xl ${
                        accent
                          ? 'bg-gold/15 border border-gold/30'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <p className={`text-2xl font-bold ${accent ? 'text-gold' : 'text-cream'}`}>
                        {t(valueKey)}
                      </p>
                      <p className="text-cream/50 text-xs mt-1">{t(labelKey)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating accent dots */}
              <div
                aria-hidden="true"
                className="absolute -top-3 -end-3 w-12 h-12 rounded-full bg-gold/20
                           border border-gold/40 flex items-center justify-center text-gold text-xl"
              >
                ✦
              </div>
              <div
                aria-hidden="true"
                className="absolute -bottom-3 -start-3 w-8 h-8 rounded-full bg-terracotta/20
                           border border-terracotta/40"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
