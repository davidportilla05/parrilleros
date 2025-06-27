import React from 'react';
import { useOrder } from '../context/OrderContext';
import CartItem from './CartItem';
import { ShoppingBag } from 'lucide-react';

interface OrderSummaryProps {
  showItems?: boolean;
  isReceipt?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  showItems = true, 
  isReceipt = false 
}) => {
  const { cart, total, orderNumber, currentOrder } = useOrder();
  const items = isReceipt && currentOrder ? currentOrder.items : cart;
  const orderTotal = isReceipt && currentOrder ? currentOrder.total : total;

  if (items.length === 0 && !isReceipt) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-gray-400 my-8">
          <ShoppingBag size={64} className="mx-auto mb-4" />
          <p className="text-lg font-medium">Tu carrito está vacío</p>
          <p className="mt-2">Añade productos del menú para comenzar tu pedido</p>
        </div>
      </div>
    );
  }

  const subtotal = orderTotal * 0.92;
  const iva = orderTotal * 0.08;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${isReceipt ? 'max-w-md mx-auto print-content' : ''}`}>
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {isReceipt ? 'Resumen del Pedido' : 'Tu Pedido'}
      </h2>

      {showItems && (
        <div className={`${isReceipt ? '' : 'max-h-[400px] overflow-y-auto pr-2'} mb-4`}>
          {items.map((item) => (
            <CartItem key={item.id} item={item} readOnly={isReceipt} />
          ))}
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">${Math.round(subtotal).toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">IVA (8%):</span>
          <span className="font-medium">${Math.round(iva).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
          <span>Total:</span>
          <span className="text-[#FF8C00]">${Math.round(orderTotal).toLocaleString()}</span>
        </div>
      </div>

      {isReceipt && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Número de orden:</span>
            <span className="font-bold">#{orderNumber.toString().padStart(3, '0')}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Fecha:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Hora:</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="mt-6 text-center">
            <p className="font-bold text-lg">¡Gracias por tu compra!</p>
            <p className="text-gray-600 mt-2">Tu pedido estará listo en aproximadamente 15-20 minutos</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary