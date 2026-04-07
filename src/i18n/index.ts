import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './ar.json';
import en from './en.json';

const savedLang = localStorage.getItem('chef-alfreej-lang') || 'ar';

// Set HTML attributes immediately to avoid flash
document.documentElement.lang = savedLang;
document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: savedLang,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('chef-alfreej-lang', lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  // Update meta title dynamically
  document.title = lng === 'ar' ? 'شيف الفريج | Chef Alfreej' : 'Chef Alfreej | شيف الفريج';
});

export default i18n;
