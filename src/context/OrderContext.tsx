import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, CustomizationOption, PaymentMethod, Order } from '../types';

interface OrderContextType {
  cart: CartItem[];
  addToCart: (menuItem: MenuItem, quantity: number, customizations: CustomizationOption[], withFries: boolean, specialInstructions?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (method: PaymentMethod) => void;
  currentOrder: Order | null;
  completeOrder: () => void;
  orderNumber: number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // Initialize orderNumber from localStorage or start at 1
  const [orderNumber, setOrderNumber] = useState(() => {
    const savedOrderNumber = localStorage.getItem('lastOrderNumber');
    return savedOrderNumber ? parseInt(savedOrderNumber) : 1;
  });

  // Save orderNumber to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lastOrderNumber', orderNumber.toString());
  }, [orderNumber]);

  // Calculate total whenever cart changes
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => {
      const basePrice = item.withFries ? (item.menuItem.priceWithFries || item.menuItem.price) : item.menuItem.price;
      const itemTotal = basePrice * item.quantity;
      const customizationsTotal = item.customizations.reduce(
        (sum, option) => sum + option.price,
        0
      ) * item.quantity;
      
      return sum + itemTotal + customizationsTotal;
    }, 0);
    
    setTotal(Math.round(newTotal));
  }, [cart]);

  const addToCart = (
    menuItem: MenuItem,
    quantity: number,
    customizations: CustomizationOption[],
    withFries: boolean,
    specialInstructions?: string
  ) => {
    const cartItemId = `${menuItem.id}_${Date.now()}`;
    const newItem: CartItem = {
      id: cartItemId,
      menuItem,
      quantity,
      customizations,
      withFries,
      specialInstructions
    };
    
    setCart((prevCart) => [...prevCart, newItem]);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setPaymentMethod(null);
  };

  const completeOrder = () => {
    if (cart.length === 0) return;
    
    const newOrder: Order = {
      id: `ORD_${orderNumber}`,
      items: [...cart],
      total,
      paymentMethod,
      status: 'completed',
      timestamp: new Date(),
    };
    
    setCurrentOrder(newOrder);
    setOrderNumber((prev) => prev + 1);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    paymentMethod,
    setPaymentMethod,
    currentOrder,
    completeOrder,
    orderNumber,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};