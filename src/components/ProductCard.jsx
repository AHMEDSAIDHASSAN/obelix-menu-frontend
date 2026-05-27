import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cardVariant, categoryGradient, getFoodEmoji } from '../utils/animations';
import { useLang, pick } from '../context/LangContext';
import { assetUrl } from '../lib/asset';

export default function ProductCard({ product }) {
  const { lang, tr } = useLang();

  const finalPrice = product.discount > 0
    ? product.basePrice - (product.basePrice * product.discount) / 100
    : product.basePrice;

  const gradient = categoryGradient(product.category?.name || product.name);
  const emoji = getFoodEmoji(product.name, product.category?.name);
  const name = pick(product, 'name', lang);
  const catName = pick(product.category, 'name', lang);

  return (
    <motion.div variants={cardVariant} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link to={`/product/${product._id}`} className="group block bg-white rounded-2xl overflow-hidden card-shadow hover:card-shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          {product.image ? (
            <img src={assetUrl(product.image)} alt={name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <span className="text-5xl drop-shadow-sm">{emoji}</span>
            </div>
          )}
          {product.discount > 0 && (
            <div className="absolute top-2.5 right-2.5">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                className="block bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full shadow-sm">
                {tr.discount(product.discount)}
              </motion.span>
            </div>
          )}
          {product.isFeatured && (
            <div className="absolute top-2.5 left-2.5 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-sm">
              <span className="text-xs">⭐</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>
          {catName && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{catName}</p>}

          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-primary font-black text-base">{tr.currency(finalPrice.toFixed(2))}</span>
              {product.discount > 0 && (
                <span className="text-gray-300 line-through text-xs">{tr.currency(product.basePrice.toFixed(2))}</span>
              )}
            </div>
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
              <svg className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
