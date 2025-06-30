import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TourButton from '../components/TourButton';
import { useOrder } from '../context/OrderContext';
import OrderSummary from '../components/OrderSummary';
import DeliveryForm from '../components/DeliveryForm';
import { useDriverTour, cartTourSteps } from '../hooks/useDriverTour';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useOrder();
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [showTourButton, setShowTourButton] = useState(true);

  const { startTour } = useDriverTour({
    steps: cartTourSteps,
    onDestroyed: () => {
      setShowTourButton(false);
      setTimeout(() => {
        setShowTourButton(true);
      }, 30000);
    }
  });

  // Auto-start tour for first-time users
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('parrilleros-cart-tour-seen');
    if (!hasSeenTour && cart.length > 0) {
      const timer = setTimeout(() => {
        startTour();
        localStorage.setItem('parrilleros-cart-tour-seen', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [startTour, cart.length]);
  
  const handleBackToMenu = () => {
    navigate('/menu');
  };

  const handleOrderDelivery = () => {
    setShowDeliveryForm(true);
  };

  const handleBackFromDelivery = () => {
    setShowDeliveryForm(false);
  };

  const handleStartTour = () => {
    startTour();
  };

  if (showDeliveryForm) {
    return <DeliveryForm onBack={handleBackFromDelivery} />;
  }

  return (
    <Layout title="Tu pedido" showBack onBack={handleBackToMenu}>
      <div className="container mx-auto max-w-2xl py-6 px-4">
        <div data-tour="order-summary">
          <OrderSummary />
        </div>
        
        <div className="mt-6 flex flex-col gap-4">
          {cart.length > 0 && (
            <button
              data-tour="delivery-button"
              onClick={handleOrderDelivery}
              className="w-full py-4 bg-[#FF8C00] text-white font-bold rounded-lg hover:bg-orange-600 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              🛵 Pedir a Domicilio
            </button>
          )}
          
          <button
            data-tour="add-more-button"
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

        {/* Tour Button - Pequeño en esquina inferior izquierda */}
        {showTourButton && cart.length > 0 && (
          <TourButton 
            onStartTour={handleStartTour}
            variant="floating"
            size="sm"
            className="bottom-6 left-6"
          />
        )}
      </div>
    </Layout>
  );
};

export default CartPage;