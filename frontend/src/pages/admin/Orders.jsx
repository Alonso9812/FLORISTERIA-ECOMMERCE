import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, Package, ChevronDown, ChevronUp, Eye, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  PAID: 'bg-green-100 text-green-700 border-green-200',
  PROCESSING: 'bg-blue-100 text-blue-700 border-blue-200',
  SHIPPED: 'bg-purple-100 text-purple-700 border-purple-200',
  DELIVERED: 'bg-gray-100 text-gray-700 border-gray-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

const statusLabels = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  PROCESSING: 'En preparación',
  SHIPPED: 'En camino',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const nextStatus = {
  PENDING: 'PAID',
  PAID: 'PROCESSING',
  PROCESSING: 'SHIPPED',
  SHIPPED: 'DELIVERED',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);

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

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Actualizar localmente
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      alert('Error al actualizar: ' + (error.response?.data?.error || error.message));
    } finally {
      setUpdating(null);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
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
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No hay órdenes aún</h2>
            <p className="text-gray-500">Los pedidos aparecerán aquí cuando los clientes compren</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Header de la orden */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-rose-100 text-rose-700 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg">
                        #{order.id}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{order.recipientName}</p>
                        <p className="text-sm text-gray-500">{order.user?.email || 'Sin email'}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                      <span className="text-xl font-bold text-rose-600">
                        ${parseFloat(order.total).toFixed(2)}
                      </span>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Detalles expandibles */}
                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t"
                    >
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Info del cliente */}
                        <div>
                          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <Eye className="w-4 h-4" /> Detalles de Entrega
                          </h3>
                          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                            <p><span className="text-gray-500">Destinatario:</span> {order.recipientName}</p>
                            <p><span className="text-gray-500">Teléfono:</span> {order.recipientPhone || 'No proporcionado'}</p>
                            <p><span className="text-gray-500">Dirección:</span> {order.address}</p>
                            <p><span className="text-gray-500">Ciudad:</span> {order.city}</p>
                            {order.deliveryDate && (
                              <p><span className="text-gray-500">Fecha entrega:</span> {new Date(order.deliveryDate).toLocaleDateString('es-ES')}</p>
                            )}
                            {order.message && (
                              <p className="italic text-rose-600 mt-2">"{order.message}"</p>
                            )}
                          </div>
                        </div>

                        {/* Productos */}
                        <div>
                          <h3 className="font-bold text-gray-800 mb-3">Productos</h3>
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                <div className="w-12 h-12 bg-white rounded-lg overflow-hidden">
                                  {item.product?.image ? (
                                    <img src={item.product.image.startsWith('http') ? item.product.image : `http://localhost:5000${item.product.image}`} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">🌸</div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm text-gray-800">{item.product?.name}</p>
                                  <p className="text-xs text-gray-500">{item.quantity} x ${parseFloat(item.price).toFixed(2)}</p>
                                </div>
                                <p className="font-bold text-rose-600 text-sm">
                                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                            <div className="flex justify-between pt-2 border-t">
                              <span className="font-bold text-gray-800">Total</span>
                              <span className="font-bold text-rose-600 text-lg">${parseFloat(order.total).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="px-6 pb-6">
                        <div className="flex flex-wrap gap-3">
                          {order.status === 'PENDING' && (
                            <button
                              onClick={() => updateStatus(order.id, 'PAID')}
                              disabled={updating === order.id}
                              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {updating === order.id ? 'Actualizando...' : 'Marcar como Pagado'}
                            </button>
                          )}
                          
                          {order.status === 'PAID' && (
                            <button
                              onClick={() => updateStatus(order.id, 'PROCESSING')}
                              disabled={updating === order.id}
                              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                              <Clock className="w-4 h-4" />
                              {updating === order.id ? 'Actualizando...' : 'En Preparación'}
                            </button>
                          )}
                          
                          {order.status === 'PROCESSING' && (
                            <button
                              onClick={() => updateStatus(order.id, 'SHIPPED')}
                              disabled={updating === order.id}
                              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                            >
                              <Truck className="w-4 h-4" />
                              {updating === order.id ? 'Actualizando...' : 'Enviar Pedido'}
                            </button>
                          )}
                          
                          {order.status === 'SHIPPED' && (
                            <button
                              onClick={() => updateStatus(order.id, 'DELIVERED')}
                              disabled={updating === order.id}
                              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {updating === order.id ? 'Actualizando...' : 'Marcar Entregado'}
                            </button>
                          )}
                          
                          {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                            <button
                              onClick={() => updateStatus(order.id, 'CANCELLED')}
                              disabled={updating === order.id}
                              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}