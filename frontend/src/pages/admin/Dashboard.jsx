import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, ShoppingBag, Users, TrendingUp, 
  DollarSign, Calendar, ArrowUpRight, Flower2, UserCog 
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, LinearScale, BarElement, 
  ArcElement, PointElement, LineElement, Title, Tooltip, Legend 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  ArcElement, PointElement, LineElement,
  Title, Tooltip, Legend
);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/stats/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const salesChartData = {
    labels: stats?.last7Days.map(d => d.date) || [],
    datasets: [{
      label: 'Ventas ($)',
      data: stats?.last7Days.map(d => d.amount) || [],
      backgroundColor: 'rgba(225, 29, 72, 0.8)',
      borderColor: 'rgba(225, 29, 72, 1)',
      borderWidth: 2,
      borderRadius: 8
    }]
  };

  const statusColors = {
    PENDING: '#fbbf24',
    PAID: '#22c55e',
    PROCESSING: '#3b82f6',
    SHIPPED: '#a855f7',
    DELIVERED: '#6b7280',
    CANCELLED: '#ef4444'
  };

  const statusLabels = {
    PENDING: 'Pendiente',
    PAID: 'Pagado',
    PROCESSING: 'Procesando',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado'
  };

  const statusChartData = {
    labels: stats?.ordersByStatus.map(s => statusLabels[s.status] || s.status) || [],
    datasets: [{
      data: stats?.ordersByStatus.map(s => s._count) || [],
      backgroundColor: stats?.ordersByStatus.map(s => statusColors[s.status] || '#999') || [],
      borderWidth: 0
    }]
  };

  const statCards = [
    { 
      label: 'Ventas Hoy', 
      value: `$${(stats?.today.sales || 0).toFixed(2)}`, 
      sub: `${stats?.today.orders || 0} órdenes`,
      icon: DollarSign, 
      color: 'bg-green-500',
      trend: '+12%'
    },
    { 
      label: 'Ventas Semana', 
      value: `$${(stats?.week.sales || 0).toFixed(2)}`, 
      sub: `${stats?.week.orders || 0} órdenes`,
      icon: Calendar, 
      color: 'bg-blue-500',
      trend: '+8%'
    },
    { 
      label: 'Ventas Mes', 
      value: `$${(stats?.month.sales || 0).toFixed(2)}`, 
      sub: `${stats?.month.orders || 0} órdenes`,
      icon: TrendingUp, 
      color: 'bg-purple-500',
      trend: '+23%'
    },
    { 
      label: 'Total Productos', 
      value: stats?.totals.products || 0, 
      sub: `${stats?.totals.orders || 0} órdenes totales`,
      icon: Package, 
      color: 'bg-rose-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flower2 className="w-8 h-8 text-rose-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Panel de Administración</h1>
              <p className="text-sm text-gray-500">Resumen de tu floristería</p>
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
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} text-white p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                {stat.trend && (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4" />
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-gray-400 text-xs mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Ventas Últimos 7 Días</h3>
            <Bar 
              data={salesChartData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, ticks: { callback: v => '$' + v } }
                }
              }}
            />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Órdenes por Estado</h3>
            <div className="w-64 mx-auto">
              <Doughnut 
                data={statusChartData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
          </div>
        </div>

        {/* Productos más vendidos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Top 5 Productos Más Vendidos</h3>
          <div className="space-y-3">
            {stats?.topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <span className="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </span>
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                  {product.image && (
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.quantity} vendidos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Ver Órdenes</p>
                <p className="text-sm text-gray-500">Gestionar pedidos</p>
              </div>
            </Link>
            <Link to="/admin/usuarios" className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition">
              <div className="bg-purple-600 text-white p-3 rounded-xl">
                <UserCog className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Usuarios</p>
                <p className="text-sm text-gray-500">Gestionar usuarios</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}