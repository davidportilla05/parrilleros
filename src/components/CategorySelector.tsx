import React from 'react';
import { Beef, Coffee, IceCream, Salad } from 'lucide-react';
import { Category } from '../types';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const getIconForCategory = (iconName: string) => {
    switch (iconName) {
      case 'beef':
        return <Beef size={24} />;
      case 'french-fries':
        return <Salad size={24} />;
      case 'cup-soda':
        return <Coffee size={24} />;
      case 'ice-cream':
        return <IceCream size={24} />;
      default:
        return <Beef size={24} />;
    }
  };

  // Filter non-burger categories
  const nonBurgerCategories = categories.filter(
    cat => !cat.id.includes('burgers') || cat.id === 'burgers'
  );

  // Get burger subcategories
  const burgerCategories = categories.filter(
    cat => cat.id.includes('burgers') && cat.id !== 'burgers'
  );

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 mt-18">
      {/* Main categories */}
      <div className="flex space-x-4 overflow-x-auto px-2 pb-4">
        {nonBurgerCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex flex-col items-center px-6 py-3 rounded-xl transition-all transform hover:scale-105 ${
              selectedCategory === category.id
                ? 'bg-[#FF8C00] text-white shadow-lg scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className={`mb-2 ${selectedCategory === category.id ? 'text-white' : 'text-[#FF8C00]'}`}>
              {getIconForCategory(category.icon)}
            </div>
            <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Burger subcategories - always visible */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {burgerCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-[#FF8C00] text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-[#FF8C00] hover:text-white'
            }`}
          >
            {category.name.replace('Hamburguesas ', '')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;