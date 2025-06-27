import React, { useState } from 'react';
import { MenuItem, CustomizationOption } from '../types';
import { useOrder } from '../context/OrderContext';
import { X, Plus, Minus } from 'lucide-react';

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

  // Group options by type for better organization
  const proteinOptions = options.filter(opt => 
    opt.name.includes('CARNE') || opt.name.includes('CHORIZO') || opt.name.includes('TOCINETA')
  );
  
  const cheeseOptions = options.filter(opt => 
    opt.name.includes('QUESO')
  );
  
  const vegetableOptions = options.filter(opt => 
    opt.name.includes('CEBOLLA') || opt.name.includes('PIÑA') || opt.name.includes('PEPINILLOS') || 
    opt.name.includes('JALAPEÑOS') || opt.name.includes('AROS')
  );
  
  const otherOptions = options.filter(opt => 
    !proteinOptions.includes(opt) && !cheeseOptions.includes(opt) && !vegetableOptions.includes(opt)
  );

  const OptionGroup = ({ title, options, icon }: { title: string; options: CustomizationOption[]; icon: string }) => {
    if (options.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h4 className="font-bold text-lg mb-3 flex items-center text-gray-800">
          <span className="mr-2 text-xl">{icon}</span>
          {title}
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {options.map((option) => (
            <label 
              key={option.id} 
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                selectedOptions.some(opt => opt.id === option.id)
                  ? 'border-[#FF8C00] bg-orange-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedOptions.some(opt => opt.id === option.id)}
                  onChange={() => toggleOption(option)}
                  className="w-5 h-5 accent-[#FF8C00] mr-3"
                />
                <span className="text-gray-800 font-medium">
                  {option.name.replace('AD ', '')}
                </span>
              </div>
              {option.price > 0 && (
                <span className="font-bold text-[#FF8C00] text-lg">
                  +${option.price.toLocaleString()}
                </span>
              )}
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] flex flex-col">
        {/* Header with image */}
        <div className="relative flex-shrink-0">
          <div className="h-40 relative">
            <img 
              src={menuItem.image} 
              alt={menuItem.name} 
              className="w-full h-full object-cover rounded-t-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-800" />
            </button>
            
            {/* Title overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white mb-1">{menuItem.name}</h2>
              <p className="text-white/90 text-sm">{menuItem.description}</p>
            </div>
          </div>
        </div>
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Fries option - prominent placement */}
          {menuItem.priceWithFries && (
            <div className="mb-6">
              <label className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                withFries
                  ? 'border-[#FF8C00] bg-orange-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={withFries}
                    onChange={() => setWithFries(!withFries)}
                    className="w-6 h-6 accent-[#FF8C00] mr-4"
                  />
                  <div>
                    <span className="text-lg font-bold text-gray-800">🍟 Agregar Papas</span>
                    <p className="text-sm text-gray-600">Papas francesas crujientes</p>
                  </div>
                </div>
                <span className="font-bold text-[#FF8C00] text-xl">
                  +${((menuItem.priceWithFries || menuItem.price) - menuItem.price).toLocaleString()}
                </span>
              </label>
            </div>
          )}

          {/* Organized customization options */}
          <div className="space-y-6">
            <OptionGroup title="Proteínas" options={proteinOptions} icon="🥩" />
            <OptionGroup title="Quesos" options={cheeseOptions} icon="🧀" />
            <OptionGroup title="Vegetales y Extras" options={vegetableOptions} icon="🥬" />
            <OptionGroup title="Otros" options={otherOptions} icon="➕" />
          </div>
          
          {/* Special instructions */}
          <div className="mt-6">
            <h4 className="font-bold text-lg mb-3 flex items-center text-gray-800">
              <span className="mr-2 text-xl">📝</span>
              Instrucciones especiales
            </h4>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Ej: Sin cebolla, salsa aparte..."
              className="w-full p-3 border-2 border-gray-200 rounded-lg resize-none h-20 focus:ring-2 focus:ring-[#FF8C00] focus:border-[#FF8C00] transition-colors"
            />
          </div>
        </div>
        
        {/* Fixed bottom section */}
        <div className="flex-shrink-0 p-6 bg-gray-50 rounded-b-xl border-t">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center bg-white rounded-lg border-2 border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-l-lg transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="w-16 text-center font-bold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-r-lg transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="text-2xl font-bold text-[#FF8C00]">
              ${Math.round(totalPrice).toLocaleString()}
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-[#FF8C00] text-white font-bold rounded-lg hover:bg-orange-600 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;