import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ArabesquePattern from './ArabesquePattern';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0 },
};

const stagger = {
  show: { transition: { staggerChildren: 0.18 } },
};

const Hero = () => {
  const { t } = useTranslation();

  const scrollToMenu = () => {
    const el = document.querySelector('#menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      aria-label={t('hero.headline')}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      />

      {/* Dark overlay for text readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/50"
      />

      {/* Arabesque overlay */}
      <ArabesquePattern color="#C8963E" opacity={0.06} />

      {/* Top vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-6"
        >
          {/* Badge */}
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                       border border-gold/30 bg-gold/10 text-gold text-xs font-semibold
                       tracking-widest uppercase"
          >
            <span aria-hidden="true">✦</span>
            {t('about.badge')}
            <span aria-hidden="true">✦</span>
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream leading-tight"
          >
            {t('hero.headline')}
            <br />
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: '1px #C8963E',
                textShadow: '0 0 40px rgba(200,150,62,0.4)',
              }}
            >
              {t('hero.headlineAccent')}
            </span>
          </motion.h1>

          {/* Gold divider */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-px bg-gold/60" />
            <span className="text-gold text-lg" aria-hidden="true">◆</span>
            <div className="w-10 h-px bg-gold/60" />
          </motion.div>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="text-cream/70 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed"
          >
            {t('hero.subheadline')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-3 mt-2"
          >
            <button onClick={scrollToMenu} className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t('hero.ctaMenu')}
            </button>
            <a
              href="tel:+97470099945"
              className="flex items-center gap-2 px-6 py-3 rounded-full
                         border-2 border-gold/40 text-gold text-sm font-bold
                         hover:bg-gold hover:text-black transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t('hero.ctaCall')}
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-cream/40 text-xs tracking-widest uppercase">{t('hero.scrollDown')}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-cream/20 flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 bg-gold rounded-full" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #FAF6F0 0%, transparent 100%)' }}
      />
    </section>
  );
};

export default Hero;
