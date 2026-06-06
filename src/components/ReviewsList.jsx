import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const ratingLabels = {
  foodVariety: 'تنوع الطعام', foodQuality: 'جودة الطعام',
  drinksVariety: 'تنوع المشروبات', drinksQuality: 'جودة المشروبات',
  welcomeService: 'الترحيب', employeeBehavior: 'سلوك الموظف',
  cleanliness: 'النظافة', serviceSpeed: 'سرعة الخدمة', music: 'الموسيقى',
};

function MiniRating({ value }) {
  if (!value) return null;
  return (
    <span className="inline-flex items-center gap-0.5 bg-yellow-50 text-yellow-600 font-bold text-xs px-1.5 py-0.5 rounded-full">
      {value}<span className="text-yellow-400">★</span>
    </span>
  );
}

function avgRating(ratings) {
  if (!ratings) return null;
  const vals = Object.values(ratings).filter(Boolean);
  if (!vals.length) return null;
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}

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
        {reviews.map((r) => {
          const avg = avgRating(r.ratings);
          return (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                {avg && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className={`text-base ${s <= Math.round(avg) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                    <span className="text-xs font-bold text-gray-500 mr-1">({avg})</span>
                  </div>
                )}
              </div>
              {r.comments && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.comments}</p>}
              <p className="text-xs text-gray-300 mt-2">{new Date(r.createdAt).toLocaleDateString('ar-EG')}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
