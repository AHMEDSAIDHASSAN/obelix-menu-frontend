import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import StarRating from './StarRating';

export default function ReviewsList({ productId = null, refreshKey }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const url = productId ? `/reviews?productId=${productId}` : '/reviews';
    api.get(url).then((r) => setReviews(r.data)).catch(() => {});
  }, [productId, refreshKey]);

  if (!reviews.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-black text-gray-900 mb-4">
        {productId ? `تقييمات الطبق (${reviews.length})` : `تقييمات العملاء (${reviews.length})`}
      </h3>
      <div className="space-y-3">
        {reviews.map((r) => (
          <motion.div
            key={r._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                {r.phone && <p className="text-xs text-gray-400">{r.phone}</p>}
              </div>
              <StarRating value={r.rating} size="sm" />
            </div>
            {r.comment && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.comment}</p>}
            <p className="text-xs text-gray-300 mt-2">{new Date(r.createdAt).toLocaleDateString('ar-EG')}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
