import React, { useState, useEffect } from 'react';
import { Beef, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Start animation when component mounts
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    navigate('/menu');
  };

  return (
    <div 
      className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden"
      onClick={handleStart}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[#FF8C00] opacity-10"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#FF8C00] opacity-5"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-white opacity-5"></div>
      </div>
      
      {/* Logo and Content */}
      <div className={`transform transition-all duration-1000 ease-out ${isAnimating ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="mb-8 animate-pulse">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-[#FF8C00] rounded-full mb-6">
            <Beef size={80} className="text-white" />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-2">PARRILLEROS</h1>
          <p className="text-2xl text-[#FF8C00] font-bold">FAST FOOD</p>
        </div>
        
        <div className={`transition-all duration-700 delay-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-white text-xl mb-12 max-w-md mx-auto">
            Bienvenido a tu experiencia de autoservicio. Toque la pantalla para comenzar su pedido.
          </p>
          
          <div className="inline-flex items-center bg-[#FF8C00] text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-orange-600 transition-colors cursor-pointer animate-bounce">
            Toque para comenzar
            <ArrowRight size={24} className="ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;