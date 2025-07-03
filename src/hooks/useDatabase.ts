import { useState, useEffect } from 'react';
import { 
  ProductService, 
  CustomerService, 
  OrderService, 
  InvoiceService,
  LocationService,
  ReportsService,
  ConfigService,
  LogService,
  DatabaseCustomer,
  DatabaseOrder
} from '../services/databaseService';
import { MenuItem, CartItem, Location } from '../types';
import { testConnection } from '../config/database';

// =====================================================
// HOOK PARA PRODUCTOS
// =====================================================

export const useProducts = () => {
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Error cargando productos');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProductsByCategory = async (category: string) => {
    try {
      setLoading(true);
      const data = await ProductService.getProductsByCategory(category);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Error cargando productos por categoría');
      console.error('Error loading products by category:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    loadProducts,
    loadProductsByCategory
  };
};

// =====================================================
// HOOK PARA PEDIDOS
// =====================================================

export const useOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (
    customerData: DatabaseCustomer,
    cartItems: CartItem[],
    sedeId: number,
    paymentMethod: string,
    requiresInvoice: boolean = false,
    specialInstructions?: string
  ): Promise<{ orderId: number; orderNumber: string }> => {
    try {
      setLoading(true);
      
      // Obtener siguiente número de pedido
      const orderNumber = await OrderService.getNextOrderNumber();
      
      // Calcular totales
      const subtotal = cartItems.reduce((sum, item) => {
        const basePrice = item.withFries 
          ? (item.menuItem.priceWithFries || item.menuItem.price) 
          : item.menuItem.price;
        const customizationsTotal = item.customizations.reduce((sum, option) => sum + option.price, 0);
        return sum + ((basePrice + customizationsTotal) * item.quantity);
      }, 0);
      
      const subtotalBase = subtotal * 0.92; // Base gravable (92%)
      const iva = subtotal * 0.08; // IVA (8%)
      const total = Math.round(subtotal);

      // Datos del pedido
      const orderData: Omit<DatabaseOrder, 'cliente_id'> = {
        numero_pedido: orderNumber,
        sede_id: sedeId,
        tipo_pedido: 'domicilio',
        estado: 'pendiente',
        subtotal: Math.round(subtotalBase),
        iva: Math.round(iva),
        total: total,
        metodo_pago: paymentMethod,
        requiere_factura: requiresInvoice,
        instrucciones_especiales: specialInstructions
      };

      // Crear pedido
      const orderId = await OrderService.createOrder(customerData, orderData, cartItems, sedeId);
      
      // Log del pedido creado
      await LogService.log('info', `Pedido creado: ${orderNumber}`, {
        orderId,
        customerName: customerData.nombre,
        total: total,
        itemsCount: cartItems.length
      });

      setError(null);
      return { orderId, orderNumber };
      
    } catch (err) {
      const errorMessage = 'Error creando pedido';
      setError(errorMessage);
      console.error('Error creating order:', err);
      
      // Log del error
      await LogService.log('error', errorMessage, { error: err });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadOrdersBySede = async (sedeId: number, limit: number = 50) => {
    try {
      setLoading(true);
      const data = await OrderService.getOrdersBySede(sedeId, limit);
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Error cargando pedidos');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      
      // Actualizar el estado local
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, estado: newStatus } : order
      ));
      
      // Log del cambio de estado
      await LogService.log('info', `Estado de pedido actualizado`, {
        orderId,
        newStatus
      });
      
      setError(null);
    } catch (err) {
      setError('Error actualizando estado del pedido');
      console.error('Error updating order status:', err);
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    loadOrdersBySede,
    updateOrderStatus
  };
};

// =====================================================
// HOOK PARA FACTURAS
// =====================================================

export const useInvoices = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvoice = async (
    orderId: number,
    customerName: string,
    customerCedula: string,
    customerEmail: string,
    subtotal: number,
    iva: number,
    total: number,
    pdfUrl?: string
  ): Promise<string> => {
    try {
      setLoading(true);
      
      // Generar número de factura
      const invoiceNumber = await InvoiceService.getNextInvoiceNumber();
      
      // Crear factura
      const invoiceId = await InvoiceService.createInvoice({
        numero_factura: invoiceNumber,
        pedido_id: orderId,
        cliente_nombre: customerName,
        cliente_cedula: customerCedula,
        cliente_email: customerEmail,
        subtotal,
        iva,
        total,
        archivo_pdf_url: pdfUrl
      });
      
      // Log de factura creada
      await LogService.log('info', `Factura creada: ${invoiceNumber}`, {
        invoiceId,
        orderId,
        customerName,
        total
      });
      
      setError(null);
      return invoiceNumber;
      
    } catch (err) {
      const errorMessage = 'Error creando factura';
      setError(errorMessage);
      console.error('Error creating invoice:', err);
      
      // Log del error
      await LogService.log('error', errorMessage, { error: err, orderId });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createInvoice
  };
};

// =====================================================
// HOOK PARA SEDES
// =====================================================

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await LocationService.getAllLocations();
      setLocations(data);
      setError(null);
    } catch (err) {
      setError('Error cargando sedes');
      console.error('Error loading locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  return {
    locations,
    loading,
    error,
    loadLocations
  };
};

// =====================================================
// HOOK PARA REPORTES
// =====================================================

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSalesReport = async (startDate: string, endDate: string, sedeId?: number) => {
    try {
      setLoading(true);
      const data = await ReportsService.getSalesReport(startDate, endDate, sedeId);
      setError(null);
      return data;
    } catch (err) {
      setError('Error generando reporte de ventas');
      console.error('Error generating sales report:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTopProducts = async (sedeId?: number, limit: number = 10) => {
    try {
      setLoading(true);
      const data = await ReportsService.getTopProducts(sedeId, limit);
      setError(null);
      return data;
    } catch (err) {
      setError('Error obteniendo productos más vendidos');
      console.error('Error getting top products:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDailySales = async (sedeId?: number, days: number = 30) => {
    try {
      setLoading(true);
      const data = await ReportsService.getDailySales(sedeId, days);
      setError(null);
      return data;
    } catch (err) {
      setError('Error obteniendo ventas diarias');
      console.error('Error getting daily sales:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getSalesReport,
    getTopProducts,
    getDailySales
  };
};

// =====================================================
// HOOK PARA CONFIGURACIÓN
// =====================================================

export const useConfig = () => {
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getConfig = async (key: string): Promise<string | null> => {
    try {
      const value = await ConfigService.getConfig(key);
      return value;
    } catch (err) {
      console.error('Error getting config:', err);
      return null;
    }
  };

  const setConfig = async (key: string, value: string, description?: string) => {
    try {
      await ConfigService.setConfig(key, value, description);
      
      // Log del cambio de configuración
      await LogService.log('info', `Configuración actualizada: ${key}`, {
        key,
        value,
        description
      });
      
    } catch (err) {
      console.error('Error setting config:', err);
      throw err;
    }
  };

  const loadAllConfigs = async () => {
    try {
      setLoading(true);
      const data = await ConfigService.getAllConfigs();
      setConfigs(data);
      setError(null);
    } catch (err) {
      setError('Error cargando configuraciones');
      console.error('Error loading configs:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    configs,
    loading,
    error,
    getConfig,
    setConfig,
    loadAllConfigs
  };
};

// =====================================================
// HOOK PARA CONEXIÓN DE BASE DE DATOS
// =====================================================

export const useDatabaseConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    try {
      setLoading(true);
      const connected = await testConnection();
      setIsConnected(connected);
      setError(connected ? null : 'No se pudo conectar a la base de datos');
    } catch (err) {
      setIsConnected(false);
      setError('Error verificando conexión a la base de datos');
      console.error('Database connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    isConnected,
    loading,
    error,
    checkConnection
  };
};

// =====================================================
// HOOK PRINCIPAL PARA TODA LA BASE DE DATOS
// =====================================================

export const useDatabase = () => {
  const products = useProducts();
  const orders = useOrders();
  const invoices = useInvoices();
  const locations = useLocations();
  const reports = useReports();
  const config = useConfig();
  const connection = useDatabaseConnection();

  return {
    products,
    orders,
    invoices,
    locations,
    reports,
    config,
    connection
  };
};