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
      style={{ background: 'radial-gradient(ellipse at 60% 50%, #4CBF42 0%, #2E8A28 100%)' }}
      className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center relative">

        {/* Right side */}
        <div className="flex items-center gap-2 z-10">
          {onSearch && (
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-xl hover:bg-white/15 transition-colors sm:hidden">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={toggle}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-xs font-bold hover:bg-white/25 transition-all shrink-0"
          >
            <span className={lang === 'en' ? 'text-white' : 'text-white/45'}>EN</span>
            <span className="text-white/30">|</span>
            <span className={lang === 'ar' ? 'text-white' : 'text-white/45'}>ع</span>
          </motion.button>
        </div>

        {/* Center Logo - absolutely centered */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          <Link to="/">
            <img
              src="/jewaar-logo.png"
              alt="Jewaar"
              className="h-12 w-auto object-contain"
              style={{ mixBlendMode: 'normal' }}
            />
          </Link>
        </div>

        {/* Left side */}
        <div className="flex-1 flex items-center justify-end gap-3 z-10">
          {/* Desktop search */}
          {onSearch && (
            <div className="relative hidden sm:block">
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={tr.searchPlaceholder}
                className="w-44 pr-9 pl-4 py-2 rounded-full bg-white/15 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:w-56 focus:bg-white/25 transition-all"
              />
              <AnimatePresence>
                {query && (
                  <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => handleChange('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-lg leading-none">
                    ×
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
          <Link to="/dashboard" className="text-sm font-semibold text-white/70 hover:text-white transition-colors hidden sm:block whitespace-nowrap">
            {tr.dashboard}
          </Link>
        </div>
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
