// ✅ Requiere: npm install react-leaflet@4 leaflet

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, CreditCard, Mail, FileText, ArrowLeft, Send, CheckCircle, Clock, Truck } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import OrderSummary from './OrderSummary';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🔧 Fix icon issue in Leaflet
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const LocationPicker = ({ setSelectedLocation }) => {
  useMapEvents({
    click(e) {
      setSelectedLocation(e.latlng);
    }
  });
  return null;
};

const DeliveryForm = ({ onBack }) => {
  const navigate = useNavigate();
  const { cart, total, clearCart, orderNumber } = useOrder();

  const [formData, setFormData] = useState({
    name: '', address: '', neighborhood: '', phone: '', cedula: '', email: '', paymentMethod: '',
    location: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const paymentMethods = ['Efectivo', 'Bancolombia', 'Nequi', 'Daviplata'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.name && formData.address && formData.neighborhood &&
      formData.phone && formData.cedula && formData.email && formData.paymentMethod &&
      cart.length > 0 && formData.location;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSubmitted(true);
      setTimeout(() => {
        clearCart();
        navigate('/');
      }, 5000);
    }, 2000);
  };

  const handleFinish = () => {
    clearCart();
    navigate('/');
  };

  if (orderSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">¡Pedido Enviado Exitosamente!</h1>
          <p className="text-gray-600">Te contactaremos pronto</p>
          <button onClick={handleFinish} className="mt-4 bg-orange-500 text-white px-4 py-2 rounded">Finalizar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center mb-4">
            <button onClick={onBack} className="mr-4 p-2 bg-gray-100 rounded-full">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Truck size={24} className="mr-2 text-orange-500" /> Pedido a Domicilio
              </h1>
              <p className="text-gray-500">Completa tus datos para procesar tu pedido</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">Datos de Entrega</h2>

            <div className="space-y-4">
              {/* Form Fields */}
              <input className="w-full p-3 border rounded-lg" placeholder="Nombre" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
              <input className="w-full p-3 border rounded-lg" placeholder="Dirección" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} />
              <input className="w-full p-3 border rounded-lg" placeholder="Barrio" value={formData.neighborhood} onChange={(e) => handleInputChange('neighborhood', e.target.value)} />
              <input className="w-full p-3 border rounded-lg" placeholder="Teléfono" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
              <input className="w-full p-3 border rounded-lg" placeholder="Cédula" value={formData.cedula} onChange={(e) => handleInputChange('cedula', e.target.value)} />
              <input className="w-full p-3 border rounded-lg" placeholder="Correo electrónico" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
              <select className="w-full p-3 border rounded-lg" value={formData.paymentMethod} onChange={(e) => handleInputChange('paymentMethod', e.target.value)}>
                <option value="">Selecciona forma de pago</option>
                {paymentMethods.map((m) => <option key={m}>{m}</option>)}
              </select>

              <div>
                <label className="block font-medium mb-2">📍 Ubicación en el mapa *</label>
                <div className="h-64 rounded-lg overflow-hidden border">
                  <MapContainer
                    center={[1.2136, -77.2811]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <LocationPicker setSelectedLocation={(loc) => handleInputChange('location', loc)} />
                    {formData.location && <Marker position={formData.location} icon={markerIcon} />}
                  </MapContainer>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-3 font-bold rounded-lg text-lg transition-all ${
                  isFormValid() && !isSubmitting
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Pedido'}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryForm;
