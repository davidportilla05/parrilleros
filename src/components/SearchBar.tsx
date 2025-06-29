import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Buscar productos..." }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8C00] transition-colors duration-300">
          <Search size={22} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl shadow-md focus:ring-4 focus:ring-[#FF8C00]/20 focus:border-[#FF8C00] focus:shadow-lg hover:border-gray-300 hover:shadow-lg transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium text-base outline-none"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition-all duration-300 hover:scale-110"
          >
            <X size={20} />
          </button>
        )}
        
        {/* Subtle gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF8C00]/10 to-orange-300/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"></div>
      </div>
      
      {/* Search suggestions hint */}
      {!query && (
        <div className="absolute top-full left-0 right-0 mt-1 mb-10 text-center">
          <p className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm inline-block">
            💡 Prueba: "hamburguesa", "bebidas", "papas"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;