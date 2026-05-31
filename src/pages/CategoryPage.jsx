import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { staggerContainer, categoryGradient } from '../utils/animations';
import { assetUrl } from '../lib/asset';

export default function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeSub, setActiveSub] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    Promise.all([
      api.get(`/categories/${id}`),
      api.get(`/subcategories?categoryId=${id}`),
      api.get(`/products?categoryId=${id}`),
    ]).then(([cat, subs, prods]) => {
      setCategory(cat.data);
      setSubCategories(subs.data);
      setProducts(prods.data);
      setActiveSub('all');
      setLoading(false);
    });
  }, [id]);

  const filtered = activeSub === 'all' ? products : products.filter((p) => p.subCategory?._id === activeSub);
  const gradient = categoryGradient(category?.name || '');

  return (
    <div className="min-h-screen bg-primary-light">
      <Navbar />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`bg-gradient-to-br ${gradient} text-white`}
      >
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-3">
          <Link to="/" className="shrink-0 p-2 rounded-xl bg-primary-light/20 hover:bg-primary-light/30 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="shrink-0">
            {category?.image ? (
              <img src={assetUrl(category.image)} alt={category?.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover shadow-lg ring-2 ring-white/30" />
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-light/20 flex items-center justify-center text-2xl sm:text-3xl shadow-lg">🍽️</div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-black truncate">{category?.name || '...'}</h1>
            {category?.nameAr && <p className="opacity-70 text-sm truncate">{category.nameAr}</p>}
            <p className="text-sm opacity-60 mt-0.5">{products.length} طبق</p>
          </div>
        </div>
      </motion.div>

      <main className="max-w-6xl mx-auto px-4 pb-20">
        {/* Subcategory tabs */}
        {subCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          >
            {['all', ...subCategories.map((s) => s._id)].map((subId) => {
              const sub = subCategories.find((s) => s._id === subId);
              const label = subId === 'all' ? 'الكل' : sub?.name;
              const isActive = activeSub === subId;
              return (
                <motion.button
                  key={subId}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setActiveSub(subId)}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    isActive ? 'text-white' : 'bg-primary-light text-gray-600 card-shadow'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeSub"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Grid */}
        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <p className="text-6xl mb-4">🍽️</p>
              <p className="text-gray-400 font-medium">لا توجد أطباق في هذه الفئة</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSub}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
              >
                {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
