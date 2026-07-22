import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-lg p-8 md:p-12 text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">¡Pedido Confirmado!</h1>
        <p className="text-gray-500 mb-2">Gracias por tu compra.</p>
        <p className="text-gray-500 mb-8">Te enviaremos un email con los detalles de tu pedido.</p>
        
        <div className="space-y-3">
          <Link to="/catalogo" className="w-full btn-primary flex items-center justify-center gap-2 py-3">
            <ShoppingBag className="w-5 h-5" />
            Seguir Comprando
          </Link>
          <Link to="/" className="w-full btn-secondary flex items-center justify-center gap-2 py-3">
            <Home className="w-5 h-5" />
            Ir al Inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}