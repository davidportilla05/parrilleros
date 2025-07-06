export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  priceWithFries?: number;
  image: string;
  category: string;
  customizable: boolean;
  badges?: string[];
}

export interface CustomizationOption {
  id: number;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: CustomizationOption[];
  withFries: boolean;
  specialInstructions?: string;
}

export interface CategorySubcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: CategorySubcategory[];
}

export type PaymentMethod = 'card' | 'cash' | 'qr';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod | null;
  status: 'pending' | 'completed' | 'cancelled';
  timestamp: Date;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  neighborhood: string;
  deliveryZones: string[];
}