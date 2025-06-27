import React, { useState, useRef, useEffect } from 'react';
import { X, ShoppingCart, ArrowRight } from 'lucide-react';
import { MenuItem } from '../types';
import { useOrder } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';

interface SuggestionsModalProps {
  onClose: () => void;
  sides: MenuItem[];
  drinks: MenuItem[];
}

const SuggestionsModal: React.FC<SuggestionsModalProps> = ({ onClose, sides, drinks }) => {
  const { addToCart } = useOrder();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAddItem = (item: MenuItem) => {
    addToCart(item, 1, [], false, '');
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.add(item.id);
      return newSet;
    });
  };

  const handleContinue = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">¿Deseas agregar algo más?</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Sides Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Acompañamientos</h3>
            <div className="grid grid-cols-2 gap-4">
              {sides.map((item) => (
                <div 
                  key={item.id}
                  className={`relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer ${
                    selectedItems.has(item.id) ? 'ring-2 ring-[#FF8C00]' : ''
                  }`}
                  onClick={() => handleAddItem(item)}
                >
                  {selectedItems.has(item.id) && (
                    <div className="absolute top-2 right-2 bg-[#FF8C00] text-white rounded-full p-1">
                      <ShoppingCart size={16} />
                    </div>
                  )}
                  <div className="h-32 rounded-lg overflow-hidden mb-3">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-medium mb-1">{item.name}</h4>
                  <p className="text-[#FF8C00] font-bold">${item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Drinks Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Bebidas</h3>
            <div className="grid grid-cols-2 gap-4">
              {drinks.map((item) => (
                <div 
                  key={item.id}
                  className={`relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer ${
                    selectedItems.has(item.id) ? 'ring-2 ring-[#FF8C00]' : ''
                  }`}
                  onClick={() => handleAddItem(item)}
                >
                  {selectedItems.has(item.id) && (
                    <div className="absolute top-2 right-2 bg-[#FF8C00] text-white rounded-full p-1">
                      <ShoppingCart size={16} />
                    </div>
                  )}
                  <div className="h-32 rounded-lg overflow-hidden mb-3">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-medium mb-1">{item.name}</h4>
                  <p className="text-[#FF8C00] font-bold">${item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              No, gracias
            </button>
            <button
              onClick={handleContinue}
              className="flex items-center px-6 py-3 bg-[#FF8C00] text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Continuar con el pedido
              <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsModal;