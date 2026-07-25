import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore } from '../store/cartStore';
import axios from 'axios';
import { Truck, MapPin, CheckCircle, CreditCard, Lock, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Componente interno que usa Stripe Elements
function CheckoutForm({ clientSecret, total, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/pedido-exitoso`
        },
        redirect: 'if_required'
      });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      setError('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      <PaymentElement />

      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50"
      >
        <CreditCard className="w-5 h-5" />
        {loading ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
      </button>

      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" /> Pago seguro por Stripe
      </p>
    </form>
  );
}

// Componente principal
export default function Checkout() {
  const navigate = useNavigate();
  
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      return sum + (price * item.quantity);
    }, 0);
  }, [items]);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    address: '',
    city: '',
    message: '',
    deliveryDate: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    
    if (!formData.recipientName || !formData.address || !formData.city) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // 1. Crear la orden en el backend
      const orderRes = await axios.post(`${API_URL}/orders`, {
        items: items.map(i => ({ 
          productId: i.id, 
          quantity: i.quantity, 
          price: i.price 
        })),
        total,
        ...formData
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const orderId = orderRes.data.id;

      // 2. Crear PaymentIntent con el orderId real
      const paymentRes = await axios.post(`${API_URL}/payment/create-payment-intent`, {
        amount: total,
        orderId
      });

      setClientSecret(paymentRes.data.clientSecret);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al preparar el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    clearCart();
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 text-center max-w-md w-full">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">¡Pago Exitoso!</h1>
          <p className="text-gray-500 mb-2">Tu pedido ha sido confirmado.</p>
          <p className="text-gray-500 mb-8">Recibirás un email con los detalles.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full btn-primary py-3"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">No hay productos en el carrito</p>
          <button onClick={() => navigate('/catalogo')} className="btn-primary">
            Ver Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Finalizar Compra</h1>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-rose-600' : 'bg-gray-200'}`} />
          <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-rose-600' : 'bg-gray-200'}`} />
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Tu Pedido</h3>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.quantity}x {item.name}</span>
                <span className="font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-rose-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {step === 1 ? (
          /* Paso 1: Datos de envío */
          <form onSubmit={handleContinue} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-rose-600" />
              <h2 className="font-bold text-lg">Datos de Entrega</h2>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del destinatario *</label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  name="recipientPhone"
                  value={formData.recipientPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de entrega *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Calle, número, apartamento, punto de referencia..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de entrega</label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje para la tarjeta</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="3"
                placeholder="Escribe un mensaje especial..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none resize-none"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50"
            >
              {loading ? 'Preparando pago...' : `Continuar al Pago →`}
            </button>
          </form>
        ) : (
          /* Paso 2: Pago con Stripe - solo renderizamos Elements cuando tenemos clientSecret */
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-rose-600" />
              <h2 className="font-bold text-lg">Pago Seguro</h2>
            </div>

            <button 
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a datos de entrega
            </button>

            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm 
                  clientSecret={clientSecret} 
                  total={total} 
                  onSuccess={handleSuccess}
                />
              </Elements>
            ) : (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-500">Cargando...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}