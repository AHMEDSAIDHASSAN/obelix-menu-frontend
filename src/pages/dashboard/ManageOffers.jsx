import { useEffect, useState } from 'react';
import api from '../../api/axios';

const EMPTY = { title: '', titleAr: '', description: '', discountPercent: 0, bgColor: '#F5C518', isActive: true, order: 0 };

export default function ManageOffers() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/offers/all').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setEditId(null);
    setImageFile(null);
    setPreview('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({ title: item.title, titleAr: item.titleAr || '', description: item.description || '', discountPercent: item.discountPercent, bgColor: item.bgColor, isActive: item.isActive, order: item.order });
    setEditId(item._id);
    setPreview(item.image || '');
    setImageFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    try {
      if (editId) await api.put(`/offers/${editId}`, fd);
      else await api.post('/offers', fd);
      await load();
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل تريد حذف هذا العرض؟')) return;
    await api.delete(`/offers/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-800">العروض والخصومات</h1>
        <button onClick={openCreate} className="bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors">
          + إضافة عرض
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4">{editId ? 'تعديل العرض' : 'إضافة عرض'}</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700">العنوان (EN) *</label>
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">العنوان (AR)</label>
                  <input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                    className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">الوصف</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700">نسبة الخصم (%)</label>
                  <input type="number" min="0" max="100" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: +e.target.value })}
                    className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">لون الخلفية</label>
                  <input type="color" value={form.bgColor} onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                    className="mt-1 w-full h-10 border rounded-xl cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">الترتيب</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })}
                  className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="activeOffer" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-primary" />
                <label htmlFor="activeOffer" className="text-sm text-gray-700">نشط (يظهر في الموقع)</label>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">صورة الطبق</label>
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; setImageFile(f); setPreview(URL.createObjectURL(f)); }} className="mt-1 w-full text-sm" />
                {preview && <img src={preview} alt="" className="mt-2 w-20 h-20 rounded-xl object-cover" />}
              </div>

              {/* Live preview */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">معاينة البانر</label>
                <div className="rounded-xl overflow-hidden" style={{ background: form.bgColor }}>
                  <div className="flex items-center justify-between p-4">
                    <div className="text-white">
                      {form.discountPercent > 0 && <p className="text-2xl font-black">{form.discountPercent}%</p>}
                      <p className="font-bold">{form.title || 'عنوان العرض'}</p>
                      {form.description && <p className="text-xs opacity-80">{form.description}</p>}
                    </div>
                    {preview && <img src={preview} alt="" className="w-16 h-16 rounded-full object-cover" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold text-sm disabled:opacity-60">
                {loading ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold text-sm">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl text-center py-12 text-gray-400">لا توجد عروض بعد</div>
        ) : (
          items.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="rounded-xl overflow-hidden m-3" style={{ background: item.bgColor }}>
                <div className="flex items-center justify-between p-4">
                  <div className="text-white">
                    {item.discountPercent > 0 && <p className="text-2xl font-black">{item.discountPercent}%</p>}
                    <p className="font-bold text-sm">{item.title}</p>
                  </div>
                  {item.image && <img src={item.image} alt={item.title} className="w-14 h-14 rounded-full object-cover" />}
                </div>
              </div>
              <div className="px-4 pb-4 flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {item.isActive ? 'نشط' : 'مخفي'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="text-xs text-primary font-medium hover:underline">تعديل</button>
                  <button onClick={() => handleDelete(item._id)} className="text-xs text-red-500 font-medium hover:underline">حذف</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
