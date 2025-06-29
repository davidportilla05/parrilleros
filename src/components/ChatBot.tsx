import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, ShoppingCart, Sparkles, Volume2 } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { menuItems } from '../data/menu';
import { MenuItem } from '../types';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  products?: MenuItem[];
}

interface ChatBotProps {
  onProductSelect?: (product: MenuItem) => void;
  onNavigate?: (path: string) => void;
  onDeliveryRequest?: () => void; // Nueva prop para manejar pedidos a domicilio
}

const ChatBot: React.FC<ChatBotProps> = ({ onProductSelect, onNavigate, onDeliveryRequest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const { addToCart, cart } = useOrder();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      setSpeechSupported(true);
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Welcome message when first opened
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "¡Hola! 👋 Soy tu asistente virtual de Parrilleros. Puedo ayudarte a hacer tu pedido más rápido. ¿Qué te gustaría ordenar hoy?",
        [
          "Ver hamburguesas clásicas",
          "Mostrar bebidas",
          "Quiero una hamburguesa especial",
          "Ver mi carrito"
        ]
      );
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (text: string) => {
    if (synthRef.current && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      // Try to find a Spanish voice
      const voices = synthRef.current.getVoices();
      const spanishVoice = voices.find(voice => voice.lang.startsWith('es'));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
      
      synthRef.current.speak(utterance);
    }
  };

  const addBotMessage = (content: string, suggestions?: string[], products?: MenuItem[]) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: new Date(),
        suggestions,
        products
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      
      // Speak the bot response
      speak(content);
    }, 1000);
  };

  const addUserMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const processUserInput = (input: string) => {
    const lowerInput = input.toLowerCase().trim();
    
    // Handle delivery requests
    if (lowerInput.includes('domicilio') || lowerInput.includes('entrega') || lowerInput.includes('delivery')) {
      if (cart.length === 0) {
        addBotMessage(
          "Para pedir a domicilio necesitas tener productos en tu carrito. ¿Te ayudo a agregar algo?",
          ["Ver hamburguesas", "Ver bebidas", "Ver acompañamientos"]
        );
      } else {
        addBotMessage(
          "¡Perfecto! Te voy a redirigir al formulario de domicilio para completar tu pedido. 🛵",
          []
        );
        
        // Close chatbot and trigger delivery flow
        setTimeout(() => {
          setIsOpen(false);
          if (onDeliveryRequest) {
            onDeliveryRequest();
          } else if (onNavigate) {
            onNavigate('/cart');
          }
        }, 1500);
      }
      return;
    }
    
    // Search for products
    if (lowerInput.includes('hamburguesa') || lowerInput.includes('burger')) {
      const burgers = menuItems.filter(item => 
        item.category.includes('burger') && 
        (lowerInput.includes('clasica') || lowerInput.includes('clásica') ? item.category === 'classic-burgers' :
         lowerInput.includes('deluxe') ? item.category === 'deluxe-burgers' :
         lowerInput.includes('especial') || lowerInput.includes('concurso') ? item.category === 'contest-burgers' :
         true)
      ).slice(0, 6);
      
      if (burgers.length > 0) {
        addBotMessage(
          `Encontré ${burgers.length} hamburguesas para ti. ¿Cuál te llama la atención?`,
          ["Ver todas las hamburguesas", "Agregar al carrito", "Buscar bebidas"],
          burgers
        );
      } else {
        addBotMessage("No encontré hamburguesas con esa descripción. ¿Podrías ser más específico?");
      }
    }
    else if (lowerInput.includes('bebida') || lowerInput.includes('tomar') || lowerInput.includes('jugo') || lowerInput.includes('gaseosa')) {
      const drinks = menuItems.filter(item => item.category === 'drinks').slice(0, 8);
      addBotMessage(
        "Aquí tienes nuestras bebidas disponibles:",
        ["Ver todas las bebidas", "Buscar hamburguesas", "Ver mi carrito"],
        drinks
      );
    }
    else if (lowerInput.includes('papa') || lowerInput.includes('acompañamiento')) {
      const sides = menuItems.filter(item => item.category === 'sides' || item.category === 'fries').slice(0, 6);
      addBotMessage(
        "Estos son nuestros acompañamientos:",
        ["Ver papas especiales", "Buscar hamburguesas", "Ver mi carrito"],
        sides
      );
    }
    else if (lowerInput.includes('carrito') || lowerInput.includes('pedido')) {
      if (cart.length > 0) {
        const total = cart.reduce((sum, item) => {
          const basePrice = item.withFries ? (item.menuItem.priceWithFries || item.menuItem.price) : item.menuItem.price;
          const customizationsTotal = item.customizations.reduce((sum, option) => sum + option.price, 0);
          return sum + (basePrice + customizationsTotal) * item.quantity;
        }, 0);
        
        addBotMessage(
          `Tienes ${cart.length} producto${cart.length > 1 ? 's' : ''} en tu carrito por un total de $${Math.round(total).toLocaleString()}. ¿Quieres proceder al pago?`,
          ["Ver carrito completo", "Pedir a domicilio", "Agregar más productos"]
        );
      } else {
        addBotMessage(
          "Tu carrito está vacío. ¿Te ayudo a encontrar algo delicioso?",
          ["Ver hamburguesas", "Ver bebidas", "Ver acompañamientos"]
        );
      }
    }
    else if (lowerInput.includes('precio') || lowerInput.includes('cuesta') || lowerInput.includes('vale')) {
      // Extract product name and search for price
      const productName = lowerInput.replace(/precio|cuesta|vale|cuanto|de|la|el/g, '').trim();
      const product = menuItems.find(item => 
        item.name.toLowerCase().includes(productName) ||
        productName.includes(item.name.toLowerCase().split(' ')[0])
      );
      
      if (product) {
        addBotMessage(
          `${product.name} cuesta $${product.price.toLocaleString()}${product.priceWithFries ? ` o $${product.priceWithFries.toLocaleString()} con papas` : ''}. ¿Te gustaría agregarlo al carrito?`,
          ["Agregar al carrito", "Ver más productos", "Buscar otra cosa"]
        );
      } else {
        addBotMessage("No encontré ese producto. ¿Podrías decirme el nombre completo?");
      }
    }
    else if (lowerInput.includes('ayuda') || lowerInput.includes('help')) {
      addBotMessage(
        "¡Por supuesto! Puedo ayudarte con:\n\n• Buscar productos por nombre\n• Mostrar categorías (hamburguesas, bebidas, etc.)\n• Ver precios\n• Revisar tu carrito\n• Hacer pedidos rápidos\n• Pedir a domicilio\n\n¿Qué necesitas?",
        ["Ver hamburguesas", "Ver bebidas", "Ver mi carrito", "Pedir a domicilio"]
      );
    }
    else if (lowerInput.includes('hola') || lowerInput.includes('buenos') || lowerInput.includes('buenas')) {
      addBotMessage(
        "¡Hola! Bienvenido a Parrilleros. Estoy aquí para ayudarte a hacer tu pedido de forma rápida y fácil. ¿Qué te provoca comer hoy?",
        ["Ver hamburguesas clásicas", "Ver bebidas", "Ver promociones", "Ayuda"]
      );
    }
    else {
      // General search
      const searchResults = menuItems.filter(item =>
        item.name.toLowerCase().includes(lowerInput) ||
        item.description.toLowerCase().includes(lowerInput)
      ).slice(0, 6);
      
      if (searchResults.length > 0) {
        addBotMessage(
          `Encontré ${searchResults.length} producto${searchResults.length > 1 ? 's' : ''} relacionado${searchResults.length > 1 ? 's' : ''} con "${input}":`,
          ["Ver más productos", "Buscar otra cosa", "Ver mi carrito"],
          searchResults
        );
      } else {
        addBotMessage(
          `No encontré productos relacionados con "${input}". ¿Te ayudo a buscar algo específico?`,
          ["Ver hamburguesas", "Ver bebidas", "Ver acompañamientos", "Ayuda"]
        );
      }
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    addUserMessage(inputValue);
    processUserInput(inputValue);
    setInputValue('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    addUserMessage(suggestion);
    processUserInput(suggestion);
  };

  const handleProductSelect = (product: MenuItem) => {
    addToCart(product, 1, [], false, '');
    addBotMessage(
      `¡Perfecto! He agregado "${product.name}" a tu carrito. ¿Quieres agregar algo más?`,
      ["Ver mi carrito", "Agregar bebida", "Pedir a domicilio", "Seguir comprando"]
    );
  };

  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isOpen 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          }`}
        >
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <>
              <MessageCircle size={24} className="text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#FF8C00] rounded-full flex items-center justify-center">
                <Sparkles size={12} className="text-white" />
              </div>
            </>
          )}
          
          {/* Notification badge for cart items */}
          {cartItemCount > 0 && !isOpen && (
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#FF8C00] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{cartItemCount}</span>
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Asistente Parrilleros</h3>
                  <p className="text-sm opacity-90">Tu ayudante para pedidos rápidos</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl chatbot-message-animation ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  
                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left p-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs transition-colors chatbot-button"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Products */}
                  {message.products && (
                    <div className="mt-3 space-y-2">
                      {message.products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg p-3 border chatbot-product-card">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800 text-sm">{product.name}</h4>
                              <p className="text-[#FF8C00] font-bold text-sm">${product.price.toLocaleString()}</p>
                            </div>
                            <button
                              onClick={() => handleProductSelect(product)}
                              className="ml-2 p-2 bg-[#FF8C00] text-white rounded-full hover:bg-orange-600 transition-colors chatbot-button"
                            >
                              <ShoppingCart size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl chatbot-typing-indicator">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pedido o pregunta..."
                  className="w-full p-3 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                
                {/* Voice input button */}
                {speechSupported && (
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse chatbot-voice-recording' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                )}
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors chatbot-button"
              >
                <Send size={16} />
              </button>
            </div>
            
            {/* Quick actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => handleSuggestionClick("Ver hamburguesas")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors chatbot-button"
              >
                🍔 Hamburguesas
              </button>
              <button
                onClick={() => handleSuggestionClick("Ver bebidas")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors chatbot-button"
              >
                🥤 Bebidas
              </button>
              <button
                onClick={() => handleSuggestionClick("Ver mi carrito")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors chatbot-button"
              >
                🛒 Mi carrito {cartItemCount > 0 && `(${cartItemCount})`}
              </button>
              <button
                onClick={() => handleSuggestionClick("Pedir a domicilio")}
                className="px-3 py-1 bg-[#FF8C00] hover:bg-orange-600 text-white rounded-full text-xs transition-colors chatbot-button"
              >
                🛵 Domicilio
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;