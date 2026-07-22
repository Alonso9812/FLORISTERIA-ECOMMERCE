import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Flower2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products?limit=100`);
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert('Error al eliminar: ' + (error.response?.data?.error || error.message));
    }
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flower2 className="w-8 h-8 text-rose-600" />
            <h1 className="text-xl font-bold text-gray-800">Gestión de Productos</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-gray-600 hover:text-gray-800">Dashboard</Link>
            <Link to="/" className="text-rose-600 hover:text-rose-700">Tienda</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
            />
          </div>
          <Link to="/admin/productos/nuevo" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </Link>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Producto</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Categoría</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Precio</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Destacado</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            {product.image ? (
                              <img src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">🌸</div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-rose-600">${parseFloat(product.price).toFixed(2)}</span>
                        {product.oldPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">${parseFloat(product.oldPrice).toFixed(2)}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                      <td className="px-6 py-4">
                        {product.featured ? (
                          <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded-full">SÍ</span>
                        ) : (
                          <span className="text-gray-400 text-sm">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            to={`/admin/productos/editar/${product.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No se encontraron productos
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}