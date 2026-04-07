import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { useCart } from '../context/CartContext';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <img
    src="/logo.png"
    alt="Chef Alfreej"
    className={`object-contain ${className}`}
    loading="eager"
  />
);

const navLinks = [
  { key: 'nav.home',      href: '#home' },
  { key: 'nav.menu',      href: '#menu' },
  { key: 'nav.about',     href: '#about' },
  { key: 'nav.locations', href: '#locations' },
];

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL, isArabic, toggleLanguage } = useLanguage();
  const { itemCount, setCartOpen } = useCart();
  const [isScrolled, setIsScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: isScrolled ? 'rgba(0,0,0,0.92)' : 'transparent',
          boxShadow: isScrolled ? '0 2px 30px rgba(0,0,0,0.3)' : 'none',
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-sm"
        role="banner"
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
          aria-label={isArabic ? 'التنقل الرئيسي' : 'Main navigation'}
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={() => handleNavClick('#home')}
            className="flex items-center gap-2 group"
            aria-label={t('nav.logo')}
          >
            <Logo className="w-10 h-10 flex-shrink-0 rounded-full transition-transform group-hover:scale-110" />
            <span className="text-gold font-bold text-xl leading-none tracking-wide">
              {t('nav.logo')}
            </span>
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map(({ key, href }) => (
              <li key={key}>
                <button
                  onClick={() => handleNavClick(href)}
                  className="px-4 py-2 text-cream/80 hover:text-gold text-sm font-medium
                             transition-colors duration-200 rounded-lg hover:bg-white/5"
                >
                  {t(key)}
                </button>
              </li>
            ))}
          </ul>

          {/* Right cluster: Order + Language */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle */}
            <motion.button
              onClick={toggleLanguage}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 rounded-full border border-gold/40 text-gold text-xs
                         font-semibold tracking-wider hover:bg-gold hover:text-brown
                         transition-all duration-200"
              aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              {isArabic ? 'EN' : 'عر'}
            </motion.button>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-full
                         bg-gold/10 border border-gold/30 text-gold text-xs font-semibold
                         hover:bg-gold hover:text-black transition-all duration-200"
              aria-label={isArabic ? 'سلة المشتريات' : 'Shopping Cart'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5.6a1 1 0 00.9 1.4H17m-10 0a2 2 0 104 0m6 0a2 2 0 104 0" />
              </svg>
              {isArabic ? 'السلة' : 'Cart'}
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-crimson
                                 text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: Cart + Language + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gold hover:text-gold-light transition-colors"
              aria-label={isArabic ? 'سلة المشتريات' : 'Shopping Cart'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5.6a1 1 0 00.9 1.4H17m-10 0a2 2 0 104 0m6 0a2 2 0 104 0" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 w-4 h-4 rounded-full bg-crimson
                                 text-white text-[9px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-full border border-gold/40 text-gold text-xs font-semibold"
              aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              {isArabic ? 'EN' : 'عر'}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label={isArabic ? 'فتح القائمة' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="p-2 text-cream hover:text-gold transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} z-50 w-72
                          bg-brown flex flex-col p-6 shadow-2xl`}
              aria-label={isArabic ? 'قائمة الهاتف' : 'Mobile menu'}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Logo className="w-7 h-7" />
                  <span className="text-gold font-bold text-lg">{t('nav.logo')}</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 text-cream/60 hover:text-gold transition-colors"
                  aria-label={isArabic ? 'إغلاق' : 'Close'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col gap-1 flex-1">
                {navLinks.map(({ key, href }, i) => (
                  <motion.button
                    key={key}
                    initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 + 0.1 }}
                    onClick={() => handleNavClick(href)}
                    className="text-start px-4 py-3 text-cream/80 hover:text-gold
                               hover:bg-white/5 rounded-xl text-base font-medium transition-colors"
                  >
                    {t(key)}
                  </motion.button>
                ))}
              </nav>

              {/* Cart CTA */}
              <button
                className="btn-primary justify-center mt-4"
                onClick={() => { setMobileOpen(false); setCartOpen(true); }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5.6a1 1 0 00.9 1.4H17m-10 0a2 2 0 104 0m6 0a2 2 0 104 0" />
                </svg>
                {isArabic ? 'سلة المشتريات' : 'Shopping Cart'}
                {itemCount > 0 && ` (${itemCount})`}
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
