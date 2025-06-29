import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, ShoppingCart, Sparkles, Volume2, Plus, Trash2, MessageSquare, Clock } from 'lucide-react';
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

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
}

interface ChatBotProps {
  onProductSelect?: (product: MenuItem) => void;
  onNavigate?: (path: string) => void;
  onDeliveryRequest?: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onProductSelect, onNavigate, onDeliveryRequest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showConversationList, setShowConversationList] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { addToCart, cart } = useOrder();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Get active conversation
  const activeConversation = conversations.find(conv => conv.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

    // Load conversations from localStorage
    const savedConversations = localStorage.getItem('parrilleros-conversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      const conversationsWithDates = parsed.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        lastActivity: new Date(conv.lastActivity),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setConversations(conversationsWithDates);
    }
  }, []);

  // Save conversations to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('parrilleros-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create new conversation when first opened
  useEffect(() => {
    if (isOpen && conversations.length === 0) {
      createNewConversation();
    }
  }, [isOpen]);

  const speak = (text: string) => {
    if (synthRef.current && 'speechSynthesis' in window) {
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      const voices = synthRef.current.getVoices();
      const spanishVoice = voices.find(voice => voice.lang.startsWith('es'));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
      
      synthRef.current.speak(utterance);
    }
  };

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Conversación ${conversations.length + 1}`,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setShowConversationList(false);

    // Add welcome message
    setTimeout(() => {
      addBotMessage(
        "¡Hola! 👋 Soy tu asistente virtual de Parrilleros. Puedo ayudarte a hacer tu pedido más rápido. ¿Qué te gustaría ordenar hoy?",
        [
          "Ver hamburguesas clásicas",
          "Mostrar bebidas",
          "Quiero una hamburguesa especial",
          "Ver mi carrito"
        ]
      );
    }, 500);
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    if (activeConversationId === conversationId) {
      const remaining = conversations.filter(conv => conv.id !== conversationId);
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      } else {
        setActiveConversationId(null);
        createNewConversation();
      }
    }
  };

  const switchConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setShowConversationList(false);
  };

  const updateConversationTitle = (conversationId: string, firstUserMessage: string) => {
    const title = firstUserMessage.length > 30 
      ? firstUserMessage.substring(0, 30) + '...' 
      : firstUserMessage;
    
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, title }
        : conv
    ));
  };

  const addBotMessage = (content: string, suggestions?: string[], products?: MenuItem[]) => {
    if (!activeConversationId) return;

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
      
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, newMessage],
              lastActivity: new Date()
            }
          : conv
      ));
      setIsTyping(false);
      
      speak(content);
    }, 1000);
  };

  const addUserMessage = (content: string) => {
    if (!activeConversationId) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversationId) {
        const updatedConv = { 
          ...conv, 
          messages: [...conv.messages, newMessage],
          lastActivity: new Date()
        };
        
        // Update title if this is the first user message
        if (conv.messages.filter(msg => msg.type === 'user').length === 0) {
          updatedConv.title = content.length > 30 ? content.substring(0, 30) + '...' : content;
        }
        
        return updatedConv;
      }
      return conv;
    }));
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
    if (onProductSelect) {
      onProductSelect(product);
    } else {
      addToCart(product, 1, [], false, '');
    }
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

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
          
          {cartItemCount > 0 && !isOpen && (
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#FF8C00] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{cartItemCount}</span>
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] sm:h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 sm:p-4 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                  <Sparkles size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base truncate">Asistente Parrilleros</h3>
                  <p className="text-xs sm:text-sm opacity-90 truncate">Tu ayudante para pedidos rápidos</p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                {/* Conversations Button */}
                <button
                  onClick={() => setShowConversationList(!showConversationList)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Ver conversaciones"
                >
                  <MessageSquare size={16} />
                </button>
                {/* New Conversation Button */}
                <button
                  onClick={createNewConversation}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Nueva conversación"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 sm:p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Conversation List */}
          {showConversationList ? (
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              <div className="mb-3 sm:mb-4">
                <h4 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">Conversaciones</h4>
                <button
                  onClick={createNewConversation}
                  className="w-full p-2 sm:p-3 bg-blue-50 hover:bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 font-medium transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  <Plus size={14} className="mr-1 sm:mr-2" />
                  Nueva conversación
                </button>
              </div>
              
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      activeConversationId === conversation.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex-1 min-w-0"
                        onClick={() => switchConversation(conversation.id)}
                      >
                        <h5 className="font-medium text-gray-800 truncate text-sm">
                          {conversation.title}
                        </h5>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock size={10} className="mr-1" />
                          <span>{formatDate(conversation.lastActivity)} {formatTime(conversation.lastActivity)}</span>
                          <span className="mx-1">•</span>
                          <span>{conversation.messages.length} mensajes</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conversation.id);
                        }}
                        className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                        title="Eliminar conversación"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 chatbot-messages">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-2xl chatbot-message-animation ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-xs sm:text-sm whitespace-pre-line">{message.content}</p>
                      
                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs transition-colors chatbot-button"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Products */}
                      {message.products && (
                        <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                          {message.products.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg p-2 sm:p-3 border chatbot-product-card">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-800 text-xs sm:text-sm truncate">{product.name}</h4>
                                  <p className="text-[#FF8C00] font-bold text-xs sm:text-sm">${product.price.toLocaleString()}</p>
                                </div>
                                <button
                                  onClick={() => handleProductSelect(product)}
                                  className="ml-2 p-1.5 sm:p-2 bg-[#FF8C00] text-white rounded-full hover:bg-orange-600 transition-colors chatbot-button flex-shrink-0"
                                >
                                  <ShoppingCart size={12} />
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
                    <div className="bg-gray-100 p-2 sm:p-3 rounded-2xl chatbot-typing-indicator">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 sm:p-4 border-t border-gray-200 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu pedido o pregunta..."
                      className="w-full p-2 sm:p-3 pr-10 sm:pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                    />
                    
                    {/* Voice input button */}
                    {speechSupported && (
                      <button
                        onClick={isListening ? stopListening : startListening}
                        className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                          isListening 
                            ? 'bg-red-500 text-white animate-pulse chatbot-voice-recording' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="p-2 sm:p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors chatbot-button flex-shrink-0"
                  >
                    <Send size={14} />
                  </button>
                </div>
                
                {/* Quick actions */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
                  <button
                    onClick={() => handleSuggestionClick("Ver hamburguesas")}
                    className="px-2 sm:px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors chatbot-button"
                  >
                    🍔 <span className="hidden sm:inline">Hamburguesas</span>
                  </button>
                  <button
                    onClick={() => handleSuggestionClick("Ver bebidas")}
                    className="px-2 sm:px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors chatbot-button"
                  >
                    🥤 <span className="hidden sm:inline">Bebidas</span>
                  </button>
                  <button
                    onClick={() => handleSuggestionClick("Ver mi carrito")}
                    className="px-2 sm:px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors chatbot-button"
                  >
                    🛒 <span className="hidden sm:inline">Mi carrito</span> {cartItemCount > 0 && `(${cartItemCount})`}
                  </button>
                  <button
                    onClick={() => handleSuggestionClick("Pedir a domicilio")}
                    className="px-2 sm:px-3 py-1 bg-[#FF8C00] hover:bg-orange-600 text-white rounded-full text-xs transition-colors chatbot-button"
                  >
                    🛵 <span className="hidden sm:inline">Domicilio</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;