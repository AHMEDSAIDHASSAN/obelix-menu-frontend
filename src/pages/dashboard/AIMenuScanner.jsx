import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

export default function AIMenuScanner() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [items, setItems] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setItems(null);
    setError('');
    setSaved(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const scan = async () => {
    if (!image) return;
    setScanning(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('image', image);
      const { data } = await api.post('/ai/scan-menu', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setItems(data.items.map((item, i) => ({ ...item, _key: i, selected: true })));
    } catch (e) {
      setError(e.response?.data?.message || 'حدث خطأ أثناء المسح');
    } finally {
      setScanning(false);
    }
  };

  const updateItem = (key, field, value) => {
    setItems((prev) => prev.map((item) => item._key === key ? { ...item, [field]: value } : item));
  };

  const removeItem = (key) => setItems((prev) => prev.filter((item) => item._key !== key));

  const saveAll = async () => {
    const toSave = items.filter((i) => i.selected);
    if (!toSave.length) return;
    setSaving(true);
    try {
      const { data } = await api.post('/products/bulk', {
        products: toSave.map((i) => ({
          name: i.name,
          nameAr: i.nameAr,
          price: Number(i.price) || 0,
          description: i.description,
          sizes: i.sizes || [],
          category: selectedCat || undefined,
        })),
      });
      setSaved(true);
      setItems(null);
      setPreview(null);
      setImage(null);
    } catch (e) {
      setError(e.response?.data?.message || 'خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-black text-gray-900">🤖 مسح المنيو بالذكاء الاصطناعي</h1>
      </div>
      <p className="text-sm text-gray-400 mb-6">صوّر المنيو الورقي وسيقوم الذكاء الاصطناعي باستخراج جميع المنتجات تلقائياً</p>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 bg-green-50 text-green-700 rounded-2xl px-5 py-3 font-semibold text-sm">
          ✅ تم إضافة المنتجات بنجاح!
        </motion.div>
      )}

      {/* Upload area */}
      {!items && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current.click()}
          className="border-2 border-dashed border-primary/30 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/60 hover:bg-primary-light/30 transition-all"
        >
          {preview ? (
            <img src={preview} alt="menu" className="max-h-64 rounded-2xl object-contain shadow-md" />
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center text-3xl">📷</div>
              <p className="font-bold text-gray-700">اسحب صورة المنيو هنا أو اضغط للاختيار</p>
              <p className="text-sm text-gray-400">JPG, PNG — حد أقصى 10MB</p>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      )}

      {preview && !items && (
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button onClick={scan} disabled={scanning}
            className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {scanning ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                الذكاء الاصطناعي يحلل المنيو...
              </>
            ) : '🔍 ابدأ المسح'}
          </button>
          <button onClick={() => { setPreview(null); setImage(null); }}
            className="px-5 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors font-semibold">
            إلغاء
          </button>
        </div>
      )}

      {error && <p className="mt-4 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2">{error}</p>}

      {/* Results */}
      <AnimatePresence>
        {items && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-black text-gray-900">تم استخراج {items.length} منتج</h2>
                <p className="text-sm text-gray-400">راجع المنتجات وعدّل إن احتجت، ثم احفظ</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                {categories.length > 0 && (
                  <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">بدون فئة</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                )}
                <button onClick={() => { setItems(null); setPreview(null); setImage(null); }}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-semibold transition-colors">
                  مسح جديد
                </button>
                <button onClick={saveAll} disabled={saving || !items.some((i) => i.selected)}
                  className="px-5 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 text-sm">
                  {saving ? 'جاري الحفظ...' : `💾 حفظ ${items.filter((i) => i.selected).length} منتج`}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <motion.div key={item._key} layout
                  className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${item.selected ? 'border-primary/20' : 'border-gray-100 opacity-50'}`}>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" checked={item.selected} onChange={(e) => updateItem(item._key, 'selected', e.target.checked)}
                      className="mt-1 w-4 h-4 accent-primary shrink-0" />
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input value={item.name} onChange={(e) => updateItem(item._key, 'name', e.target.value)}
                        placeholder="اسم المنتج (EN)"
                        className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input value={item.nameAr} onChange={(e) => updateItem(item._key, 'nameAr', e.target.value)}
                        placeholder="اسم المنتج (AR)"
                        className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" dir="rtl" />
                      <input value={item.description} onChange={(e) => updateItem(item._key, 'description', e.target.value)}
                        placeholder="الوصف (اختياري)"
                        className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:col-span-2" />
                      {(!item.sizes || item.sizes.length === 0) && (
                        <div className="flex items-center gap-2">
                          <input type="number" value={item.price} onChange={(e) => updateItem(item._key, 'price', e.target.value)}
                            placeholder="السعر"
                            className="w-32 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                          <span className="text-sm text-gray-400">ج.م</span>
                        </div>
                      )}
                      {item.sizes && item.sizes.length > 0 && (
                        <div className="sm:col-span-2 flex flex-wrap gap-2">
                          {item.sizes.map((s, si) => (
                            <div key={si} className="flex items-center gap-1 bg-primary-light rounded-lg px-2 py-1">
                              <span className="text-xs font-semibold text-primary">{s.nameAr || s.name}</span>
                              <span className="text-xs text-gray-600">{s.price} ج.م</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => removeItem(item._key)} className="p-1.5 text-gray-300 hover:text-red-400 transition-colors shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
