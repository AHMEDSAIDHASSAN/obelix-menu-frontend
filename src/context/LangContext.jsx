import { createContext, useContext, useState } from 'react';

const LangContext = createContext(null);

export const t = {
  ar: {
    all: 'الكل',
    featured: '⭐ الأطباق المميزة',
    allDishes: 'جميع الأطباق',
    dishes: 'طبق',
    noDishes: 'لا توجد أطباق',
    searchPlaceholder: 'ابحث عن طبق...',
    searchResults: (q) => `نتائج "${q}"`,
    dashboard: 'لوحة التحكم',
    back: 'رجوع',
    size: 'الحجم',
    readMore: 'اقرأ المزيد',
    readLess: 'أقل',
    similarDishes: 'أطباق مشابهة',
    discount: (n) => `خصم ${n}%`,
    currency: (p) => `${p} ج.م`,
  },
  en: {
    all: 'All',
    featured: '⭐ Featured',
    allDishes: 'All Dishes',
    dishes: 'items',
    noDishes: 'No dishes found',
    searchPlaceholder: 'Search for a dish...',
    searchResults: (q) => `Results for "${q}"`,
    dashboard: 'Dashboard',
    back: 'Back',
    size: 'Size',
    readMore: 'Read More',
    readLess: 'Less',
    similarDishes: 'Similar Dishes',
    discount: (n) => `${n}% Off`,
    currency: (p) => `EGP ${p}`,
  },
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState('ar');
  const toggle = () => setLang((l) => (l === 'ar' ? 'en' : 'ar'));
  return (
    <LangContext.Provider value={{ lang, toggle, tr: t[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);

/** pick the right field: nameAr vs name */
export function pick(obj, field, lang) {
  if (!obj) return '';
  if (lang === 'ar') return obj[`${field}Ar`] || obj[field] || '';
  return obj[field] || obj[`${field}Ar`] || '';
}
