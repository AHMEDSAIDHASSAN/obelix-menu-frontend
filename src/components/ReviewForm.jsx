import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import StarRating from './StarRating';

export default function ReviewForm({ productId = null, onSubmitted }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return setError('اختر عدد النجوم');
    setLoading(true);
    setError('');
    try {
      await api.post('/reviews', { name, phone, rating, comment, productId });
      setDone(true);
      setTimeout(() => { setOpen(false); setDone(false); setName(''); setPhone(''); setRating(0); setComment(''); onSubmitted?.(); }, 2000);
    } catch {
      setError('حدث خطأ، حاول مجدداً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-dark transition-colors"
      >
        <span>⭐</span>
        <span>{productId ? 'اكتب رأيك في الطبق' : 'اكتب تقييمك'}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              {done ? (
                <div className="text-center py-6">
                  <p className="text-5xl mb-3">🎉</p>
                  <p className="text-xl font-black text-gray-800">شكراً لتقييمك!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-black text-gray-900">{productId ? 'تقييم الطبق' : 'تقييم المكان'}</h3>
                    <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                  </div>

                  <div className="flex justify-center py-1">
                    <StarRating value={rating} onChange={setRating} size="lg" />
                  </div>

                  <input
                    value={name} onChange={(e) => setName(e.target.value)} required
                    placeholder="اسمك *"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <input
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="رقم الموبايل (اختياري)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <textarea
                    value={comment} onChange={(e) => setComment(e.target.value)}
                    placeholder="رأيك... (اختياري)"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                  />

                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                  <button
                    type="submit" disabled={loading}
                    className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60"
                  >
                    {loading ? 'جاري الإرسال...' : 'إرسال التقييم'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
