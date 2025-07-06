import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, CustomizationOption, PaymentMethod, Order } from '../types';

interface OrderContextType {
  cart: CartItem[];
  addToCart: (menuItem: MenuItem, quantity: number, customizations: CustomizationOption[], withFries: boolean, specialInstructions?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  subtotal: number;
  deliveryFee: number;
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (method: PaymentMethod) => void;
  currentOrder: Order | null;
  completeOrder: () => void;
  orderNumber: number;
  setDeliveryFee: (fee: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // Initialize orderNumber from localStorage with automatic increment
  const [orderNumber, setOrderNumber] = useState(() => {
    const savedOrderNumber = localStorage.getItem('parrilleros-last-order-number');
    const lastNumber = savedOrderNumber ? parseInt(savedOrderNumber) : 0;
    const nextNumber = lastNumber + 1;
    
    // Save the new order number immediately
    localStorage.setItem('parrilleros-last-order-number', nextNumber.toString());
    
    return nextNumber;
  });

  // Calculate subtotal whenever cart changes
  useEffect(() => {
    const newSubtotal = cart.reduce((sum, item) => {
      const basePrice = item.withFries ? (item.menuItem.priceWithFries || item.menuItem.price) : item.menuItem.price;
      const itemTotal = basePrice * item.quantity;
      const customizationsTotal = item.customizations.reduce(
        (sum, option) => sum + option.price,
        0
      ) * item.quantity;
      
      return sum + itemTotal + customizationsTotal;
    }, 0);
    
    setSubtotal(Math.round(newSubtotal));
  }, [cart]);

  // Calculate total whenever subtotal or deliveryFee changes
  useEffect(() => {
    setTotal(Math.round(subtotal + deliveryFee));
  }, [subtotal, deliveryFee]);

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
    setDeliveryFee(0);
    
    // Generate next order number when cart is cleared (for next order)
    const nextOrderNumber = orderNumber + 1;
    setOrderNumber(nextOrderNumber);
    localStorage.setItem('parrilleros-last-order-number', nextOrderNumber.toString());
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
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    subtotal,
    deliveryFee,
    paymentMethod,
    setPaymentMethod,
    currentOrder,
    completeOrder,
    orderNumber,
    setDeliveryFee,
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