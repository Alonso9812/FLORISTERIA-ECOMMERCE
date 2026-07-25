import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Flower, Calendar, Heart, GraduationCap, Gift, Baby, Church } from 'lucide-react';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const eventInfo = {
  '15-anos': {
    title: '15 Años',
    subtitle: 'Haz de su día especial un momento inolvidable',
    icon: Crown,
    color: 'from-pink-100 to-rose-100',
    description: 'Arreglos florales elegantes para quinceañeras. Desde centros de mesa hasta el ramo perfecto para la entrada.',
  },
  'bodas': {
    title: 'Bodas',
    subtitle: 'Flores que hacen de tu día un cuento de hadas',
    icon: Heart,
    color: 'from-rose-100 to-pink-100',
    description: 'Ramos de novia, centros de mesa, decoración de iglesia y todo lo que necesitas para tu boda soñada.',
  },
  'cumpleanos': {
    title: 'Cumpleaños',
    subtitle: 'Celebra con color y alegría',
    icon: Gift,
    color: 'from-yellow-100 to-orange-100',
    description: 'Sorprende con arreglos vibrantes, cajas sorpresa y combos especiales para cumpleañeros.',
  },
  'graduacion': {
    title: 'Graduación',
    subtitle: 'Celebra su logro con flores',
    icon: GraduationCap,
    color: 'from-blue-100 to-indigo-100',
    description: 'Ramos conmemorativos y arreglos para celebrar este importante logro académico.',
  },
  'san-valentin': {
    title: 'San Valentín',
    subtitle: 'Dile te quiero con flores',
    icon: Heart,
    color: 'from-red-100 to-rose-100',
    description: 'Rosas rojas, cajas en forma de corazón y combos románticos para el día del amor.',
  },
  'dia-madre': {
    title: 'Día de la Madre',
    subtitle: 'Agradece su amor con flores',
    icon: Baby,
    color: 'from-purple-100 to-pink-100',
    description: 'Arreglos especiales para mamá. Rosas rosadas, orquídeas y detalles que dicen gracias.',
  },
  'condolencias': {
    title: 'Condolencias',
    subtitle: 'Acompaña en el dolor con respeto',
    icon: Church,
    color: 'from-gray-100 to-slate-200',
    description: 'Arreglos blancos, coronas fúnebres y piezas de respeto para momentos difíciles.',
  },
};

function Crown(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
    </svg>
  );
}

export default function Events() {
  const { eventType } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  const info = eventInfo[eventType] || {
    title: 'Eventos',
    subtitle: 'Encuentra flores para cada ocasión',
    icon: Calendar,
    color: 'from-rose-100 to-pink-100',
    description: 'Explora nuestros arreglos especiales para todo tipo de celebraciones.',
  };
  const IconComponent = info.icon;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products?eventType=${eventType}&limit=50`);
        setProducts(res.data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (eventType) fetchProducts();
  }, [eventType]);

  if (!eventType) {
    // Mostrar grid de todos los eventos
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Eventos Especiales</h1>
          <p className="text-center text-gray-500 mb-12">Encuentra el arreglo perfecto para cada celebración</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(eventInfo).map(([key, event], i) => {
              const EventIcon = event.icon;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    to={`/eventos/${key}`}
                    className={`block bg-gradient-to-br ${event.color} rounded-2xl p-8 hover:shadow-lg transition group`}
                  >
                    <EventIcon className="w-12 h-12 text-gray-700 mb-4 group-hover:scale-110 transition" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm">{event.subtitle}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero del evento */}
      <div className={`bg-gradient-to-br ${info.color} py-16`}>
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/eventos" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-5 h-5" /> Todos los eventos
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <IconComponent className="w-10 h-10 text-gray-700" />
            <h1 className="text-4xl font-bold text-gray-800">{info.title}</h1>
          </div>
          <p className="text-xl text-gray-600 mb-4">{info.subtitle}</p>
          <p className="text-gray-500 max-w-2xl">{info.description}</p>
        </div>
      </div>

      {/* Productos del evento */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden group">
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
                        <Flower className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Flower className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay productos para este evento aún</p>
            <Link to="/catalogo" className="mt-4 inline-block text-rose-600 hover:underline">
              Ver catálogo completo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}