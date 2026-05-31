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
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-primary/95 backdrop-blur-md shadow-lg shadow-primary/20'
          : 'bg-gradient-to-l from-primary to-primary-dark'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-[4.5rem] flex items-center gap-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-white/30 group-hover:ring-white/60 transition-all shadow-md">
              <img
                src="/jewaar-logo.svg"
                alt="Jewaar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full bg-white/20 items-center justify-center">
                <span className="text-white text-xl font-black">J</span>
              </div>
            </div>
          </div>
          <div className="leading-none hidden sm:block">
            <p className="text-white font-black text-xl tracking-wide leading-none">Jewaar</p>
            <p className="text-white/65 text-[11px] font-medium mt-0.5 tracking-widest uppercase">Cafe & Restaurant</p>
          </div>
        </Link>

        {/* Desktop search */}
        {onSearch && (
          <div className="flex-1 max-w-md hidden sm:block mx-4">
            <div className="relative">
              <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={tr.searchPlaceholder}
                className="w-full pr-10 pl-4 py-2.5 rounded-full bg-white/15 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:bg-white/25 focus:border-white/40 transition-all"
              />
              <AnimatePresence>
                {query && (
                  <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleChange('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-lg leading-none">
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
          <button onClick={() => setSearchOpen(!searchOpen)} className="sm:hidden p-2 rounded-xl hover:bg-white/15 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}

        {/* Language toggle */}
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={toggle}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-bold hover:bg-white/25 transition-all shrink-0"
        >
          <span className={lang === 'en' ? 'text-white' : 'text-white/40'}>EN</span>
          <span className="text-white/30">|</span>
          <span className={lang === 'ar' ? 'text-white' : 'text-white/40'}>ع</span>
        </motion.button>

        <Link to="/dashboard" className="text-sm font-semibold text-white/70 hover:text-white transition-colors hidden sm:block whitespace-nowrap">
          {tr.dashboard}
        </Link>
      </div>

      {/* Mobile search bar */}
      <AnimatePresence>
        {searchOpen && onSearch && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="sm:hidden overflow-hidden px-4 pb-3">
            <div className="relative">
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input autoFocus value={query} onChange={(e) => handleChange(e.target.value)} placeholder={tr.searchPlaceholder}
                className="w-full pr-10 pl-4 py-2.5 rounded-full bg-white/15 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:bg-white/25" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
