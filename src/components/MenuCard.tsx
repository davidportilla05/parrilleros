import React from 'react';
import { Plus, Tag } from 'lucide-react';
import { MenuItem } from '../types';
import { useOrder } from '../context/OrderContext';

interface MenuCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onClick }) => {
  const { name, description, price, image, category } = item;
  const { addToCart } = useOrder();

  const handleClick = () => {
    if (category === 'sides' || category === 'drinks') {
      addToCart(item, 1, [], false, '');
    } else {
      onClick(item);
    }
  };

  const isBurger = category.includes('burgers');
  const isAddition = name.startsWith('AD ');

  // Format the description to be more readable
  const formattedDescription = description
    .split(',')
    .map(part => part.trim())
    .join(' • ');

  return (
    <div 
      className={`group relative bg-white rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${
        isAddition ? 'border-2 border-[#FF8C00]/20' : ''
      }`}
      onClick={handleClick}
    >
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        
        {/* Price Tag */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-[#FF8C00] text-white px-4 py-2 rounded-full font-bold shadow-lg">
            ${price.toLocaleString()}
          </div>
          {item.priceWithFries && (
            <div className="mt-2 bg-white text-[#FF8C00] px-3 py-1 rounded-full text-sm font-medium shadow-lg text-center">
              Con papas: ${item.priceWithFries.toLocaleString()}
            </div>
          )}
        </div>

        {/* Category Badge */}
        {isBurger && (
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-full font-medium">
              {category === 'classic-burgers' ? '🍔 Clásica' : 
               category === 'deluxe-burgers' ? '👑 Deluxe' : 
               '🏆 Burger Master'}
            </div>
          </div>
        )}

        {/* Name and Short Description Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <h3 className="text-xl font-bold text-white group-hover:text-[#FF8C00] transition-colors line-clamp-1">
            {name}
          </h3>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {formattedDescription}
        </p>

        {/* Badges */}
        {item.badges && item.badges.length > 0 && (
          <div className="flex gap-1 mb-4">
            {item.badges.map((badge, index) => (
              <img
                key={index}
                src={badge}
                alt="Badge"
                className="w-8 h-8 rounded-full border-2 border-white shadow-md"
              />
            ))}
          </div>
        )}
        
        {/* Add to Cart Button */}
        <button 
          className={`flex items-center justify-center w-full py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
            isAddition 
              ? 'bg-orange-50 text-[#FF8C00] hover:bg-[#FF8C00] hover:text-white'
              : 'bg-[#FF8C00] text-white hover:bg-orange-600'
          }`}
        >
          <Plus size={18} className="mr-2" />
          <span>{isAddition ? 'Agregar adición' : 'Agregar al carrito'}</span>
        </button>
      </div>
    </div>
  );
};

export default MenuCard;