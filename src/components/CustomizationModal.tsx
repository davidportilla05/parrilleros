import React, { useState, useRef, useEffect } from 'react';
import { MenuItem, CustomizationOption } from '../types';
import { useOrder } from '../context/OrderContext';
import { X, Plus, Minus } from 'lucide-react';

interface CustomizationModalProps {
  menuItem: MenuItem;
  options: CustomizationOption[];
  onClose: () => void;
  onItemAdded?: () => void; // Nueva prop para notificar cuando se añade un item
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({
  menuItem,
  options,
  onClose,
  onItemAdded,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<CustomizationOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [withFries, setWithFries] = useState(false);
  const { addToCart } = useOrder();
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar modal al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

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
    
    // Notificar que se añadió un item (para mostrar SuggestionsModal)
    if (onItemAdded) {
      onItemAdded();
    }
    
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
      <div className="mb-3 sm:mb-4">
        <h4 className="font-bold text-sm sm:text-base mb-2 flex items-center text-gray-800">
          <span className="mr-2 text-base sm:text-lg">{icon}</span>
          {title}
        </h4>
        <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
          {options.map((option) => (
            <label 
              key={option.id} 
              className={`flex items-center justify-between p-2 sm:p-2.5 rounded-lg border-2 transition-all cursor-pointer hover:shadow-sm ${
                selectedOptions.some(opt => opt.id === option.id)
                  ? 'border-[#FF8C00] bg-orange-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedOptions.some(opt => opt.id === option.id)}
                  onChange={() => toggleOption(option)}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-[#FF8C00] mr-2 sm:mr-3"
                />
                <span className="text-gray-800 font-medium text-xs sm:text-sm">
                  {option.name.replace('AD ', '')}
                </span>
              </div>
              {option.price > 0 && (
                <span className="font-bold text-[#FF8C00] text-xs sm:text-sm">
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-1 sm:p-4">
      <div ref={modalRef} className="bg-white rounded-xl w-full max-w-sm sm:max-w-lg max-h-[98vh] sm:max-h-[95vh] flex flex-col mx-1 sm:mx-4">
        {/* Header with image */}
        <div className="relative flex-shrink-0">
          <div className="h-24 sm:h-32 md:h-40 relative">
            <img 
              src={menuItem.image} 
              alt={menuItem.name} 
              className="w-full h-full object-cover rounded-t-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <button 
              onClick={onClose}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-white rounded-full p-1 sm:p-1.5 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X size={16} className="sm:hidden text-gray-800" />
              <X size={18} className="hidden sm:block text-gray-800" />
            </button>
            
            {/* Title overlay */}
            <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2">
              <h2 className="text-sm sm:text-lg md:text-xl font-bold text-white mb-0.5 sm:mb-1 line-clamp-1">{menuItem.name}</h2>
              <p className="text-white/90 text-xs sm:text-sm line-clamp-2">{menuItem.description}</p>
            </div>
          </div>
        </div>
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4">
          {/* Fries option - prominent placement */}
          {menuItem.priceWithFries && (
            <div className="mb-3 sm:mb-4">
              <label className={`flex items-center justify-between p-2.5 sm:p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-sm ${
                withFries
                  ? 'border-[#FF8C00] bg-orange-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={withFries}
                    onChange={() => setWithFries(!withFries)}
                    className="w-4 h-4 sm:w-5 sm:h-5 accent-[#FF8C00] mr-2 sm:mr-3"
                  />
                  <div>
                    <span className="text-sm sm:text-base font-bold text-gray-800">🍟 Agregar Papas</span>
                    <p className="text-xs text-gray-600 hidden sm:block">Papas francesas crujientes</p>
                  </div>
                </div>
                <span className="font-bold text-[#FF8C00] text-sm sm:text-base">
                  +${((menuItem.priceWithFries || menuItem.price) - menuItem.price).toLocaleString()}
                </span>
              </label>
            </div>
          )}

          {/* Organized customization options */}
          <div className="space-y-3 sm:space-y-4">
            <OptionGroup title="Proteínas" options={proteinOptions} icon="🥩" />
            <OptionGroup title="Quesos" options={cheeseOptions} icon="🧀" />
            <OptionGroup title="Vegetales y Extras" options={vegetableOptions} icon="🥬" />
            <OptionGroup title="Otros" options={otherOptions} icon="➕" />
          </div>
          
          {/* Special instructions */}
          <div className="mt-3 sm:mt-4">
            <h4 className="font-bold text-sm sm:text-base mb-2 flex items-center text-gray-800">
              <span className="mr-2 text-base sm:text-lg">📝</span>
              Instrucciones especiales
            </h4>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Ej: Sin cebolla, salsa aparte..."
              className="w-full p-2 sm:p-2.5 border-2 border-gray-200 rounded-lg resize-none h-12 sm:h-16 focus:ring-2 focus:ring-[#FF8C00] focus:border-[#FF8C00] transition-colors text-xs sm:text-sm"
            />
          </div>
        </div>
        
        {/* Fixed bottom section */}
        <div className="flex-shrink-0 p-2 sm:p-3 md:p-4 bg-gray-50 rounded-b-xl border-t">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center bg-white rounded-lg border-2 border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-l-lg transition-colors"
              >
                <Minus size={14} className="sm:hidden" />
                <Minus size={16} className="hidden sm:block" />
              </button>
              <span className="w-8 sm:w-12 text-center font-bold text-sm sm:text-base">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-r-lg transition-colors"
              >
                <Plus size={14} className="sm:hidden" />
                <Plus size={16} className="hidden sm:block" />
              </button>
            </div>
            <div className="text-lg sm:text-xl font-bold text-[#FF8C00]">
              ${Math.round(totalPrice).toLocaleString()}
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 sm:py-3 bg-[#FF8C00] text-white font-bold rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;