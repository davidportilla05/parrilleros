import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, CreditCard, Mail, FileText, ArrowLeft, Send } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import OrderSummary from './OrderSummary';

interface DeliveryFormProps {
  onBack: () => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useOrder();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    neighborhood: '',
    phone: '',
    cedula: '',
    email: '',
    paymentMethod: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentMethods = [
    'Efectivo',
    'Bancolombia',
    'Nequi',
    'Daviplata'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return formData.name && 
           formData.address && 
           formData.neighborhood && 
           formData.phone && 
           formData.cedula && 
           formData.email && 
           formData.paymentMethod &&
           cart.length > 0;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    
    setIsSubmitting(true);
    
    // Simulate order processing
    setTimeout(() => {
      // Generate order summary message
      const orderItems = cart.map(item => {
        const basePrice = item.withFries ? (item.menuItem.priceWithFries || item.menuItem.price) : item.menuItem.price;
        const customizationsText = item.customizations.length > 0 
          ? ` (${item.customizations.map(c => c.name.replace('AD ', '')).join(', ')})`
          : '';
        const friesText = item.withFries ? ' + Papas' : '';
        const specialText = item.specialInstructions ? ` - ${item.specialInstructions}` : '';
        
        return `${item.quantity}x ${item.menuItem.name}${friesText}${customizationsText}${specialText} - $${Math.round((basePrice + item.customizations.reduce((sum, c) => sum + c.price, 0)) * item.quantity).toLocaleString()}`;
      }).join('\n');

      const orderMessage = `
🍔 NUEVO PEDIDO A DOMICILIO - PARRILLEROS FAST FOOD

👤 DATOS DEL CLIENTE:
▪️ Nombre: ${formData.name}
▪️ Dirección: ${formData.address}, ${formData.neighborhood}
▪️ Celular: ${formData.phone}
▪️ Cédula: ${formData.cedula}
▪️ Correo: ${formData.email}

🛒 PEDIDO:
${orderItems}

💰 TOTAL: $${Math.round(total).toLocaleString()}
💳 Forma de pago: ${formData.paymentMethod}

🛵 Tiempo estimado: 45-60 minutos
📅 Fecha: ${new Date().toLocaleDateString()}
⏰ Hora: ${new Date().toLocaleTimeString()}

¡Gracias por preferirnos!
      `.trim();

      // In a real app, this would send to WhatsApp API or backend
      console.log('Order submitted:', orderMessage);
      
      // Show success and redirect
      alert('¡Pedido enviado exitosamente! Te contactaremos pronto para confirmar tu domicilio.');
      clearCart();
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={onBack}
              className="mr-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Pedido a Domicilio</h1>
              <p className="text-gray-600">Completa tus datos para procesar tu pedido</p>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              <strong>🛵 Tiempo de entrega:</strong> 45-60 minutos aproximadamente<br/>
              <strong>💳 Formas de pago:</strong> Efectivo, Bancolombia, Nequi y Daviplata
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Datos de Entrega</h2>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                  placeholder="Ingresa tu nombre completo"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  Dirección *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                  placeholder="Calle, carrera, número"
                />
              </div>

              {/* Neighborhood */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barrio *
                </label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                  placeholder="Nombre del barrio"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Número de celular *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                  placeholder="3001234567"
                />
              </div>

              {/* Cedula */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="inline mr-2" />
                  Número de cédula *
                </label>
                <input
                  type="text"
                  value={formData.cedula}
                  onChange={(e) => handleInputChange('cedula', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                  placeholder="12345678"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CreditCard size={16} className="inline mr-2" />
                  Forma de pago *
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                >
                  <option value="">Selecciona forma de pago</option>
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className={`w-full mt-6 py-4 font-bold rounded-lg text-lg flex items-center justify-center transition-all ${
                isFormValid() && !isSubmitting
                  ? 'bg-[#FF8C00] text-white hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando pedido...
                </>
              ) : (
                <>
                  <Send size={20} className="mr-2" />
                  Enviar Pedido a Domicilio
                </>
              )}
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryForm;