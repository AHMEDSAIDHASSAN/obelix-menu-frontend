import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { assetUrl } from '../../lib/asset';

const EMPTY_FORM = {
  name: '', nameAr: '', description: '', descriptionAr: '',
  category: '', subCategory: '', subSubCategory: '', basePrice: '', discount: 0,
  isAvailable: true, isFeatured: false, order: 0, tags: '',
};

export default function ManageProducts() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [filteredSubSubs, setFilteredSubSubs] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState({ label: '', price: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterCat, setFilterCat] = useState('all');

  const load = () =>
    Promise.all([
      api.get('/products/all'),
      api.get('/categories/all'),
      api.get('/subcategories/all'),
      api.get('/subsubcategories/all'),
    ]).then(([p, c, s, ss]) => {
      setItems(p.data);
      setCategories(c.data);
      setSubCategories(s.data);
      setSubSubCategories(ss.data);
    });

  useEffect(() => { load(); }, []);

  const handleCategoryChange = (catId) => {
    setForm((f) => ({ ...f, category: catId, subCategory: '', subSubCategory: '' }));
    setFilteredSubs(subCategories.filter((s) => s.category?._id === catId));
    setFilteredSubSubs([]);
  };

  const handleSubCategoryChange = (subId) => {
    setForm((f) => ({ ...f, subCategory: subId, subSubCategory: '' }));
    setFilteredSubSubs(subSubCategories.filter((ss) => ss.subCategory?._id === subId));
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setSizes([]);
    setEditId(null);
    setImageFile(null);
    setPreview('');
    setFilteredSubs([]);
    setFilteredSubSubs([]);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({
      name: item.name, nameAr: item.nameAr || '', description: item.description || '',
      descriptionAr: item.descriptionAr || '', category: item.category?._id || '',
      subCategory: item.subCategory?._id || '', subSubCategory: item.subSubCategory?._id || '',
      basePrice: item.basePrice, discount: item.discount,
      isAvailable: item.isAvailable, isFeatured: item.isFeatured, order: item.order,
      tags: item.tags?.join(', ') || '',
    });
    setSizes(item.sizes || []);
    setEditId(item._id);
    setPreview(item.image || '');
    setImageFile(null);
    setFilteredSubs(subCategories.filter((s) => s.category?._id === item.category?._id));
    setFilteredSubSubs(subSubCategories.filter((ss) => ss.subCategory?._id === item.subCategory?._id));
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k !== 'tags') fd.append(k, v);
    });
    fd.append('sizes', JSON.stringify(sizes));
    fd.append('tags', JSON.stringify(form.tags.split(',').map((t) => t.trim()).filter(Boolean)));
    if (imageFile) fd.append('image', imageFile);
    try {
      if (editId) await api.put(`/products/${editId}`, fd);
      else await api.post('/products', fd);
      await load();
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل تريد حذف هذا المنتج؟')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  const addSize = () => {
    if (!newSize.label || !newSize.price) return;
    setSizes([...sizes, { label: newSize.label, price: +newSize.price }]);
    setNewSize({ label: '', price: '' });
  };

  const filtered = filterCat === 'all' ? items : items.filter((p) => p.category?._id === filterCat);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-800">المنتجات</h1>
        <button onClick={openCreate} className="bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors">
          + إضافة منتج
        </button>
      </div>

      {/* Filter by category */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button onClick={() => setFilterCat('all')} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${filterCat === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>الكل ({items.length})</button>
        {categories.map((c) => (
          <button key={c._id} onClick={() => setFilterCat(c._id)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${filterCat === c._id ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>
            {c.name} ({items.filter((p) => p.category?._id === c._id).length})
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl my-4">
            <h2 className="text-lg font-bold mb-4">{editId ? 'تعديل المنتج' : 'إضافة منتج'}</h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {/* Name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700">الاسم (EN) *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">الاسم (AR)</label>
                  <input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                    className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              {/* Category + SubCategory + SubSubCategory */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700">الفئة *</label>
                  <select required value={form.category} onChange={(e) => handleCategoryChange(e.target.value)}
                    className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">اختر فئة</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">الفئة الفرعية</label>
                  <select value={form.subCategory} onChange={(e) => handleSubCategoryChange(e.target.value)}
                    className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">بدون</option>
                    {filteredSubs.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              {filteredSubSubs.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-700">الفئة الفرعية الثانية (اختياري)</label>
                  <select value={form.subSubCategory} onChange={(e) => setForm({ ...form, subSubCategory: e.target.value })}
                    className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">بدون</option>
                    {filteredSubSubs.map((ss) => <option key={ss._id} value={ss._id}>{ss.name}</option>)}
                  </select>
                </div>
              )}

              {/* Price + Discount */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700">السعر الأساسي ($) *</label>
                  <input required type="number" step="0.01" min="0" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                    className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">الخصم (%)</label>
                  <input type="number" min="0" max="100" value={form.discount} onChange={(e) => setForm({ ...form, discount: +e.target.value })}
                    className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-gray-700">الوصف (EN)</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">الوصف (AR)</label>
                <textarea rows={2} value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                  className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>

              {/* Sizes */}
              <div>
                <label className="text-xs font-medium text-gray-700">الأحجام (اختياري)</label>
                <div className="flex gap-2 mt-1">
                  <input placeholder="صغير / Half / Full" value={newSize.label} onChange={(e) => setNewSize({ ...newSize, label: e.target.value })}
                    className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input placeholder="السعر" type="number" step="0.01" value={newSize.price} onChange={(e) => setNewSize({ ...newSize, price: e.target.value })}
                    className="w-24 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <button type="button" onClick={addSize} className="bg-primary text-white px-3 py-2 rounded-xl text-sm font-semibold">+</button>
                </div>
                {sizes.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {sizes.map((s, i) => (
                      <span key={i} className="flex items-center gap-1 bg-cream-dark text-xs px-2 py-1 rounded-lg">
                        {s.label} — ${s.price}
                        <button type="button" onClick={() => setSizes(sizes.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-medium text-gray-700">Tags (افصل بفاصلة)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="spicy, vegetarian, new"
                  className="mt-1 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="w-4 h-4 accent-primary" />
                  متاح
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-primary" />
                  مميز
                </label>
              </div>

              {/* Image */}
              <div>
                <label className="text-xs font-medium text-gray-700">الصورة</label>
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; setImageFile(f); setPreview(URL.createObjectURL(f)); }}
                  className="mt-1 w-full text-sm" />
                {preview && <img src={assetUrl(preview)} alt="" className="mt-2 w-24 h-24 rounded-xl object-cover" />}
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

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl text-center py-12 text-gray-400">لا توجد منتجات</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const finalPrice = item.discount > 0 ? item.basePrice - (item.basePrice * item.discount) / 100 : item.basePrice;
            return (
              <div key={item._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="relative aspect-video bg-cream-dark">
                  {item.image ? (
                    <img src={assetUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
                  )}
                  {item.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{item.discount}%</span>
                  )}
                  {item.isFeatured && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">مميز ⭐</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-bold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    {item.category?.name}
                    {item.subCategory ? ` › ${item.subCategory.name}` : ''}
                    {item.subSubCategory ? ` › ${item.subSubCategory.name}` : ''}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="text-primary font-black">${finalPrice.toFixed(2)}</span>
                      {item.discount > 0 && <span className="text-gray-400 line-through text-xs ml-1">${item.basePrice.toFixed(2)}</span>}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {item.isAvailable ? 'متاح' : 'غير متاح'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => openEdit(item)} className="flex-1 text-xs border border-primary text-primary font-semibold py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all">تعديل</button>
                    <button onClick={() => handleDelete(item._id)} className="flex-1 text-xs border border-red-300 text-red-500 font-semibold py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all">حذف</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
