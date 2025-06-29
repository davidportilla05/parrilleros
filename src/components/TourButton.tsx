import React from 'react';
import { HelpCircle, Play } from 'lucide-react';

interface TourButtonProps {
  onStartTour: () => void;
  variant?: 'floating' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TourButton: React.FC<TourButtonProps> = ({ 
  onStartTour, 
  variant = 'floating',
  size = 'md',
  className = ''
}) => {
  const baseClasses = "flex items-center justify-center font-medium transition-all duration-300 hover:scale-105 active:scale-95";
  
  const variantClasses = {
    floating: "fixed bottom-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl",
    inline: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-2 border-blue-200 hover:border-blue-300 rounded-lg"
  };

  const sizeClasses = {
    sm: variant === 'floating' ? "w-12 h-12" : "px-3 py-2 text-sm",
    md: variant === 'floating' ? "w-14 h-14" : "px-4 py-2.5 text-base",
    lg: variant === 'floating' ? "w-16 h-16" : "px-6 py-3 text-lg"
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button
      onClick={onStartTour}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      title="Iniciar tour guiado"
      aria-label="Iniciar tour guiado del sistema"
    >
      {variant === 'floating' ? (
        <HelpCircle size={iconSizes[size]} />
      ) : (
        <>
          <Play size={iconSizes[size]} className="mr-2" />
          <span>Tour Guiado</span>
        </>
      )}
    </button>
  );
};

export default TourButton;