import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

function NumberRating({ value, onChange, label, labelAr }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-green-200/50 last:border-0">
      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide w-40 shrink-0">{label}</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-7 h-7 rounded-full text-xs font-black border-2 transition-all ${
              value === n
                ? 'bg-gray-900 text-white border-gray-900 scale-110'
                : 'bg-white text-gray-500 border-gray-300 hover:border-gray-600'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <span className="text-xs text-gray-500 w-28 text-left shrink-0 hidden sm:block">{labelAr}</span>
    </div>
  );
}

const defaultRatings = {
  foodVariety: null, foodQuality: null,
  drinksVariety: null, drinksQuality: null,
  welcomeService: null, employeeBehavior: null,
  cleanliness: null, serviceSpeed: null, music: null,
};

export default function ReviewForm({ productId = null, onSubmitted }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', phone: '', favoriteDate: '', dateOfVisit: '', tableNumber: '' });
  const [ratings, setRatings] = useState({ ...defaultRatings });
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setRating = (k, v) => setRatings((r) => ({ ...r, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return setError('الاسم مطلوب');
    setLoading(true);
    setError('');
    try {
      await api.post('/reviews', { ...form, ratings, comments, productId });
      setDone(true);
      setTimeout(() => {
        setOpen(false); setDone(false);
        setForm({ name: '', address: '', phone: '', favoriteDate: '', dateOfVisit: '', tableNumber: '' });
        setRatings({ ...defaultRatings }); setComments('');
        onSubmitted?.();
      }, 2500);
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
            className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/60 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="w-full max-w-md my-4 rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: 'radial-gradient(ellipse at 60% 20%, #4CBF42 0%, #2E8A28 100%)' }}
            >
              {done ? (
                <div className="p-12 text-center">
                  <p className="text-6xl mb-4">🎉</p>
                  <p className="text-2xl font-black text-white">THANK YOU!</p>
                  <p className="text-white/80 mt-1">شكراً على تقييمك</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Header */}
                  <div className="px-6 pt-6 pb-4 text-center relative">
                    <button type="button" onClick={() => setOpen(false)}
                      className="absolute top-4 left-4 text-white/60 hover:text-white text-2xl leading-none">×</button>
                    <h2 className="text-3xl font-black text-white drop-shadow" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}>
                      Guest feedback
                    </h2>
                  </div>

                  {/* Personal Info */}
                  <div className="mx-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      {[
                        { key: 'name', label: 'NAME', required: true },
                        { key: 'favoriteDate', label: 'FAVORIT DATE' },
                        { key: 'address', label: 'ADDRESS' },
                        { key: 'dateOfVisit', label: 'DATE OF VISIT' },
                        { key: 'phone', label: 'THE PHONE NUMBER' },
                        { key: 'tableNumber', label: 'TABLE NUMBER' },
                      ].map(({ key, label, required }) => (
                        <div key={key}>
                          <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-0.5">{label} :</p>
                          <input
                            value={form[key]}
                            onChange={(e) => setField(key, e.target.value)}
                            required={required}
                            className="w-full bg-transparent border-b border-white/50 text-white placeholder-white/40 text-xs py-0.5 focus:outline-none focus:border-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ratings */}
                  <div className="mx-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-3 space-y-0">
                    {/* FOOD */}
                    <p className="text-center font-black text-white text-sm tracking-widest mb-2">FOOD</p>
                    <NumberRating value={ratings.foodVariety} onChange={(v) => setRating('foodVariety', v)} label="THIS VARIETY OF THE MENU" labelAr="تنوع قائمة الطعام" />
                    <NumberRating value={ratings.foodQuality} onChange={(v) => setRating('foodQuality', v)} label="QUALITY OF FOOD" labelAr="جودة الطعام" />

                    {/* DRINKS */}
                    <p className="text-center font-black text-white text-sm tracking-widest mt-3 mb-2">DRINKS</p>
                    <NumberRating value={ratings.drinksVariety} onChange={(v) => setRating('drinksVariety', v)} label="THIS VARIETY OF THE MENU" labelAr="تنوع قائمة المشروبات" />
                    <NumberRating value={ratings.drinksQuality} onChange={(v) => setRating('drinksQuality', v)} label="QUALITY OF DRINKS" labelAr="جودة المشروبات" />

                    {/* SERVICE */}
                    <p className="text-center font-black text-white text-sm tracking-widest mt-3 mb-2">SERVICE</p>
                    <NumberRating value={ratings.welcomeService} onChange={(v) => setRating('welcomeService', v)} label="WELCOME AND RECEPTION" labelAr="الترحيب و الاستقبال" />
                    <NumberRating value={ratings.employeeBehavior} onChange={(v) => setRating('employeeBehavior', v)} label="EMPLOYEE BEHAVIOR" labelAr="سلوك الموظف" />
                    <NumberRating value={ratings.cleanliness} onChange={(v) => setRating('cleanliness', v)} label="CLEANLINESS OF THE PLACE" labelAr="نظافة المكان" />
                    <NumberRating value={ratings.serviceSpeed} onChange={(v) => setRating('serviceSpeed', v)} label="SPEED OF SERVICE" labelAr="سرعة الخدمة" />
                    <NumberRating value={ratings.music} onChange={(v) => setRating('music', v)} label="MUSIC" labelAr="الموسيقى" />
                  </div>

                  {/* Comments */}
                  <div className="mx-4 mb-3">
                    <p className="text-center font-black text-white text-sm tracking-widest mb-2">COMMENTS AND SUGGESTIONS</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-2 border border-white/30">
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={4}
                        className="w-full bg-transparent text-white placeholder-white/50 text-sm resize-none focus:outline-none p-2"
                        placeholder="اكتب تعليقاتك واقتراحاتك هنا..."
                      />
                    </div>
                  </div>

                  {error && <p className="mx-4 text-red-200 text-xs text-center mb-2">{error}</p>}

                  {/* Submit */}
                  <div className="px-4 pb-6">
                    <button type="submit" disabled={loading}
                      className="w-full bg-white text-primary font-black py-3 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-60 text-sm tracking-wide">
                      {loading ? 'جاري الإرسال...' : 'SUBMIT FEEDBACK'}
                    </button>
                    <div className="mt-4 flex justify-center">
                      <img src="/jewaar-logo.png" alt="Jewaar" className="h-10 w-auto" />
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
