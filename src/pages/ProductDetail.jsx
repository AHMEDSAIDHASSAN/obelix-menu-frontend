import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { staggerContainer, cardVariant, categoryGradient, getFoodEmoji } from '../utils/animations';
import { assetUrl } from '../lib/asset';

function SizeButton({ size, selected, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-colors border-2 ${
        selected ? 'border-primary text-white' : 'border-gray-200 text-gray-600 hover:border-primary/50'
      }`}
    >
      {selected && (
        <motion.span
          layoutId="sizeActive"
          className="absolute inset-0 bg-primary rounded-full"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{size.label}</span>
      <span className={`relative z-10 ml-2 ${selected ? 'text-white/80' : 'text-primary'}`}>
        {size.price.toFixed(2)} ج.م
      </span>
    </motion.button>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
      if (data.sizes?.length) setSelectedSize(data.sizes[0]);
      if (data.category?._id) {
        api.get(`/products?categoryId=${data.category._id}`).then(({ data: sims }) =>
          setSimilar(sims.filter((p) => p._id !== id).slice(0, 6))
        );
      }
    });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFFBF0]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4 animate-pulse">
          <div className="h-72 rounded-3xl bg-gray-200" />
          <div className="bg-white rounded-3xl p-6 space-y-3">
            <div className="h-6 bg-gray-200 rounded-full w-2/3" />
            <div className="h-4 bg-gray-100 rounded-full w-1/3" />
            <div className="h-8 bg-gray-200 rounded-full w-1/4 mt-4" />
          </div>
        </div>
      </div>
    );
  }

  const finalPrice = selectedSize
    ? selectedSize.price
    : product.discount > 0
    ? product.basePrice - (product.basePrice * product.discount) / 100
    : product.basePrice;

  const gradient = categoryGradient(product.category?.name || '');
  const emoji = getFoodEmoji(product.name, product.category?.name);
  const DESC_LIMIT = 200;
  const desc = product.description || '';

  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pb-20">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-4"
        >
          <Link
            to={product.category ? `/category/${product.category._id}` : '/'}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            {product.category?.name || 'رجوع'}
          </Link>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-4 rounded-3xl overflow-hidden aspect-video max-h-80"
        >
          {product.image ? (
            <img src={assetUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <span className="text-8xl drop-shadow-lg">{emoji}</span>
            </div>
          )}
        </motion.div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-white rounded-3xl mt-4 p-6 card-shadow"
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-black text-gray-900 leading-tight">{product.name}</h1>
              {product.nameAr && <p className="text-gray-400 mt-0.5">{product.nameAr}</p>}
            </div>
            <div className="text-right shrink-0">
              <AnimatePresence mode="wait">
                <motion.p
                  key={finalPrice}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="text-3xl font-black text-primary"
                >
                  {finalPrice.toFixed(2)} ج.م
                </motion.p>
              </AnimatePresence>
              {product.discount > 0 && !selectedSize && (
                <p className="text-gray-300 line-through text-sm">{product.basePrice.toFixed(2)} ج.م</p>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            {product.category && (
              <Link
                to={`/category/${product.category._id}`}
                className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                {product.category.name}
              </Link>
            )}
            {product.subCategory && (
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                {product.subCategory.name}
              </span>
            )}
            {product.discount > 0 && (
              <span className="bg-red-50 text-red-500 text-xs font-black px-3 py-1 rounded-full">
                خصم {product.discount}%
              </span>
            )}
          </div>

          {/* Description */}
          {desc && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <p className="text-gray-500 text-sm leading-relaxed">
                {expanded || desc.length <= DESC_LIMIT ? desc : desc.slice(0, DESC_LIMIT) + '...'}
              </p>
              {desc.length > DESC_LIMIT && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-primary text-sm font-bold mt-1 hover:underline"
                >
                  {expanded ? 'أقل' : 'اقرأ المزيد'}
                </button>
              )}
            </motion.div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-5"
            >
              <p className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">الحجم</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <SizeButton
                    key={s.label}
                    size={s}
                    selected={selectedSize?.label === s.label}
                    onClick={() => setSelectedSize(s)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="mt-4 flex gap-1.5 flex-wrap">
              {product.tags.map((t) => (
                <span key={t} className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Similar */}
        {similar.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="text-lg font-black text-gray-900 mb-4">أطباق مشابهة</h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {similar.map((p) => <ProductCard key={p._id} product={p} />)}
            </motion.div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
