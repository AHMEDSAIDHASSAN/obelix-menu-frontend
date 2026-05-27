import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LangProvider } from './context/LangContext';

import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/dashboard/Login';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ManageCategories from './pages/dashboard/ManageCategories';
import ManageSubCategories from './pages/dashboard/ManageSubCategories';
import ManageProducts from './pages/dashboard/ManageProducts';
import ManageOffers from './pages/dashboard/ManageOffers';
import ManageSubSubCategories from './pages/dashboard/ManageSubSubCategories';

function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-white flex items-center justify-center"
    >
      <motion.img
        src="/logo.svg"
        alt="Obelix Agency"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-52 h-auto"
      />
    </motion.div>
  );
}

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/dashboard/login" replace />;
}

export default function App() {
  const [splash, setSplash] = useState(true);

  return (
    <AuthProvider>
      <LangProvider>
        <AnimatePresence>
          {splash && <SplashScreen key="splash" onDone={() => setSplash(false)} />}
        </AnimatePresence>

        <BrowserRouter>
          <Routes>
            {/* Public menu */}
            <Route path="/" element={<Home />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Admin */}
            <Route path="/dashboard/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="subcategories" element={<ManageSubCategories />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="subsubcategories" element={<ManageSubSubCategories />} />
              <Route path="offers" element={<ManageOffers />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LangProvider>
    </AuthProvider>
  );
}
