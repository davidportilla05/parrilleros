import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useOrder } from '../context/OrderContext';
import OrderSummary from '../components/OrderSummary';
import DeliveryForm from '../components/DeliveryForm';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useOrder();
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  
  const handleBackToMenu = () => {
    navigate('/menu');
  };

  const handleOrderDelivery = () => {
    setShowDeliveryForm(true);
  };

  const handleBackFromDelivery = () => {
    setShowDeliveryForm(false);
  };

  if (showDeliveryForm) {
    return <DeliveryForm onBack={handleBackFromDelivery} />;
  }

  return (
    <Layout title="Tu pedido" showBack onBack={handleBackToMenu}>
      <div className="container mx-auto max-w-2xl py-6 px-4">
        <OrderSummary />
        
        <div className="mt-6 flex flex-col gap-4">
          {cart.length > 0 && (
            <button
              onClick={handleOrderDelivery}
              className="w-full py-4 bg-[#FF8C00] text-white font-bold rounded-lg hover:bg-orange-600 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              🛵 Pedir a Domicilio
            </button>
          )}
          
          <button
            onClick={handleBackToMenu}
            className={`w-full py-3 ${
              cart.length > 0 
                ? 'bg-white text-[#FF8C00] border border-[#FF8C00]' 
                : 'bg-[#FF8C00] text-white'
            } font-bold rounded-lg hover:bg-orange-100 transition-colors`}
          >
            {cart.length > 0 ? 'Agregar más productos' : 'Volver al menú'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;