import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Heart, Clock, Flower, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/products?featured=true&limit=4`),
          axios.get(`${API_URL}/categories`)
        ]);
        setFeatured(productsRes.data.products || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-rose-900 mb-6"
          >
            Flores Frescas,<br />
            <span className="text-rose-600">Momentos Únicos</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Arreglos florales hechos a mano con flores del día. 
            Envío a domicilio en menos de 24 horas.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/catalogo" className="btn-primary inline-flex items-center gap-2 text-lg">
              Ver Catálogo <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Entrega Rápida', desc: 'Mismo día en tu zona' },
              { icon: Heart, title: 'Hecho a Mano', desc: 'Cada arreglo es único' },
              { icon: Clock, title: '24/7', desc: 'Pedidos online siempre' },
              { icon: Flower, title: 'Frescura Garantizada', desc: 'Flores seleccionadas diariamente' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-rose-50 hover:bg-rose-100 transition"
              >
                <feature.icon className="w-10 h-10 text-rose-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      {categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Comprar por Ocasión</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    to={`/catalogo?category=${cat.slug}`}
                    className="group relative block overflow-hidden rounded-2xl aspect-square bg-rose-200"
                  >
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Flower className="w-16 h-16 text-rose-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{cat.name}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Productos Destacados */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Más Populares</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Cargando productos...</p>
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay productos destacados aún. ¡Vuelve pronto!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Buscas algo especial?</h2>
          <p className="text-rose-100 text-lg mb-8">Contáctanos por WhatsApp y diseñamos tu arreglo personalizado</p>
          <a 
            href="https://wa.me/50600000000" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-rose-600 px-8 py-3 rounded-full font-semibold hover:bg-rose-50 transition"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

// Componente ProductCard reutilizable
function ProductCard({ product }) {
  return (
    <div className="card overflow-hidden group">
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
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
        {product.oldPrice && (
          <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            OFERTA
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-rose-600 font-bold text-lg">${parseFloat(product.price).toFixed(2)}</span>
            {product.oldPrice && (
              <span className="text-gray-400 text-sm line-through ml-2">${parseFloat(product.oldPrice).toFixed(2)}</span>
            )}
          </div>
          <Link 
            to={`/producto/${product.slug}`}
            className="btn-secondary text-sm py-2 px-4"
          >
            Ver
          </Link>
        </div>
      </div>
    </div>
  );
}