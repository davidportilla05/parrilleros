import React, { useState } from 'react';
import { MenuItem, CustomizationOption } from '../types';
import { useOrder } from '../context/OrderContext';
import { X } from 'lucide-react';

interface CustomizationModalProps {
  menuItem: MenuItem;
  options: CustomizationOption[];
  onClose: () => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({
  menuItem,
  options,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<CustomizationOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [withFries, setWithFries] = useState(false);
  const { addToCart } = useOrder();

  const toggleOption = (option: CustomizationOption) => {
    if (option.name === 'Agregar papas (+$6.000)') {
      setWithFries(!withFries);
      return;
    }
    
    setSelectedOptions((prevOptions) => {
      const exists = prevOptions.some((item) => item.id === option.id);
      if (exists) {
        return prevOptions.filter((item) => item.id !== option.id);
      } else {
        return [...prevOptions, option];
      }
    });
  };

  const handleAddToCart = () => {
    const customizations = selectedOptions.filter(opt => opt.name !== 'Agregar papas (+$6.000)');
    addToCart(menuItem, quantity, customizations, withFries, specialInstructions);
    onClose();
  };

  const basePrice = withFries ? (menuItem.priceWithFries || menuItem.price) : menuItem.price;
  const optionsPrice = selectedOptions
    .filter(opt => opt.name !== 'Agregar papas (+$6.000)')
    .reduce((sum, option) => sum + option.price, 0);
  const totalPrice = (basePrice + optionsPrice) * quantity;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <div className="h-48">
            <img 
              src={menuItem.image} 
              alt={menuItem.name} 
              className="w-full h-full object-cover rounded-t-xl"
            />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X size={24} className="text-gray-800" />
            </button>
          </div>
          
          {/* Badges Section */}
          {menuItem.badges && menuItem.badges.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex gap-2">
                {menuItem.badges.map((badge, index) => (
                  <img
                    key={index}
                    src={badge}
                    alt="Badge"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{menuItem.name}</h2>
          <p className="text-gray-600 mb-4">{menuItem.description}</p>
          
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <h3 className="font-bold text-lg mb-3">Personalizar</h3>
            <div className="space-y-3">
              {options.map((option) => (
                <label 
                  key={option.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={option.name === 'Agregar papas (+$6.000)' ? withFries : selectedOptions.some(opt => opt.id === option.id)}
                      onChange={() => toggleOption(option)}
                      className="w-5 h-5 accent-[#FF8C00]"
                    />
                    <span className="ml-3 text-gray-800">{option.name}</span>
                  </div>
                  {option.price > 0 && (
                    <span className="font-medium text-[#FF8C00]">+${option.price.toLocaleString()}</span>
                  )}
                </label>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">Instrucciones especiales</h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Ej: Sin cebolla, salsa aparte..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
            ></textarea>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center bg-gray-100 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-l-lg transition-colors"
              >
                -
              </button>
              <span className="w-10 text-center font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-r-lg transition-colors"
              >
                +
              </button>
            </div>
            <div className="text-xl font-bold text-[#FF8C00]">${totalPrice.toLocaleString()}</div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-[#FF8C00] text-white font-bold rounded-lg hover:bg-orange-600 transition-colors text-lg"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;