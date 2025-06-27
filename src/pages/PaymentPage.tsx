import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import OrderSummary from '../components/OrderSummary';
import PaymentMethod from '../components/PaymentMethod';
import { useOrder } from '../context/OrderContext';
import { PaymentMethod as PaymentMethodType } from '../types';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { setPaymentMethod, paymentMethod, completeOrder, cart } = useOrder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleBack = () => {
    navigate('/cart');
  };

  const handleSelectMethod = (method: PaymentMethodType) => {
    setPaymentMethod(method);
  };

  const handleConfirmPayment = () => {
    if (!paymentMethod || cart.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // Show completion message briefly before navigating
      setTimeout(() => {
        completeOrder();
        navigate('/ticket');
      }, 1500);
    }, 2000);
  };

  return (
    <Layout title="Pago" showBack onBack={handleBack}>
      <div className="container mx-auto max-w-2xl py-6 px-4">
        <div className="mb-6">
          <OrderSummary showItems={false} />
        </div>
        
        <PaymentMethod 
          selectedMethod={paymentMethod}
          onSelectMethod={handleSelectMethod}
        />
        
        <div className="mt-6">
          <button
            onClick={handleConfirmPayment}
            disabled={!paymentMethod || isProcessing || isComplete}
            className={`w-full py-4 font-bold rounded-lg text-lg flex items-center justify-center ${
              !paymentMethod || isProcessing || isComplete
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#FF8C00] text-white hover:bg-orange-600'
            } transition-colors`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                  <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando pago...
              </>
            ) : isComplete ? (
              <>
                <CheckCircle size={24} className="mr-2" />
                ¡Pago completado!
              </>
            ) : (
              <>
                <CreditCard size={24} className="mr-2" />
                Confirmar pago
              </>
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;