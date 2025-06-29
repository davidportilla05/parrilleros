import React from 'react';
import { HelpCircle, Play } from 'lucide-react';

interface TourButtonProps {
  onStartTour: () => void;
  variant?: 'floating' | 'inline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const TourButton: React.FC<TourButtonProps> = ({ 
  onStartTour, 
  variant = 'floating',
  size = 'md',
  className = '',
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    } else {
      onStartTour();
    }
  };

  const baseClasses = "flex items-center justify-center font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl";
  
  const variantClasses = {
    floating: "fixed bottom-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full",
    inline: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-2 border-blue-200 hover:border-blue-300 rounded-xl"
  };

  const sizeClasses = {
    sm: variant === 'floating' ? "w-12 h-12" : "px-3 py-2 text-sm",
    md: variant === 'floating' ? "w-14 h-14" : "px-4 py-2.5 text-base",
    lg: variant === 'floating' ? "w-16 h-16" : "px-8 py-4 text-xl",
    xl: variant === 'floating' ? "w-20 h-20" : "px-12 py-6 text-2xl"
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28,
    xl: 36
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      title="Iniciar tour guiado"
      aria-label="Iniciar tour guiado del sistema"
    >
      {variant === 'floating' ? (
        <HelpCircle size={iconSizes[size]} />
      ) : (
        <>
          <Play size={iconSizes[size]} className="mr-3" />
          <span className="font-bold">Tour Guiado</span>
        </>
      )}
    </button>
  );
};

export default TourButton;