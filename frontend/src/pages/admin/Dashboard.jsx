import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, TrendingUp, Flower2 } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Productos', value: '20', icon: Package, color: 'bg-blue-500', link: '/admin/productos' },
    { label: 'Órdenes', value: '0', icon: ShoppingBag, color: 'bg-green-500', link: '/admin/ordenes' },
    { label: 'Usuarios', value: '2', icon: Users, color: 'bg-purple-500', link: '#' },
    { label: 'Ventas', value: '$0', icon: TrendingUp, color: 'bg-rose-500', link: '#' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flower2 className="w-8 h-8 text-rose-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Panel de Administración</h1>
              <p className="text-sm text-gray-500">Gestiona tu floristería</p>
            </div>
          </div>
          <Link to="/" className="text-rose-600 hover:text-rose-700 font-medium">
            ← Volver a la tienda
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <Link key={i} to={stat.link} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} text-white p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <p className="text-gray-500 font-medium">{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/admin/productos/nuevo" className="flex items-center gap-4 p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition">
              <div className="bg-rose-600 text-white p-3 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Nuevo Producto</p>
                <p className="text-sm text-gray-500">Agregar al catálogo</p>
              </div>
            </Link>
            <Link to="/admin/productos" className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
              <div className="bg-blue-600 text-white p-3 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Ver Productos</p>
                <p className="text-sm text-gray-500">Editar o eliminar</p>
              </div>
            </Link>
            <Link to="/admin/ordenes" className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition">
              <div className="bg-green-600 text-white p-3 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Ver Órdenes</p>
                <p className="text-sm text-gray-500">Gestionar pedidos</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}