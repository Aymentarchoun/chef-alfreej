import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { menuItems as baseMenuItems, mainSections } from '../data/menuData';
import { useLanguage } from '../hooks/useLanguage';
import { useCart } from '../context/CartContext';
import { getAvailability, getOverrides, getAdditions } from '../admin/utils/storage';

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1 },
};

const containerVariants = {
  show: { transition: { staggerChildren: 0.06 } },
};

// Warm gradient palettes per subcategory for placeholder images
const subcategoryGradients: Record<string, string> = {
  slaughter:       'linear-gradient(160deg, #111111 0%, #2D1A00 50%, #C8963E 100%)',
  'azeema-fish':   'linear-gradient(160deg, #0A0A1A 0%, #15203D 50%, #2D4C8D 100%)',
  'azeema-chicken':'linear-gradient(160deg, #1A1A1A 0%, #3D2800 50%, #C8803E 100%)',
  'royal-trays':   'linear-gradient(160deg, #111111 0%, #2D1A00 50%, #C8963E 100%)',
  meals:           'linear-gradient(160deg, #1A0A0A 0%, #3D1515 50%, #6E2020 100%)',
  seafood:         'linear-gradient(160deg, #0A0A1A 0%, #15203D 50%, #2D4C8D 100%)',
  hmasat:          'linear-gradient(160deg, #1A1508 0%, #3D2800 50%, #C8803E 100%)',
  appetizers:      'linear-gradient(160deg, #0A1A0A 0%, #1A3D1A 50%, #2D5C2D 100%)',
  trays:           'linear-gradient(160deg, #1A1A1A 0%, #3D1520 50%, #8D1B3D 100%)',
  sweets:          'linear-gradient(160deg, #1A0A15 0%, #3D1530 50%, #8D3070 100%)',
  'chef-buffet':   'linear-gradient(160deg, #1A0A20 0%, #35154D 50%, #6B2FA0 100%)',
  'alfreej-buffet':'linear-gradient(160deg, #1A0A20 0%, #35154D 50%, #6B2FA0 100%)',
  'vip-buffet':    'linear-gradient(160deg, #1A0A20 0%, #35154D 50%, #6B2FA0 100%)',
  default:         'linear-gradient(160deg, #111111 0%, #2D1A00 50%, #C8963E 100%)',
};

const deliveryPlatforms = [
  { name: 'سنونو',  nameEn: 'Snoonu',  href: 'https://snoonu.com/restaurants/chef-alfreej' },
  { name: 'طلبات',  nameEn: 'Talabat', href: 'https://www.talabat.com/qatar/restaurant/738463/chef-alfreej?aid=1635' },
  { name: 'رفيق',   nameEn: 'Rafeeq',  href: 'https://www.gorafeeq.com/en/home/restaurants/chef-alfreej-19191' },
  { name: 'كيتا',   nameEn: 'Keeta',   href: 'https://url-eu.mykeeta.com/OcHQ5Mjz' },
];

const ExternalLinkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const BUFFET_MIN_GUESTS = 15;

const Menu: React.FC = () => {
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const { addItem } = useCart();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [buffetGuests, setBuffetGuests] = useState(BUFFET_MIN_GUESTS);

  // Apply admin overrides, custom additions and availability
  const menuItems = useMemo(() => {
    const availability = getAvailability();
    const overrides    = getOverrides();
    const additions    = getAdditions();

    const base = baseMenuItems
      .filter(i => availability[i.id] !== false)
      .map(i => {
        const ov = overrides[i.id] ?? {};
        return {
          ...i,
          ...ov,
          promoPrice: ov.promoPrice === null ? undefined : (ov.promoPrice ?? i.promoPrice),
        };
      });

    const custom = additions.filter(i => availability[i.id] !== false);
    return [...base, ...custom];
  }, []);

  const currentSection = mainSections.find((s) => s.key === activeSection);

  const filteredItems = activeSubcategory
    ? menuItems.filter((item) => item.subcategory === activeSubcategory)
    : activeSection
    ? menuItems.filter((item) => item.category === activeSection)
    : [];

  const handleSectionClick = (sectionKey: string) => {
    const section = mainSections.find((s) => s.key === sectionKey);

    // Special Orders → scroll to booking section
    if (section?.isLink && section.linkTarget) {
      const el = document.querySelector(`#${section.linkTarget}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (activeSection === sectionKey) {
      setActiveSection(null);
      setActiveSubcategory(null);
    } else {
      setActiveSection(sectionKey);
      setActiveSubcategory(section?.subcategories[0]?.key ?? null);
    }
  };

  const handleSubcategoryClick = (subKey: string) => {
    setActiveSubcategory(activeSubcategory === subKey ? null : subKey);
  };

  const formatPriceBadge = (price: number | 'market', promoPrice?: number) => {
    if (price === 'market') return null;
    const displayPrice = promoPrice ?? price;
    return (
      <span className="absolute top-2 start-2 sm:top-3 sm:start-3 z-10 bg-gold text-black text-[10px] sm:text-xs font-bold
                       px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg shadow-lg">
        {t('menu.qr')} {displayPrice}
      </span>
    );
  };

  // Color classes for section buttons
  const sectionButtonStyles: Record<string, { active: string; inactive: string; text: string }> = {
    azeema: {
      active: 'bg-gold text-black shadow-lg shadow-gold/30',
      inactive: 'border-gold/30 text-gold hover:bg-gold/10',
      text: 'text-gold',
    },
    daily: {
      active: 'bg-crimson text-white shadow-lg shadow-crimson/30',
      inactive: 'border-crimson/30 text-crimson hover:bg-crimson/10',
      text: 'text-crimson',
    },
    buffets: {
      active: 'bg-purple-600 text-white shadow-lg shadow-purple-600/30',
      inactive: 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10',
      text: 'text-purple-400',
    },
    special: {
      active: 'bg-gray-400 text-black shadow-lg shadow-gray-400/30',
      inactive: 'border-gray-400/30 text-gray-400 hover:bg-gray-400/10',
      text: 'text-gray-400',
    },
  };

  return (
    <section
      id="menu"
      aria-labelledby="menu-title"
      className="py-20 px-4 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-10"
        >
          <h2 id="menu-title" className="text-3xl md:text-4xl font-bold text-gold leading-tight">
            {t('menu.title')}
          </h2>
          <div className="w-16 h-0.5 bg-crimson mx-auto my-4" />
          <p className="text-white/50 text-base">{t('menu.subtitle')}</p>
        </motion.div>

        {/* ── 4 Main Section Buttons ─────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {mainSections.map((section) => {
            const isActive = activeSection === section.key;
            const styles = sectionButtonStyles[section.key];
            return (
              <motion.button
                key={section.key}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSectionClick(section.key)}
                className={`
                  relative flex flex-col items-center justify-center gap-2 py-5 px-4 rounded-2xl
                  border-2 font-bold text-sm transition-all duration-300
                  ${isActive ? styles.active : styles.inactive}
                  ${section.isLink ? 'border-dashed' : ''}
                `}
              >
                <span className="text-3xl" aria-hidden="true">{section.icon}</span>
                <span className="text-base font-bold">
                  {isArabic ? section.nameAr : section.nameEn}
                </span>
                {section.isLink && (
                  <span className="text-[10px] opacity-60">
                    {isArabic ? 'انتقل للطلب' : 'Go to order'}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Delivery platforms row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <span className="text-white/40 text-sm">
            {isArabic ? 'اطلب عبر' : 'Order via'}
          </span>
          {deliveryPlatforms.map((platform) => (
            <a
              key={platform.nameEn}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/15
                         text-white/60 text-xs font-medium hover:border-gold/40 hover:text-gold
                         transition-all duration-200"
            >
              {isArabic ? platform.name : platform.nameEn}
              <ExternalLinkIcon />
            </a>
          ))}
        </div>

        {/* ── Subcategory Tabs ────────────────────────── */}
        <AnimatePresence mode="wait">
          {currentSection && currentSection.subcategories.length > 0 && (
            <motion.div
              key={`sub-${activeSection}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              {/* Buffet guest selector */}
              {activeSection === 'buffets' && (
                <div className="flex items-center justify-center gap-4 mb-4 bg-white/5 rounded-xl p-4 border border-purple-500/20">
                  <span className="text-white/60 text-sm font-medium">
                    {isArabic ? 'عدد الضيوف' : 'Number of Guests'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBuffetGuests(Math.max(BUFFET_MIN_GUESTS, buffetGuests - 1))}
                      className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center
                                 justify-center hover:bg-purple-600/40 transition-colors font-bold"
                    >
                      −
                    </button>
                    <span className="text-white font-bold text-lg w-10 text-center">{buffetGuests}</span>
                    <button
                      onClick={() => setBuffetGuests(buffetGuests + 1)}
                      className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center
                                 justify-center hover:bg-purple-600/40 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-white/30 text-xs">
                    ({isArabic ? `الحد الأدنى ${BUFFET_MIN_GUESTS}` : `Min ${BUFFET_MIN_GUESTS}`})
                  </span>
                </div>
              )}

              {/* Subcategory pills */}
              <div
                className="flex flex-wrap gap-2 pb-2 justify-start md:justify-center"
                role="tablist"
                aria-label={isArabic ? 'الأقسام الفرعية' : 'Subcategories'}
              >
                {currentSection.subcategories.map(({ key, nameAr, nameEn, icon }) => {
                  const isSubActive = activeSubcategory === key;
                  const styles = sectionButtonStyles[activeSection!];
                  return (
                    <button
                      key={key}
                      role="tab"
                      aria-selected={isSubActive}
                      onClick={() => handleSubcategoryClick(key)}
                      className={`
                        flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold
                        transition-all duration-200 whitespace-nowrap border
                        ${isSubActive
                          ? styles.active
                          : 'bg-transparent border-white/20 text-white/70 hover:border-white/30 hover:text-white'}
                      `}
                    >
                      <span className="text-sm" aria-hidden="true">{icon}</span>
                      {isArabic ? nameAr : nameEn}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Menu Grid ──────────────────────────────── */}
        <AnimatePresence mode="wait">
          {filteredItems.length > 0 && (
            <motion.div
              key={`${activeSection}-${activeSubcategory}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5"
              role="tabpanel"
            >
              {filteredItems.map((item) => (
                <motion.article
                  key={item.id}
                  variants={cardVariants}
                  layout
                  className="group bg-[#111111] rounded-2xl overflow-hidden border border-white/5
                             hover:border-gold/20 transition-all duration-300
                             hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5"
                >
                  {/* Image / placeholder */}
                  <div
                    className="relative h-32 sm:h-52 flex items-center justify-center overflow-hidden"
                    style={!item.image ? { background: subcategoryGradients[item.subcategory] ?? subcategoryGradients.default } : undefined}
                    aria-hidden="true"
                  >
                    {/* Real image */}
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover
                                   group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}

                    {/* Price badge */}
                    {formatPriceBadge(item.price, item.promoPrice)}

                    {/* Promo badge */}
                    {item.promoPrice !== undefined && (
                      <span className="absolute top-3 end-3 z-10 bg-crimson text-white text-[10px]
                                       font-bold px-2 py-0.5 rounded-full">
                        {t('menu.promoLabel')}
                      </span>
                    )}

                    {/* Emoji fallback (only when no image) */}
                    {!item.image && (
                      <span className="text-5xl sm:text-7xl select-none filter drop-shadow-2xl
                                       group-hover:scale-110 transition-transform duration-500">
                        {item.emoji}
                      </span>
                    )}

                    {/* Bottom gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#111111] to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-2.5 sm:p-4 pt-1.5 sm:pt-2 flex flex-col gap-1 sm:gap-2">
                    {/* Name */}
                    <h3 className="font-bold text-white text-xs sm:text-base leading-snug">
                      {isArabic ? item.nameAr : item.nameEn}
                    </h3>

                    {/* Description */}
                    <p className="text-white/40 text-[10px] sm:text-xs leading-relaxed line-clamp-2 hidden sm:block">
                      {isArabic ? item.descriptionAr : item.descriptionEn}
                    </p>

                    {/* Price line for market price or promo original */}
                    {item.price === 'market' ? (
                      <p className="text-gold/70 text-xs font-medium">{t('menu.marketPrice')}</p>
                    ) : item.promoPrice !== undefined ? (
                      <p className="text-white/30 text-xs">
                        <span className="line-through">{item.price} {t('menu.qr')}</span>
                      </p>
                    ) : null}

                    {/* Buffet: per person price */}
                    {activeSection === 'buffets' && item.price !== 'market' && (
                      <div className="bg-purple-600/10 border border-purple-500/20 rounded-lg px-3 py-2 text-xs">
                        <div className="flex justify-between text-white/60">
                          <span>{isArabic ? 'السعر للشخص' : 'Per person'}</span>
                          <span className="text-purple-400 font-bold">{item.price} {isArabic ? 'ر.ق' : 'QR'}</span>
                        </div>
                        <div className="flex justify-between text-white font-bold mt-1">
                          <span>{isArabic ? `الإجمالي (${buffetGuests} ضيف)` : `Total (${buffetGuests} guests)`}</span>
                          <span className="text-gold">{(item.price as number) * buffetGuests} {isArabic ? 'ر.ق' : 'QR'}</span>
                        </div>
                      </div>
                    )}

                    {/* Add to cart CTA */}
                    {item.price === 'market' ? (
                      <a
                        href="tel:+97470099945"
                        className="mt-1 sm:mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl
                                   bg-white/10 text-white/50 text-[10px] sm:text-sm font-bold
                                   hover:bg-white/15 transition-all duration-200"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {isArabic ? 'اتصل للسعر' : 'Call for Price'}
                      </a>
                    ) : (
                      <button
                        onClick={() => addItem(item)}
                        className="mt-1 sm:mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl
                                   bg-crimson text-white text-[10px] sm:text-sm font-bold
                                   hover:bg-crimson-light transition-all duration-200
                                   active:scale-[0.98]"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        {isArabic ? 'أضف للسلة' : 'Add to Cart'}
                      </button>
                    )}
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty / welcome state */}
        {!activeSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-white/20"
          >
            <p className="text-5xl mb-4">👆</p>
            <p className="text-base">
              {isArabic ? 'اختر قسم من الأعلى لتصفح القائمة' : 'Choose a section above to browse the menu'}
            </p>
          </motion.div>
        )}

        {activeSection && filteredItems.length === 0 && (
          <div className="text-center py-20 text-white/20">
            <p className="text-4xl mb-3">🍽️</p>
            <p>{isArabic ? 'لا توجد أصناف في هذا القسم حاليًا' : 'No items in this section yet'}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
