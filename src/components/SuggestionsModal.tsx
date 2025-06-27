import React, { useState, useRef, useEffect } from 'react';
import { X, ShoppingCart, ArrowRight, Plus } from 'lucide-react';
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

  // Get popular sides (first few items)
  const popularSides = sides.slice(0, 4);

  // Categorize drinks
  const gaseosas = drinks.filter(drink => 
    drink.name.includes('GASEOSA') || drink.name.includes('COCA')
  );

  const limonadas = drinks.filter(drink => 
    drink.name.includes('LIMONADA')
  );

  const jugosNaturales = drinks.filter(drink => 
    drink.name.includes('JUGO NATURAL')
  ).slice(0, 6); // Limit to 6 for mobile

  const otherDrinks = drinks.filter(drink => 
    !gaseosas.includes(drink) && 
    !limonadas.includes(drink) && 
    !jugosNaturales.includes(drink)
  ).slice(0, 4); // Limit for mobile

  const ProductCard = ({ item }: { item: MenuItem }) => (
    <div 
      className={`relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer border-2 ${
        selectedItems.has(item.id) ? 'border-[#FF8C00] ring-2 ring-[#FF8C00]/20' : 'border-gray-100 hover:border-gray-200'
      }`}
      onClick={() => handleAddItem(item)}
    >
      {selectedItems.has(item.id) && (
        <div className="absolute top-1 right-1 bg-[#FF8C00] text-white rounded-full p-1 z-10 shadow-lg">
          <ShoppingCart size={12} />
        </div>
      )}
      
      <div className="h-16 sm:h-20 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
        />
      </div>
      
      <div className="p-2">
        <h4 className="font-bold text-gray-800 mb-1 text-xs sm:text-sm line-clamp-1">{item.name}</h4>
        <p className="text-[#FF8C00] font-bold text-sm">${item.price.toLocaleString()}</p>
        
        <button className={`w-full mt-1.5 py-1 px-2 rounded text-xs font-medium transition-all ${
          selectedItems.has(item.id)
            ? 'bg-[#FF8C00] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-[#FF8C00] hover:text-white'
        }`}>
          {selectedItems.has(item.id) ? (
            <span className="flex items-center justify-center">
              <ShoppingCart size={10} className="mr-1" />
              Agregado
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Plus size={10} className="mr-1" />
              Agregar
            </span>
          )}
        </button>
      </div>
    </div>
  );

  const DrinkCategory = ({ title, drinks, icon }: { title: string; drinks: MenuItem[]; icon: string }) => {
    if (drinks.length === 0) return null;
    
    return (
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-base mr-1">{icon}</span>
          <h4 className="text-sm font-bold text-gray-800">{title}</h4>
          <span className="ml-1 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
            {drinks.length}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {drinks.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div ref={modalRef} className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] flex flex-col mx-2 sm:mx-4">
        {/* Header */}
        <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">¿Deseas agregar algo más?</h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Completa tu pedido con nuestros acompañamientos y bebidas</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {/* Sides Section */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <span className="text-lg mr-2">🍟</span>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">Acompañamientos</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {popularSides.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Drinks Section - Organized by categories */}
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <span className="text-lg mr-2">🥤</span>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">Bebidas</h3>
              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {drinks.length} opciones
              </span>
            </div>
            
            <div className="space-y-4">
              <DrinkCategory title="Gaseosas" drinks={gaseosas} icon="🥤" />
              <DrinkCategory title="Limonadas" drinks={limonadas.slice(0, 4)} icon="🍋" />
              <DrinkCategory title="Jugos Naturales" drinks={jugosNaturales} icon="🧃" />
              {otherDrinks.length > 0 && (
                <DrinkCategory title="Otras Bebidas" drinks={otherDrinks} icon="🥤" />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              No, gracias
            </button>
            
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              {selectedItems.size > 0 && (
                <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border text-center">
                  {selectedItems.size} producto{selectedItems.size > 1 ? 's' : ''} agregado{selectedItems.size > 1 ? 's' : ''}
                </span>
              )}
              
              <button
                onClick={handleContinue}
                className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-[#FF8C00] text-white rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm"
              >
                Continuar con el pedido
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsModal;