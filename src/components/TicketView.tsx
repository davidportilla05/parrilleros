import React, { useRef, useEffect } from 'react';
import { Check, Printer } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import OrderSummary from './OrderSummary';

interface TicketViewProps {
  onDone: () => void;
}

const TicketView: React.FC<TicketViewProps> = ({ onDone }) => {
  const { orderNumber } = useOrder();
  const ticketRef = useRef<HTMLDivElement>(null);
  
  // Simulate printing animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (ticketRef.current) {
        ticketRef.current.classList.remove('translate-y-full', 'opacity-0');
        ticketRef.current.classList.add('translate-y-0', 'opacity-100');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">¡Pedido Completado!</h2>
          <p className="text-gray-600 mb-6">
            Tu número de orden es <span className="font-bold text-[#FF8C00]">#{orderNumber}</span>
          </p>
          <div className="border-t border-b border-gray-200 py-6 my-6">
            <p className="text-lg font-medium mb-2">Tiempo estimado de espera:</p>
            <p className="text-3xl font-bold text-[#FF8C00]">15-20 min</p>
          </div>
          <p className="text-gray-600">
            Por favor, espera a que llamen tu número para recoger tu pedido.
          </p>
        </div>

        {/* Printable Ticket */}
        <div 
          ref={ticketRef}
          className="bg-white rounded-t-lg shadow-lg transition-all duration-1000 ease-out transform translate-y-full opacity-0"
        >
          <div className="p-6 pb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-xl font-heavyrust-primary">PARRILLEROS</h3>
                <p className="text-gray-600 text-sm font-bebas-neue-primary">FAST FOOD</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
            
            <div className="border-t border-dashed border-gray-300 pt-6">
              <OrderSummary isReceipt showItems />
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={handlePrint}
                className="bg-[#FF8C00] text-white py-3 px-8 rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center"
              >
                <Printer size={20} className="mr-2" />
                Imprimir Ticket
              </button>
              <button
                onClick={onDone}
                className="bg-gray-200 text-gray-800 py-3 px-8 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                Finalizar
              </button>
            </div>
          </div>
          
          {/* Zigzag bottom border */}
          <div className="h-4 w-full overflow-hidden relative">
            <div className="absolute w-full h-8 left-0" style={{ 
              backgroundImage: 'radial-gradient(circle at 10px -4px, transparent 14px, white 16px)',
              backgroundSize: '20px 20px',
              backgroundPosition: 'bottom',
              backgroundRepeat: 'repeat-x'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketView;