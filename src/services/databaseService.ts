import { dbOperations, getDB } from '../config/database';
import { MenuItem, CartItem, CustomizationOption, Location } from '../types';

// =====================================================
// INTERFACES PARA LA BASE DE DATOS
// =====================================================

export interface DatabaseProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_con_papas?: number;
  imagen_url: string;
  categoria_id: number;
  personalizable: boolean;
  activo: boolean;
}

export interface DatabaseOrder {
  id?: number;
  numero_pedido: string;
  cliente_id: number;
  sede_id: number;
  tipo_pedido: 'domicilio' | 'recoger';
  estado: 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
  subtotal: number;
  iva: number;
  total: number;
  metodo_pago: string;
  requiere_factura: boolean;
  instrucciones_especiales?: string;
  items: CartItem[];
}

export interface DatabaseCustomer {
  id?: number;
  nombre: string;
  telefono: string;
  email?: string;
  cedula?: string;
  direccion?: string;
  barrio?: string;
}

export interface DatabaseInvoice {
  id?: number;
  numero_factura: string;
  pedido_id: number;
  cliente_nombre: string;
  cliente_cedula: string;
  cliente_email: string;
  subtotal: number;
  iva: number;
  total: number;
}

// =====================================================
// SERVICIO DE PRODUCTOS
// =====================================================

export class ProductService {
  // Obtener todos los productos activos
  static async getAllProducts(): Promise<MenuItem[]> {
    try {
      const products = await dbOperations.getAllProducts();
      const categories = await dbOperations.getAllCategories();
      
      return products
        .filter(p => p.activo)
        .map(product => this.mapDatabaseToMenuItem(product, categories));
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      return [];
    }
  }

  // Obtener productos por categoría
  static async getProductsByCategory(categoryName: string): Promise<MenuItem[]> {
    try {
      const categories = await dbOperations.getAllCategories();
      const category = categories.find(c => c.nombre === categoryName);
      
      if (!category) return [];
      
      const products = await dbOperations.getProductsByCategory(category.id);
      
      return products
        .filter(p => p.activo)
        .map(product => this.mapDatabaseToMenuItem(product, categories));
    } catch (error) {
      console.error('Error obteniendo productos por categoría:', error);
      return [];
    }
  }

  // Obtener opciones de personalización
  static async getCustomizationOptions(): Promise<CustomizationOption[]> {
    try {
      const options = await dbOperations.getAllCustomizationOptions();
      
      return options
        .filter(opt => opt.activo)
        .map(option => ({
          id: option.id,
          name: option.nombre,
          price: option.precio_adicional
        }));
    } catch (error) {
      console.error('Error obteniendo opciones de personalización:', error);
      return [];
    }
  }

  // Mapear producto de base de datos a MenuItem
  private static mapDatabaseToMenuItem(dbProduct: any, categories: any[]): MenuItem {
    const category = categories.find(c => c.id === dbProduct.categoria_id);
    const categoryName = category ? category.nombre.toLowerCase().replace(/\s+/g, '-') : 'otros';
    
    return {
      id: dbProduct.id,
      name: dbProduct.nombre,
      description: dbProduct.descripcion,
      price: dbProduct.precio,
      priceWithFries: dbProduct.precio_con_papas,
      image: dbProduct.imagen_url,
      category: categoryName,
      customizable: dbProduct.personalizable,
      badges: []
    };
  }
}

// =====================================================
// SERVICIO DE CLIENTES
// =====================================================

export class CustomerService {
  // Crear o actualizar cliente
  static async createOrUpdateCustomer(customerData: DatabaseCustomer): Promise<number> {
    try {
      // Buscar cliente existente por teléfono
      const existing = await dbOperations.getCustomerByPhone(customerData.telefono);

      if (existing) {
        // Cliente existe, retornar su ID
        return existing.id!;
      } else {
        // Crear nuevo cliente
        const id = await dbOperations.addCustomer(customerData);
        return id as number;
      }
    } catch (error) {
      console.error('Error creando/actualizando cliente:', error);
      throw error;
    }
  }
}

// =====================================================
// SERVICIO DE PEDIDOS
// =====================================================

export class OrderService {
  // Obtener siguiente número de pedido
  static async getNextOrderNumber(): Promise<string> {
    try {
      const lastNumber = await dbOperations.getConfig('ultimo_numero_pedido');
      const nextNumber = (parseInt(lastNumber || '0') + 1);
      
      // Actualizar el último número
      await dbOperations.setConfig('ultimo_numero_pedido', nextNumber.toString());
      
      return nextNumber.toString().padStart(3, '0');
    } catch (error) {
      console.error('Error obteniendo siguiente número de pedido:', error);
      throw error;
    }
  }

  // Crear pedido completo
  static async createOrder(
    customerData: DatabaseCustomer,
    orderData: Omit<DatabaseOrder, 'cliente_id'>,
    cartItems: CartItem[],
    sedeId: number
  ): Promise<number> {
    try {
      // 1. Crear o actualizar cliente
      const customerId = await CustomerService.createOrUpdateCustomer(customerData);

      // 2. Crear pedido con items incluidos
      const completeOrder = {
        ...orderData,
        cliente_id: customerId,
        sede_id: sedeId,
        items: cartItems
      };

      const orderId = await dbOperations.addOrder(completeOrder);
      
      return orderId as number;
    } catch (error) {
      console.error('Error creando pedido:', error);
      throw error;
    }
  }

  // Obtener pedidos
  static async getAllOrders(): Promise<any[]> {
    try {
      return await dbOperations.getAllOrders();
    } catch (error) {
      console.error('Error obteniendo pedidos:', error);
      return [];
    }
  }
}

// =====================================================
// SERVICIO DE FACTURAS
// =====================================================

export class InvoiceService {
  // Generar número de factura
  static async getNextInvoiceNumber(): Promise<string> {
    try {
      const lastNumber = await dbOperations.getConfig('ultimo_numero_factura');
      const nextNumber = (parseInt(lastNumber || '0') + 1);
      
      // Actualizar el último número
      await dbOperations.setConfig('ultimo_numero_factura', nextNumber.toString());
      
      return `FAC-${nextNumber.toString().padStart(6, '0')}`;
    } catch (error) {
      console.error('Error obteniendo siguiente número de factura:', error);
      throw error;
    }
  }

  // Crear factura
  static async createInvoice(invoiceData: DatabaseInvoice): Promise<number> {
    try {
      const invoiceId = await dbOperations.addInvoice(invoiceData);
      return invoiceId as number;
    } catch (error) {
      console.error('Error creando factura:', error);
      throw error;
    }
  }
}

// =====================================================
// SERVICIO DE SEDES
// =====================================================

export class LocationService {
  // Obtener todas las sedes activas
  static async getAllLocations(): Promise<Location[]> {
    try {
      const locations = await dbOperations.getAllLocations();
      
      return locations
        .filter(location => location.activo)
        .map(location => ({
          id: location.id.toString(),
          name: location.nombre,
          address: location.direccion,
          phone: location.telefono,
          whatsapp: location.whatsapp,
          neighborhood: location.barrio,
          deliveryZones: location.zonas_entrega
        }));
    } catch (error) {
      console.error('Error obteniendo sedes:', error);
      return [];
    }
  }
}

// =====================================================
// SERVICIO DE REPORTES
// =====================================================

export class ReportsService {
  // Reporte de ventas básico
  static async getSalesReport(startDate: string, endDate: string): Promise<any[]> {
    try {
      const orders = await dbOperations.getAllOrders();
      
      return orders.filter(order => {
        const orderDate = new Date(order.fecha_pedido).toISOString().split('T')[0];
        return orderDate >= startDate && orderDate <= endDate;
      });
    } catch (error) {
      console.error('Error generando reporte de ventas:', error);
      return [];
    }
  }

  // Productos más vendidos
  static async getTopProducts(limit: number = 10): Promise<any[]> {
    try {
      const orders = await dbOperations.getAllOrders();
      const productSales = new Map();
      
      orders.forEach(order => {
        order.items?.forEach((item: CartItem) => {
          const productId = item.menuItem.id;
          const current = productSales.get(productId) || { 
            nombre: item.menuItem.name, 
            total_vendido: 0, 
            total_ventas: 0 
          };
          
          current.total_vendido += item.quantity;
          current.total_ventas += (item.menuItem.price * item.quantity);
          
          productSales.set(productId, current);
        });
      });
      
      return Array.from(productSales.values())
        .sort((a, b) => b.total_vendido - a.total_vendido)
        .slice(0, limit);
    } catch (error) {
      console.error('Error obteniendo productos más vendidos:', error);
      return [];
    }
  }
}

// =====================================================
// SERVICIO DE LOGS
// =====================================================

export class LogService {
  // Registrar log en consola (simplificado para WebContainer)
  static async log(
    level: 'info' | 'warning' | 'error' | 'debug',
    message: string,
    context?: any
  ): Promise<void> {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case 'error':
        console.error(logMessage, context);
        break;
      case 'warning':
        console.warn(logMessage, context);
        break;
      case 'debug':
        console.debug(logMessage, context);
        break;
      default:
        console.log(logMessage, context);
    }
  }
}