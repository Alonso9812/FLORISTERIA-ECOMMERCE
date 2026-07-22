import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderSuccess from './pages/OrderSuccess';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminProductForm from './pages/admin/ProductForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_demo');

function App() {
  return (
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalogo" element={<Catalog />} />
            <Route path="producto/:slug" element={<ProductDetail />} />
            <Route path="carrito" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Register />} />
            <Route path="pedido-exitoso" element={<OrderSuccess />} />
          </Route>

          {/* Rutas de Admin */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/productos" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProducts />
            </ProtectedRoute>
          } />
          <Route path="/admin/productos/nuevo" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProductForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/productos/editar/:id" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProductForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/ordenes" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminOrders />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </Elements>
  );
}

export default App;