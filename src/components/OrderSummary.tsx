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

  // Cálculos de impuestos corregidos - solo IVA
  const subtotal = orderTotal * 0.92; // Base gravable (92%)
  const iva = orderTotal * 0.08; // IVA (8%)

  return (
    <div className={`${isReceipt ? 'text-sm' : 'bg-white rounded-lg shadow-md p-6'}`}>
      {!isReceipt && (
        <h2 className="text-xl font-bold mb-4 text-gray-800">Tu Pedido</h2>
      )}

      {showItems && (
        <div className={`${isReceipt ? 'mb-3' : 'max-h-[400px] overflow-y-auto pr-2 mb-4'}`}>
          {items.map((item) => (
            <div key={item.id} className={`${isReceipt ? 'mb-2 pb-2 border-b border-gray-100' : ''}`}>
              <CartItem item={item} readOnly={isReceipt} />
            </div>
          ))}
        </div>
      )}

      <div className={`border-t border-gray-200 pt-3 ${isReceipt ? 'text-xs' : ''}`}>
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">${Math.round(subtotal).toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">IVA (8%):</span>
          <span className="font-medium">${Math.round(iva).toLocaleString()}</span>
        </div>
        <div className={`flex justify-between font-bold mt-2 pt-2 border-t border-gray-200 ${isReceipt ? 'text-sm' : 'text-lg'}`}>
          <span>Total:</span>
          <span className="text-[#FF8C00]">${Math.round(orderTotal).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;