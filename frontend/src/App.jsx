import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Events from './pages/Events';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminProductForm from './pages/admin/ProductForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalog />} />
          <Route path="producto/:slug" element={<ProductDetail />} />
          <Route path="carrito" element={<Cart />} />
          <Route path="eventos" element={<Events />} />
          <Route path="eventos/:eventType" element={<Events />} />
          <Route path="quienes-somos" element={<About />} />
        </Route>

        <Route path="checkout" element={<Checkout />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Register />} />
        <Route path="pedido-exitoso" element={<OrderSuccess />} />
        <Route path="olvide-contrasena" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

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
  );
}

export default App;