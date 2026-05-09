import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToastProvider from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import CartDrawer from './components/cart/CartDrawer';
import ChatWidget from './components/chat/ChatWidget';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Profile = lazy(() => import('./pages/Profile'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

// Admin pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));

// Page loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-10 h-10 border-2 border-violet/30 border-t-violet rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  </div>
);

function App() {
  const { fetchMe } = useAuth();

  // Check auth on mount
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <>
      <ToastProvider />
      <CartDrawer />
      <Navbar />
      <main className="min-h-screen pt-16">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:slug" element={<ProductDetail />} />

            <Route path="/cart" element={<Cart />} />
            
            {/* Protected (Must be logged in) */}
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-[70vh] flex items-center justify-center text-center">
                <div>
                  <div className="text-8xl mb-4">🔍</div>
                  <h1 className="font-heading text-4xl font-bold text-white mb-2">404</h1>
                  <p className="text-gray-500 mb-6">Page not found</p>
                  <a href="/" className="text-violet hover:text-violet-300 font-medium">Go home →</a>
                </div>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default App;
