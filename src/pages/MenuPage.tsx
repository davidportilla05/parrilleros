import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import CategorySelector from '../components/CategorySelector';
import MenuCard from '../components/MenuCard';
import CustomizationModal from '../components/CustomizationModal';
import SuggestionsModal from '../components/SuggestionsModal';
import SearchBar from '../components/SearchBar';
import { categories, menuItems, customizationOptions } from '../data/menu';
import { MenuItem } from '../types';
import { useOrder } from '../context/OrderContext';

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useOrder();
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    let items = menuItems.filter((item) => item.category === selectedCategory);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      items = items.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }
    
    return items;
  }, [selectedCategory, searchQuery]);

  // Global search across all items
  const globalSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    return menuItems.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const sides = menuItems.filter((item) => item.category === 'sides');
  const drinks = menuItems.filter((item) => item.category === 'drinks');

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    const isBurgerCategory = selectedItem?.category.includes('burger');
    setSelectedItem(null);
    
    // Only show suggestions modal for burger categories
    if (isBurgerCategory) {
      setShowSuggestions(true);
    }
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Show global search results when searching
  const itemsToShow = searchQuery.trim() ? globalSearchResults : filteredItems;
  const showCategorySelector = !searchQuery.trim();

  return (
    <Layout title="Menú" showCart={false}>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Back Button */}
        <div className="max-w-4xl mx-auto mb-6">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center bg-white hover:bg-[#FF8C00] text-[#FF8C00] hover:text-white px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-[#FF8C00] font-semibold"
          >
            <ArrowLeft 
              size={20} 
              className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" 
            />
            <span className="text-sm sm:text-base">Volver al inicio</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Buscar hamburguesas, bebidas, acompañamientos..."
          />
        </div>

        {/* Category Selector - only show when not searching */}
        {showCategorySelector && (
          <div className="max-w-4xl mx-auto mb-12">
            <CategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        )}

        {/* Search Results Header */}
        {searchQuery.trim() && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-xl font-bold text-gray-800">
                Resultados para "{searchQuery}"
              </h2>
              <p className="text-gray-600">
                {itemsToShow.length} producto{itemsToShow.length !== 1 ? 's' : ''} encontrado{itemsToShow.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Menu Grid */}
        {itemsToShow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {itemsToShow.map((item) => (
              <MenuCard key={item.id} item={item} onClick={handleItemClick} />
            ))}
          </div>
        ) : searchQuery.trim() ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">
                <SearchBar onSearch={() => {}} placeholder="" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-4">
                No hay productos que coincidan con "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="bg-[#FF8C00] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Ver todos los productos
              </button>
            </div>
          </div>
        ) : null}

        {selectedItem && (
          <CustomizationModal
            menuItem={selectedItem}
            options={customizationOptions.filter(
              (option) => selectedItem.category !== 'burgers' || 
                        option.id <= 10
            )}
            onClose={handleCloseModal}
          />
        )}

        {showSuggestions && (
          <SuggestionsModal
            onClose={handleCloseSuggestions}
            sides={sides}
            drinks={drinks}
          />
        )}
        
        {/* Floating cart button */}
        {cartTotal > 0 && (
          <div className="fixed bottom-8 right-8 z-50">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center bg-[#FF8C00] text-white px-6 py-4 rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-105 hover:shadow-xl"
            >
              <ShoppingCart size={28} />
              <span className="ml-3 font-bold text-lg">{cartTotal}</span>
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MenuPage;