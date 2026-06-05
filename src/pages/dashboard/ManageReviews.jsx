import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import StarRating from '../../components/StarRating';

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await api.get('/reviews/admin');
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const toggle = async (id) => {
    await api.patch(`/reviews/${id}/toggle`);
    setReviews((prev) => prev.map((r) => r._id === id ? { ...r, isVisible: !r.isVisible } : r));
  };

  const remove = async (id) => {
    if (!confirm('حذف هذا التقييم؟')) return;
    await api.delete(`/reviews/${id}`);
    setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  const filtered = reviews.filter((r) => {
    if (filter === 'visible') return r.isVisible;
    if (filter === 'hidden') return !r.isVisible;
    if (filter === 'general') return !r.product;
    if (filter === 'product') return !!r.product;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">التقييمات</h1>
        <span className="text-sm text-gray-400">{reviews.length} تقييم</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {[
          { key: 'all', label: 'الكل' },
          { key: 'visible', label: '👁 ظاهر' },
          { key: 'hidden', label: '🙈 مخفي' },
          { key: 'general', label: '🏪 المكان' },
          { key: 'product', label: '🍽 منتج' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${filter === t.key ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/40'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">لا توجد تقييمات</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${r.isVisible ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{r.name}</p>
                    {r.phone && <p className="text-xs text-gray-400">{r.phone}</p>}
                    {r.product && (
                      <span className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full font-semibold">
                        {r.product.name}
                      </span>
                    )}
                  </div>
                  <StarRating value={r.rating} size="sm" />
                  {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                  <p className="text-xs text-gray-300 mt-1">{new Date(r.createdAt).toLocaleDateString('ar-EG')}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => toggle(r._id)}
                    title={r.isVisible ? 'إخفاء' : 'إظهار'}
                    className={`p-2 rounded-xl transition-colors ${r.isVisible ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                  >
                    {r.isVisible ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => remove(r._id)}
                    className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
