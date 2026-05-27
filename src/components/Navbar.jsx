import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LangContext';

export default function Navbar({ onSearch }) {
  const { lang, toggle, tr } = useLang();
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleChange = (val) => {
    setQuery(val);
    onSearch?.(val);
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'glass shadow-sm' : 'bg-[#FFFBF0]'}`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0 group">
          <img src="/logo.svg" alt="Obelix" className="h-9 w-auto group-hover:scale-105 transition-transform" />
        </Link>

        {/* Desktop search */}
        {onSearch && (
          <div className="flex-1 max-w-sm hidden sm:block">
            <div className="relative">
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={tr.searchPlaceholder}
                className="w-full pr-10 pl-4 py-2.5 rounded-full bg-white/80 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <AnimatePresence>
                {query && (
                  <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleChange('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">
                    ×
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="flex-1 sm:flex-none" />

        {/* Mobile search toggle */}
        {onSearch && (
          <button onClick={() => setSearchOpen(!searchOpen)} className="sm:hidden p-2 rounded-xl hover:bg-white/80 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}

        {/* Language toggle */}
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={toggle}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white card-shadow text-xs font-bold text-gray-700 hover:shadow-md transition-shadow shrink-0"
          aria-label="Toggle language"
        >
          <span className={lang === 'en' ? 'text-primary' : 'text-gray-400'}>EN</span>
          <span className="text-gray-300">|</span>
          <span className={lang === 'ar' ? 'text-primary' : 'text-gray-400'}>ع</span>
        </motion.button>

        <Link to="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors hidden sm:block">
          {tr.dashboard}
        </Link>
      </div>

      {/* Mobile search bar */}
      <AnimatePresence>
        {searchOpen && onSearch && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="sm:hidden overflow-hidden px-4 pb-3">
            <div className="relative">
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input autoFocus value={query} onChange={(e) => handleChange(e.target.value)} placeholder={tr.searchPlaceholder}
                className="w-full pr-10 pl-4 py-2.5 rounded-full bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
