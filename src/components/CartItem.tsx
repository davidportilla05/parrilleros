import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { useOrder } from '../context/OrderContext';

interface CartItemProps {
  item: CartItemType;
  readOnly?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({ item, readOnly = false }) => {
  const { menuItem, quantity, customizations, specialInstructions, withFries } = item;
  const { updateQuantity, removeFromCart } = useOrder();

  const basePrice = withFries ? (menuItem.priceWithFries || menuItem.price) : menuItem.price;
  const customizationsTotal = customizations.reduce(
    (sum, option) => sum + option.price,
    0
  );

  const itemTotal = (basePrice + customizationsTotal) * quantity;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
            <img
              src={menuItem.image}
              alt={menuItem.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">
              {menuItem.name}
              {withFries && ' + Papas'}
            </h3>
            {customizations.length > 0 && (
              <div className="mt-1">
                <p className="text-sm text-gray-600">
                  {customizations.map((c) => c.name).join(', ')}
                </p>
              </div>
            )}
            {specialInstructions && (
              <p className="text-xs italic text-gray-500 mt-1">
                {specialInstructions}
              </p>
            )}
          </div>
        </div>
        <span className="font-bold text-[#FF8C00]">${Math.round(itemTotal).toLocaleString()}</span>
      </div>

      {!readOnly && (
        <div className="flex justify-between items-center mt-3">
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-gray-500 hover:text-red-600 transition-colors"
          >
            <Trash2 size={20} />
          </button>

          <div className="flex items-center bg-gray-100 rounded-md">
            <button
              onClick={() => updateQuantity(item.id, quantity - 1)}
              className="p-2 hover:bg-gray-200 rounded-l-md"
            >
              <Minus size={18} />
            </button>
            <span className="px-4 py-1 font-semibold">{quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, quantity + 1)}
              className="p-2 hover:bg-gray-200 rounded-r-md"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;