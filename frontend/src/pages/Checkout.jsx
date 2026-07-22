import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useCartStore } from '../store/cartStore';
import axios from 'axios';
import { CreditCard, Truck, MapPin } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Checkout() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (step === 1) {
      // Validar datos de envío
      if (!formData.recipientName || !formData.address || !formData.city) {
        setMessage('Por favor completa todos los campos obligatorios');
        return;
      }
      setStep(2);
      setMessage('');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // 1. Crear la orden en el backend
      const token = localStorage.getItem('token');
      const orderRes = await axios.post(`${API_URL}/orders`, {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
        total,
        ...formData
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      // 2. Crear PaymentIntent
      const { data: paymentData } = await axios.post(`${API_URL}/payment/create-payment-intent`, {
        amount: total,
        orderId: orderRes.data.id
      });

      // 3. Confirmar pago con Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/pedido-exitoso`
        },
        redirect: 'if_required'
      });

      if (error) {
        setMessage(error.message);
      } else if (paymentIntent?.status === 'succeeded') {
        clearCart();
        navigate('/pedido-exitoso');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error al procesar el pago. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            /* Paso 1: Datos de envío */
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-rose-600" />
                <h2 className="font-bold text-lg">Datos de Entrega</h2>
              </div>

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

              <div className="bg-rose-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total a pagar:</span>
                  <span className="text-2xl font-bold text-rose-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" className="w-full btn-primary py-4 text-lg">
                Continuar al Pago
              </button>
            </div>
          ) : (
            /* Paso 2: Pago con Stripe */
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-rose-600" />
                <h2 className="font-bold text-lg">Información de Pago</h2>
              </div>

              <PaymentElement />

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Atrás
                </button>
                <button 
                  type="submit" 
                  disabled={!stripe || loading}
                  className="flex-1 btn-primary py-3 disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}