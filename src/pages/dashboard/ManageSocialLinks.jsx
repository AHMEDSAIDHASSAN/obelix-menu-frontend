import { useEffect, useState } from 'react';
import api from '../../api/axios';

const fields = [
  { key: 'whatsapp', label: 'واتساب', placeholder: '201234567890 أو رقم الموبايل', color: 'text-green-600' },
  { key: 'instagram', label: 'إنستجرام', placeholder: 'https://instagram.com/yourpage', color: 'text-pink-500' },
  { key: 'facebook', label: 'فيسبوك', placeholder: 'https://facebook.com/yourpage', color: 'text-blue-600' },
  { key: 'tiktok', label: 'تيك توك', placeholder: 'https://tiktok.com/@yourpage', color: 'text-gray-800' },
  { key: 'snapchat', label: 'سناب شات', placeholder: 'https://snapchat.com/add/yourname', color: 'text-yellow-500' },
];

export default function ManageSocialLinks() {
  const [form, setForm] = useState({ facebook: '', instagram: '', tiktok: '', whatsapp: '', snapchat: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/social').then((r) => {
      setForm({ facebook: r.data.facebook || '', instagram: r.data.instagram || '', tiktok: r.data.tiktok || '', whatsapp: r.data.whatsapp || '', snapchat: r.data.snapchat || '' });
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await api.put('/social', form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-black text-gray-900 mb-6">روابط السوشيال ميديا</h1>
      <p className="text-sm text-gray-400 mb-6">اترك الحقل فارغاً لإخفاء الأيقونة من الفوتر</p>

      {loading ? (
        <div className="space-y-4">{[1,2,3,4,5].map((i) => <div key={i} className="h-14 bg-white rounded-2xl animate-pulse" />)}</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {fields.map(({ key, label, placeholder, color }) => (
            <div key={key}>
              <label className={`block text-sm font-bold mb-1.5 ${color}`}>{label}</label>
              <input
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 mt-2"
          >
            {saving ? 'جاري الحفظ...' : saved ? '✓ تم الحفظ' : 'حفظ الروابط'}
          </button>
        </form>
      )}
    </div>
  );
}
