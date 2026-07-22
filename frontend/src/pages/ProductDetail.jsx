import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, ArrowLeft, Heart, Truck, Clock } from 'lucide-react';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/${slug}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Producto no encontrado</p>
          <button onClick={() => navigate('/catalogo')} className="btn-primary">
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Volver
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm"
          >
            <div className="aspect-square bg-gray-100">
              {product.image ? (
                <img 
                  src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart className="w-24 h-24 text-gray-200" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-rose-600 font-medium text-sm mb-2">
              {product.category?.name || 'Floristería'}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-rose-600">${parseFloat(product.price).toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through">${parseFloat(product.oldPrice).toFixed(2)}</span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{product.description || 'Arreglo floral elaborado con flores frescas seleccionadas del día.'}</p>

            {/* Features */}
            <div className="flex gap-6 mb-8">
              <div className="flex items-center gap-2 text-gray-600">
                <Truck className="w-5 h-5 text-rose-500" />
                <span className="text-sm">Envío gratis</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5 text-rose-500" />
                <span className="text-sm">Entrega 24h</span>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-xl">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-4"
              >
                <ShoppingCart className="w-5 h-5" />
                Agregar al Carrito
              </button>
            </div>

            {/* Stock */}
            <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `✓ En stock (${product.stock} disponibles)` : '✗ Agotado'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}