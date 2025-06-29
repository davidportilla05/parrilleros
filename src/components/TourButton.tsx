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

  const baseClasses = "flex items-center justify-center font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg";
  
  const variantClasses = {
    floating: "fixed z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full backdrop-blur-sm",
    inline: "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg"
  };

  const sizeClasses = {
    sm: variant === 'floating' ? "w-10 h-10" : "px-2 py-1 text-xs",
    md: variant === 'floating' ? "w-12 h-12" : "px-3 py-2 text-sm",
    lg: variant === 'floating' ? "w-14 h-14" : "px-4 py-2 text-base",
    xl: variant === 'floating' ? "w-16 h-16" : "px-6 py-3 text-lg"
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      title="Ayuda - Tour guiado"
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