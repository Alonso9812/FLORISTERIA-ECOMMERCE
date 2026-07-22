import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Flower } from 'lucide-react';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addItem } = useCartStore();

  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (search) params.append('search', search);

        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/products?${params.toString()}`),
          axios.get(`${API_URL}/categories`)
        ]);
        
        setProducts(productsRes.data.products || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    // El useEffect se encarga de la búsqueda
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Nuestro Catálogo</h1>
          
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar flores, arreglos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
              />
            </form>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSearchParams({})}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                  !selectedCategory 
                    ? 'bg-rose-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-rose-50'
                }`}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.slug })}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                    selectedCategory === cat.slug 
                      ? 'bg-rose-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-rose-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="card overflow-hidden group bg-white">
                  <Link to={`/producto/${product.slug}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Flower className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                  </Link>
                  <div className="p-4">
                    <Link to={`/producto/${product.slug}`}>
                      <h3 className="font-semibold text-gray-800 mb-1 hover:text-rose-600 transition">{product.name}</h3>
                    </Link>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-rose-600 font-bold text-lg">${parseFloat(product.price).toFixed(2)}</span>
                        {product.oldPrice && (
                          <span className="text-gray-400 text-sm line-through ml-2">${parseFloat(product.oldPrice).toFixed(2)}</span>
                        )}
                      </div>
                      <button
                        onClick={() => addItem(product)}
                        className="bg-rose-600 text-white p-2 rounded-full hover:bg-rose-700 transition active:scale-95"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Flower className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
            <button 
              onClick={() => { setSearch(''); setSearchParams({}); }}
              className="mt-4 text-rose-600 hover:underline"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}