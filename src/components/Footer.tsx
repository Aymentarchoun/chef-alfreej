import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <img
    src="/logo.png"
    alt="Chef Alfreej"
    className={`object-contain ${className}`}
    loading="lazy"
  />
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.214l-.252-.156-2.905.863.863-2.905-.156-.252A8 8 0 1112 20z" />
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" />
  </svg>
);

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/chef_alfreej.qa/', Icon: InstagramIcon },
  { label: 'WhatsApp', href: 'https://wa.me/97470099945', Icon: WhatsAppIcon },
  { label: 'TikTok', href: 'https://www.tiktok.com/@chefalfreej.qa', Icon: TikTokIcon },
];

const navLinks = [
  { key: 'nav.home',      href: '#home' },
  { key: 'nav.menu',      href: '#menu' },
  { key: 'nav.about',     href: '#about' },
  { key: 'nav.locations', href: '#locations' },
  { key: 'nav.orderNow',  href: 'https://snoonu.com/restaurants/chef-alfreej' },
];

const phoneNumbers = [
  { number: '+97470099945', labelAr: 'عزايم وبوفيهات', labelEn: 'Feasts & Buffets' },
  { number: '+97450090960', labelAr: 'شيف الفريج المعمورة', labelEn: 'Chef Alfreej Maamoura' },
  { number: '+97474466445', labelAr: 'الإدارة', labelEn: 'Management' },
];

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { isArabic } = useLanguage();

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-brown border-t border-gold/10" role="contentinfo">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand column */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <Logo className="w-12 h-12 rounded-full" />
            <span className="text-gold font-bold text-xl">{t('nav.logo')}</span>
          </div>
          <p className="text-cream/55 text-sm leading-relaxed max-w-xs">
            {t('footer.tagline')}
          </p>
          {/* Social links */}
          <div className="mt-6">
            <p className="text-cream/40 text-xs uppercase tracking-widest mb-3">
              {t('footer.followUs')}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10
                             flex items-center justify-center text-cream/50
                             hover:text-gold hover:border-gold/40 hover:bg-gold/10
                             transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-cream/80 font-semibold text-sm mb-4 uppercase tracking-widest">
            {t('footer.quickLinks')}
          </h3>
          <ul className="flex flex-col gap-2" role="list">
            {navLinks.map(({ key, href }) => (
              <li key={key}>
                {href.startsWith('#') ? (
                  <button
                    onClick={() => handleNavClick(href)}
                    className="text-cream/45 hover:text-gold text-sm transition-colors text-start"
                  >
                    {t(key)}
                  </button>
                ) : (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/45 hover:text-gold text-sm transition-colors"
                  >
                    {t(key)}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact — Phone numbers */}
        <div className="lg:col-span-2">
          <h3 className="text-cream/80 font-semibold text-sm mb-4 uppercase tracking-widest">
            {t('footer.contact')}
          </h3>
          <ul className="flex flex-col gap-3" role="list">
            {phoneNumbers.map(({ number, labelAr, labelEn }) => (
              <li key={number} className="flex items-center gap-3 text-sm">
                <span className="text-cream/30" aria-hidden="true">📞</span>
                <a href={`tel:${number}`} className="text-cream/60 hover:text-gold transition-colors font-medium">
                  {number}
                </a>
                <span className="text-cream/30">—</span>
                <span className="text-gold/60 text-xs">
                  {isArabic ? labelAr : labelEn}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 text-sm text-cream/45">
            <p className="flex items-center gap-2">
              <span aria-hidden="true">🏙️</span>
              {isArabic ? 'الدوحة، قطر' : 'Doha, Qatar'}
            </p>
            <p className="flex items-center gap-2">
              <span aria-hidden="true">🕓</span>
              {isArabic ? 'مفتوح حتى 4 صباحاً' : 'Open Until 4 AM'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center
                        justify-between gap-2 text-xs text-cream/30">
          <p>{t('footer.copyright')}</p>
          <p>{t('footer.builtWith')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
