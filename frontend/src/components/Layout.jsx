import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Flower2, User, LogOut } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { items } = useCartStore();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar token
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => setUser(data))
        .catch(() => setUser(null));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Flower2 className="w-8 h-8 text-rose-600" />
              <span className="text-xl font-bold text-rose-800">Floristería</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-rose-600 font-medium">Inicio</Link>
              <Link to="/catalogo" className="text-gray-700 hover:text-rose-600 font-medium">Catálogo</Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <Link to="/carrito" className="relative p-2 hover:bg-rose-50 rounded-full transition">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="text-sm bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full font-medium hover:bg-rose-200 transition">
                      Admin
                    </Link>
                  )}
                  <span className="text-sm text-gray-600">Hola, {user.name}</span>
                  <button onClick={handleLogout} className="p-2 hover:bg-rose-50 rounded-full">
                    <LogOut className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-rose-600">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Ingresar</span>
                </Link>
              )}

              {/* Mobile menu button */}
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-rose-50 rounded-lg"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-2">
              <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700">Inicio</Link>
              <Link to="/catalogo" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700">Catálogo</Link>
              <Link to="/carrito" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700">Carrito ({cartCount})</Link>
              {user ? (
                <>
                  <span className="block py-2 text-gray-600">Hola, {user.name}</span>
                  <button onClick={handleLogout} className="block py-2 text-rose-600">Cerrar sesión</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-rose-600">Ingresar</Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flower2 className="w-6 h-6 text-rose-400" />
              <span className="text-lg font-bold">Floristería</span>
            </div>
            <p className="text-gray-400 text-sm">Flores frescas, diseño con cariño y entrega puntual. Cada flor cuenta una historia.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-white">Inicio</Link></li>
              <li><Link to="/catalogo" className="hover:text-white">Catálogo</Link></li>
              <li><Link to="/login" className="hover:text-white">Mi Cuenta</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <p className="text-gray-400 text-sm">WhatsApp: +506 0000-0000</p>
            <p className="text-gray-400 text-sm">Email: hola@floristeria.com</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © 2026 Floristería Online. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}