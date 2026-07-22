import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flower2, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-green-100 text-green-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const statusLabels = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  PROCESSING: 'Procesando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flower2 className="w-8 h-8 text-rose-600" />
            <h1 className="text-xl font-bold text-gray-800">Gestión de Órdenes</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-gray-600 hover:text-gray-800">Dashboard</Link>
            <Link to="/" className="text-rose-600 hover:text-rose-700">Tienda</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No hay órdenes aún</h2>
            <p className="text-gray-500">Los pedidos aparecerán aquí cuando los clientes compren</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Cliente</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Destinatario</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Total</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Estado</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm text-gray-600">#{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{order.user?.name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.recipientName}</td>
                      <td className="px-6 py-4 font-semibold text-rose-600">${parseFloat(order.total).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}