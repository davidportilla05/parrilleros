import React from 'react';
import { Beef, ShoppingCart } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showCart?: boolean;
  showBack?: boolean;
  onBack?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  showCart = false,
  showBack = false,
  onBack
}) => {
  const { cart } = useOrder();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-[#1A1A1A] text-white p-4 shadow-md relative z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {showBack && (
              <button 
                onClick={onBack}
                className="mr-4 p-2 bg-[#FF8C00] rounded-full hover:bg-orange-500 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            <div className="flex items-center">
              <Beef size={32} className="mr-2 text-[#FF8C00]" />
              <h1 className="text-2xl font-bold font-heavyrust-primary">PARRILLEROS</h1>
            </div>
          </div>
          
          {title && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h2 className="text-xl font-semibold">{title}</h2>
            </div>
          )}

          {showCart && (
            <div className="relative">
              <button className="p-2 bg-[#FF8C00] rounded-full hover:bg-orange-500 transition-colors">
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#FF8C00] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content with Background */}
      <main className="flex-1 menu-page-bg">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white p-4 text-center">
        <p className="text-sm">&copy; 2025 <span className="font-heavyrust-primary">PARRILLEROS</span> <span className="font-bebas-neue-primary">FAST FOOD</span></p>
      </footer>
    </div>
  );
};

export default Layout;