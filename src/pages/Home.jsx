import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { SkeletonCard, SkeletonBanner, SkeletonChips } from '../components/SkeletonCard';
import { staggerContainer, getFoodEmoji } from '../utils/animations';
import { useLang, pick } from '../context/LangContext';
import { assetUrl } from '../lib/asset';

/* ─── Offers Banner ─────────────────────────────────────── */
function OffersBanner({ offers }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (offers.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % offers.length), 4500);
    return () => clearInterval(t);
  }, [offers.length]);
  if (!offers.length) return null;
  const offer = offers[idx];
  return (
    <div className="relative rounded-3xl overflow-hidden select-none" style={{ background: offer.bgColor }}>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }} className="flex items-center justify-between px-7 py-8 md:py-10">
          <div className="text-white max-w-[55%]">
            {offer.discountPercent > 0 && (
              <motion.p initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200 }} className="text-5xl md:text-7xl font-black leading-none">
                {offer.discountPercent}%
              </motion.p>
            )}
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-xl md:text-2xl font-bold mt-1 leading-snug">
              {offer.titleAr || offer.title}
            </motion.p>
            {offer.description && <p className="text-sm mt-1 opacity-75">{offer.description}</p>}
          </div>
          <motion.div initial={{ scale: 0.6, rotate: -10, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 180 }} className="shrink-0">
            {offer.image
              ? <img src={assetUrl(offer.image)} alt={offer.title} className="w-28 h-28 md:w-40 md:h-40 object-cover rounded-full shadow-2xl ring-4 ring-white/30" />
              : <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/20 flex items-center justify-center text-6xl shadow-2xl">{getFoodEmoji(offer.title)}</div>
            }
          </motion.div>
        </motion.div>
      </AnimatePresence>
      {offers.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {offers.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── SubCategory chips ─────────────────────────────────── */
function SubCategoryChips({ subs, activeSub, onSelect }) {
  if (!subs.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide pt-3">
        <SubChip label="الكل" active={activeSub === 'all'} onClick={() => onSelect('all')} />
        {subs.map((s) => (
          <SubChip key={s._id} label={s.name} active={activeSub === s._id} onClick={() => onSelect(s._id)} />
        ))}
      </div>
    </motion.div>
  );
}

function SubChip({ label, active, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={`relative px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border-2 transition-colors ${
        active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
      }`}
    >
      {label}
    </motion.button>
  );
}

/* ─── Category Chip ─────────────────────────────────────── */
function CategoryChip({ cat, active, onClick }) {
  return (
    <motion.button whileTap={{ scale: 0.93 }} onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${active ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-800 border border-gray-200 shadow-sm hover:border-primary/40'}`}>
      {cat.image
        ? <img src={assetUrl(cat.image)} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
        : <span className="shrink-0">🍽️</span>
      }
      <span className="shrink-0">{cat.name}</span>
    </motion.button>
  );
}

/* ─── Home ──────────────────────────────────────────────── */
export default function Home() {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSub, setActiveSub] = useState('all');
  const [activeSubSub, setActiveSubSub] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subSubsLoading, setSubSubsLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/offers'), api.get('/categories'), api.get('/products')]).then(([o, c, p]) => {
      setOffers(o.data);
      setCategories(c.data);
      setProducts(p.data);
      setLoading(false);
    });
  }, []);

  const handleCategorySelect = async (catId) => {
    setActiveCategory(catId);
    setActiveSub('all');
    setActiveSubSub('all');
    setSubCategories([]);
    setSubSubCategories([]);
    if (catId !== 'all') {
      setSubsLoading(true);
      const { data } = await api.get(`/subcategories?categoryId=${catId}`);
      setSubCategories(data);
      setSubsLoading(false);
    }
  };

  const handleSubSelect = async (subId) => {
    setActiveSub(subId);
    setActiveSubSub('all');
    setSubSubCategories([]);
    if (subId !== 'all') {
      setSubSubsLoading(true);
      const { data } = await api.get(`/subsubcategories?subCategoryId=${subId}`);
      setSubSubCategories(data);
      setSubSubsLoading(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category?._id === activeCategory;
    const matchSub = activeSub === 'all' || p.subCategory?._id === activeSub;
    const matchSubSub = activeSubSub === 'all' || p.subSubCategory?._id === activeSubSub;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.nameAr?.includes(search);
    return matchCat && matchSub && matchSubSub && matchSearch;
  });

  const featured = products.filter((p) => p.isFeatured).slice(0, 8);
  const isSearching = !!search;
  const activeCatName = categories.find((c) => c._id === activeCategory)?.name;

  return (
    <div className="min-h-screen bg-primary-light">
      <Navbar onSearch={setSearch} />

      <main className="max-w-6xl mx-auto px-4 pb-20">

        {/* Offers */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5">
          {loading ? <SkeletonBanner /> : <OffersBanner offers={offers} />}
        </motion.section>

        {/* Category chips */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-5">
          {loading ? <SkeletonChips /> : (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {/* All */}
              <motion.button whileTap={{ scale: 0.93 }} onClick={() => handleCategorySelect('all')}
                className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === 'all' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-800 border border-gray-200 shadow-sm hover:border-primary/40'}`}>
                <span>🍽️ الكل</span>
              </motion.button>
              {categories.map((cat) => (
                <CategoryChip key={cat._id} cat={cat} active={activeCategory === cat._id} onClick={() => handleCategorySelect(cat._id)} />
              ))}
            </div>
          )}
        </motion.section>

        {/* SubCategory chips */}
        <AnimatePresence>
          {activeCategory !== 'all' && !isSearching && (
            <motion.section key="subs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {subsLoading ? (
                <div className="flex gap-2 mt-3">
                  {[60, 80, 70, 90].map((w, i) => (
                    <div key={i} className="h-7 rounded-full bg-gray-200 animate-pulse shrink-0" style={{ width: w }} />
                  ))}
                </div>
              ) : (
                <SubCategoryChips subs={subCategories} activeSub={activeSub} onSelect={handleSubSelect} />
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* SubSubCategory chips — appear after selecting a subcategory */}
        <AnimatePresence>
          {activeSub !== 'all' && !isSearching && (
            <motion.section key="subsubs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {subSubsLoading ? (
                <div className="flex gap-2 mt-2">
                  {[50, 70, 60].map((w, i) => (
                    <div key={i} className="h-6 rounded-full bg-gray-200 animate-pulse shrink-0" style={{ width: w }} />
                  ))}
                </div>
              ) : subSubCategories.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide pt-2">
                    <motion.button whileTap={{ scale: 0.93 }} onClick={() => setActiveSubSub('all')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${activeSubSub === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
                      الكل
                    </motion.button>
                    {subSubCategories.map((s) => (
                      <motion.button key={s._id} whileTap={{ scale: 0.93 }} onClick={() => setActiveSubSub(s._id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${activeSubSub === s._id ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
                        {s.name}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Featured — only on "All" */}
        <AnimatePresence>
          {!isSearching && activeCategory === 'all' && featured.length > 0 && !loading && (
            <motion.section key="featured" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: 0.25 }} className="mt-8">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-xl font-black text-gray-900">⭐ الأطباق المميزة</h2>
              </div>
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {featured.map((p) => <ProductCard key={p._id} product={p} />)}
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Products */}
        <section className="mt-8">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">
              {isSearching ? `نتائج "${search}"` : activeCategory === 'all' ? 'جميع الأطباق' : activeCatName}
            </h2>
            {!loading && <span className="text-sm text-gray-400 font-medium">{filtered.length} طبق</span>}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
              <p className="text-6xl mb-4">🍽️</p>
              <p className="text-gray-400 font-medium">لا توجد أطباق</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={activeCategory + activeSub + activeSubSub + search} variants={staggerContainer} initial="hidden" animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </main>
    </div>
  );
}
