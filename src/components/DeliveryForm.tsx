import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, CreditCard, Mail, FileText, ArrowLeft, Send, CheckCircle, Clock, Truck, Download, Printer } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import OrderSummary from './OrderSummary';
import LocationSelector from './LocationSelector';
import TourButton from './TourButton';
import { locations } from '../data/locations';
import { Location } from '../types';
import { useDriverTour, deliveryTourSteps } from '../hooks/useDriverTour';

interface DeliveryFormProps {
  onBack: () => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { cart, total, clearCart, orderNumber } = useOrder();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
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
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [showTourButton, setShowTourButton] = useState(true);
  const ticketRef = useRef<HTMLDivElement>(null);

  const { startTour } = useDriverTour({
    steps: deliveryTourSteps,
    onDestroyed: () => {
      setShowTourButton(false);
      setTimeout(() => {
        setShowTourButton(true);
      }, 30000);
    }
  });

  // Auto-start tour for first-time users
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('parrilleros-delivery-tour-seen');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        startTour();
        localStorage.setItem('parrilleros-delivery-tour-seen', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [startTour]);

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

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleStartTour = () => {
    startTour();
  };

  const isFormValid = () => {
    return selectedLocation &&
           formData.name && 
           formData.address && 
           formData.neighborhood && 
           formData.phone && 
           formData.cedula && 
           formData.email && 
           formData.paymentMethod && 
           cart.length > 0;
  };

  const generateTicketContent = () => {
    const subtotal = total * 0.92;
    const iva = total * 0.08;

    const cartDetails = cart.map((item, index) => {
      const basePrice = item.withFries ? (item.menuItem.priceWithFries || item.menuItem.price) : item.menuItem.price;
      const customizationsTotal = item.customizations.reduce((sum, option) => sum + option.price, 0);
      const itemSubtotal = (basePrice + customizationsTotal) * item.quantity;
      
      let itemText = `${index + 1}. ${item.menuItem.name}`;
      if (item.withFries) {
        itemText += ' + Papas';
      }
      itemText += ` x${item.quantity} - $${Math.round(itemSubtotal).toLocaleString()}`;
      
      if (item.customizations.length > 0) {
        itemText += `\n   + ${item.customizations.map(c => c.name.replace('AD ', '')).join(', ')}`;
      }
      
      if (item.specialInstructions) {
        itemText += `\n   * ${item.specialInstructions}`;
      }
      
      return itemText;
    }).join('\n\n');

    return `🍔 NUEVO PEDIDO DOMICILIO - PARRILLEROS
═══════════════════════════════════════

📋 PEDIDO #${orderNumber.toString().padStart(3, '0')} | ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

👤 CLIENTE
${formData.name} | CC: ${formData.cedula}
📱 ${formData.phone} | 📧 ${formData.email}

📍 ENTREGA
${formData.address}, ${formData.neighborhood}

🛒 PRODUCTOS
${cartDetails}

💰 TOTAL: $${Math.round(total).toLocaleString()} (${formData.paymentMethod})
⏰ Tiempo: 45-60 min

¡PROCESAR INMEDIATAMENTE!

📍 ${selectedLocation?.name} | ${selectedLocation?.phone}`;
  };

  const handleDownloadTicket = () => {
    const ticketContent = generateTicketContent();
    const blob = new Blob([ticketContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ticket_Parrilleros_${orderNumber.toString().padStart(3, '0')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintTicket = () => {
    if (ticketRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Ticket Parrilleros #${orderNumber.toString().padStart(3, '0')}</title>
              <style>
                body { font-family: monospace; font-size: 12px; line-height: 1.4; margin: 20px; }
                .header { text-align: center; margin-bottom: 20px; }
                .section { margin-bottom: 15px; }
                .section-title { font-weight: bold; margin-bottom: 5px; }
                .item { margin-bottom: 10px; }
                .total { font-weight: bold; font-size: 14px; }
              </style>
            </head>
            <body>
              <pre>${generateTicketContent()}</pre>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid() || !selectedLocation) return;
    
    setIsSubmitting(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSubmitted(true);

      // Construct WhatsApp message with exact format
      const message = generateTicketContent();
      
      // Encode message and create WhatsApp URL with selected location's WhatsApp
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${selectedLocation.whatsapp}?text=${encodedMessage}`;

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
    }, 2000);
  };

  const handleFinish = () => {
    clearCart();
    navigate('/');
  };

  // Success confirmation screen
  if (orderSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Pedido Enviado Exitosamente! 🎉
          </h1>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-orange-800 font-semibold mb-2">
              📞 Te contactaremos pronto
            </p>
            <p className="text-sm text-orange-700">
              El equipo de <strong>{selectedLocation?.name}</strong> se comunicará contigo en los próximos minutos para confirmar tu pedido y coordinar la entrega.
            </p>
          </div>

          {/* Detailed Order Information */}
          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">📋 Número de pedido:</span>
              <span className="font-bold text-[#FF8C00]">#{orderNumber.toString().padStart(3, '0')}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">🏪 Sede:</span>
              <span className="font-medium">{selectedLocation?.name}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">👤 Cliente:</span>
              <span className="font-medium">{formData.name}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">📱 Teléfono:</span>
              <span className="font-medium">{formData.phone}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">📍 Dirección:</span>
              <span className="font-medium text-right">{formData.address}, {formData.neighborhood}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">💰 Total:</span>
              <span className="font-bold text-[#FF8C00] text-lg">${Math.round(total).toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">💳 Pago:</span>
              <span className="font-medium">{formData.paymentMethod}</span>
            </div>
          </div>

          {/* Order Items Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-blue-800 mb-3">🛒 Resumen del pedido:</h4>
            <div className="space-y-2 text-left">
              {cart.map((item, index) => (
                <div key={item.id} className="text-sm">
                  <span className="font-medium text-blue-700">
                    {index + 1}. {item.menuItem.name}
                    {item.withFries && ' + Papas'}
                  </span>
                  <span className="text-blue-600 ml-2">x{item.quantity}</span>
                  {item.customizations.length > 0 && (
                    <div className="text-xs text-blue-600 ml-4">
                      + {item.customizations.map(c => c.name.replace('AD ', '')).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Clock size={20} className="text-blue-600 mr-2" />
              <span className="font-bold text-blue-800">Tiempo estimado</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">45-60 minutos</p>
          </div>

          {/* Ticket Actions */}
          <div className="space-y-3 mb-6">
            <div className="flex gap-2">
              <button
                onClick={handleDownloadTicket}
                className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
              >
                <Download size={16} className="mr-1" />
                Descargar Ticket
              </button>
              <button
                onClick={handlePrintTicket}
                className="flex-1 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm"
              >
                <Printer size={16} className="mr-1" />
                Imprimir
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleFinish}
              className="w-full py-3 bg-[#FF8C00] text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg"
            >
              Finalizar
            </button>
          </div>

          {/* Hidden ticket content for printing */}
          <div ref={ticketRef} className="hidden">
            <pre>{generateTicketContent()}</pre>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Truck size={28} className="mr-2 text-[#FF8C00]" />
                Pedido a Domicilio
              </h1>
              <p className="text-gray-600">Selecciona tu sede y completa tus datos para procesar tu pedido</p>
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
          {/* Left Column - Location and Form */}
          <div className="space-y-6">
            {/* Location Selector */}
            <div data-tour="location-selector">
              <LocationSelector
                locations={locations}
                selectedLocation={selectedLocation}
                onSelectLocation={handleLocationSelect}
              />
            </div>

            {/* Form - only show if location is selected */}
            {selectedLocation && (
              <div className="bg-white rounded-lg shadow-md p-6" data-tour="delivery-form">
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

                  {/* Neighborhood - Changed to input field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Barrio *
                    </label>
                    <input
                      type="text"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                      placeholder="Escribe el nombre de tu barrio"
                    />
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800 font-medium mb-1">
                        📍 Zonas de entrega para {selectedLocation.name}:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedLocation.deliveryZones.map((zone, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                          >
                            {zone}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        Si tu barrio no está en la lista, escríbelo y confirmaremos la disponibilidad del servicio.
                      </p>
                    </div>
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
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6" data-tour="order-summary-delivery">
            <OrderSummary />
          </div>
        </div>

        {/* Tour Button */}
        {showTourButton && !orderSubmitted && (
          <TourButton 
            onStartTour={handleStartTour}
            variant="floating"
            size="md"
          />
        )}
      </div>
    </div>
  );
};

export default DeliveryForm;