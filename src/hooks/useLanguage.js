import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const toggleLanguage = useCallback(() => {
    i18n.changeLanguage(isArabic ? 'en' : 'ar');
  }, [i18n, isArabic]);

  return {
    isArabic,
    isRTL: isArabic,
    language: i18n.language,
    toggleLanguage,
  };
};
