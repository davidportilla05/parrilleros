import React from 'react';
import { CreditCard, Banknote, QrCode } from 'lucide-react';
import { PaymentMethod as PaymentMethodType } from '../types';

interface PaymentMethodProps {
  selectedMethod: PaymentMethodType | null;
  onSelectMethod: (method: PaymentMethodType) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const paymentMethods = [
    { id: 'card' as const, name: 'Tarjeta', icon: <CreditCard size={28} /> },
    { id: 'cash' as const, name: 'Efectivo', icon: <Banknote size={28} /> },
    { id: 'qr' as const, name: 'Código QR', icon: <QrCode size={28} /> },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Método de pago</h2>
      <div className="grid grid-cols-3 gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all ${
              selectedMethod === method.id
                ? 'border-[#FF8C00] bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`mb-3 ${selectedMethod === method.id ? 'text-[#FF8C00]' : 'text-gray-600'}`}>
              {method.icon}
            </div>
            <span className={`font-medium ${selectedMethod === method.id ? 'text-[#FF8C00]' : 'text-gray-800'}`}>
              {method.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;