import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const STAT_CONFIG = [
  {
    key: 'categories', label: 'الفئات', to: '/dashboard/categories', color: 'bg-violet-500',
    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  },
  {
    key: 'subcategories', label: 'الفئات الفرعية', to: '/dashboard/subcategories', color: 'bg-blue-500',
    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  },
  {
    key: 'products', label: 'المنتجات', to: '/dashboard/products', color: 'bg-amber-500',
    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  },
  {
    key: 'offers', label: 'العروض', to: '/dashboard/offers', color: 'bg-emerald-500',
    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  },
];

const QUICK_ACTIONS = [
  { to: '/dashboard/categories', label: 'فئة جديدة', color: 'bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-200' },
  { to: '/dashboard/subcategories', label: 'فئة فرعية', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200' },
  { to: '/dashboard/products', label: 'منتج جديد', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200' },
  { to: '/dashboard/offers', label: 'عرض جديد', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
];

export default function DashboardHome() {
  const [stats, setStats] = useState({ categories: 0, subcategories: 0, products: 0, offers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/categories/all'),
      api.get('/subcategories/all'),
      api.get('/products/all'),
      api.get('/offers/all'),
    ]).then(([c, s, p, o]) => {
      setStats({ categories: c.data.length, subcategories: s.data.length, products: p.data.length, offers: o.data.length });
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">مرحباً بك</h1>
        <p className="text-gray-500 text-sm mt-1">إليك نظرة عامة على لوحة التحكم</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CONFIG.map(({ key, label, to, color, icon }) => (
          <Link key={key} to={to}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group border border-gray-100 hover:border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-black text-gray-900 leading-none">
                  {loading ? <span className="text-gray-300">—</span> : stats[key]}
                </p>
                <p className="text-sm text-gray-500 mt-1.5">{label}</p>
              </div>
              <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span>إدارة</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">إضافة سريعة</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.to} to={a.to}
              className={`flex items-center justify-center gap-2 border py-3 px-4 rounded-xl text-sm font-semibold transition-all ${a.color}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
