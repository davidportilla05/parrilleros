import { pool, executeQuery, executeTransaction } from '../config/database';
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
  archivo_pdf_url?: string;
}

// =====================================================
// SERVICIO DE PRODUCTOS
// =====================================================

export class ProductService {
  // Obtener todos los productos activos
  static async getAllProducts(): Promise<MenuItem[]> {
    const query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p 
      JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.activo = true 
      ORDER BY c.orden_display, p.orden_display
    `;
    
    const products = await executeQuery(query);
    return products.map(this.mapDatabaseToMenuItem);
  }

  // Obtener productos por categoría
  static async getProductsByCategory(categoryName: string): Promise<MenuItem[]> {
    const query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p 
      JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.activo = true AND c.nombre = ?
      ORDER BY p.orden_display
    `;
    
    const products = await executeQuery(query, [categoryName]);
    return products.map(this.mapDatabaseToMenuItem);
  }

  // Obtener opciones de personalización para un producto
  static async getCustomizationOptions(productId: number): Promise<CustomizationOption[]> {
    const query = `
      SELECT op.* 
      FROM opciones_personalizacion op
      JOIN producto_personalizaciones pp ON op.id = pp.opcion_id
      WHERE pp.producto_id = ? AND op.activo = true
      ORDER BY op.nombre
    `;
    
    const options = await executeQuery(query, [productId]);
    return options.map((option: any) => ({
      id: option.id,
      name: option.nombre,
      price: parseFloat(option.precio_adicional)
    }));
  }

  // Mapear producto de base de datos a MenuItem
  private static mapDatabaseToMenuItem(dbProduct: any): MenuItem {
    return {
      id: dbProduct.id,
      name: dbProduct.nombre,
      description: dbProduct.descripcion,
      price: parseFloat(dbProduct.precio),
      priceWithFries: dbProduct.precio_con_papas ? parseFloat(dbProduct.precio_con_papas) : undefined,
      image: dbProduct.imagen_url,
      category: dbProduct.categoria_nombre.toLowerCase().replace(/\s+/g, '-'),
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
    // Buscar cliente existente por teléfono
    const existingQuery = 'SELECT id FROM clientes WHERE telefono = ?';
    const existing = await executeQuery(existingQuery, [customerData.telefono]);

    if (existing.length > 0) {
      // Actualizar cliente existente
      const updateQuery = `
        UPDATE clientes 
        SET nombre = ?, email = ?, cedula = ?, direccion = ?, barrio = ?
        WHERE telefono = ?
      `;
      await executeQuery(updateQuery, [
        customerData.nombre,
        customerData.email || null,
        customerData.cedula || null,
        customerData.direccion || null,
        customerData.barrio || null,
        customerData.telefono
      ]);
      return existing[0].id;
    } else {
      // Crear nuevo cliente
      const insertQuery = `
        INSERT INTO clientes (nombre, telefono, email, cedula, direccion, barrio)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const result = await executeQuery(insertQuery, [
        customerData.nombre,
        customerData.telefono,
        customerData.email || null,
        customerData.cedula || null,
        customerData.direccion || null,
        customerData.barrio || null
      ]);
      return result.insertId;
    }
  }

  // Obtener cliente por ID
  static async getCustomerById(customerId: number): Promise<DatabaseCustomer | null> {
    const query = 'SELECT * FROM clientes WHERE id = ?';
    const customers = await executeQuery(query, [customerId]);
    return customers.length > 0 ? customers[0] : null;
  }
}

// =====================================================
// SERVICIO DE PEDIDOS
// =====================================================

export class OrderService {
  // Obtener siguiente número de pedido
  static async getNextOrderNumber(): Promise<string> {
    const query = 'CALL obtener_siguiente_numero_pedido(@siguiente_numero)';
    await executeQuery(query);
    
    const resultQuery = 'SELECT @siguiente_numero as numero';
    const result = await executeQuery(resultQuery);
    
    return result[0].numero.toString().padStart(3, '0');
  }

  // Crear pedido completo
  static async createOrder(
    customerData: DatabaseCustomer,
    orderData: Omit<DatabaseOrder, 'cliente_id'>,
    cartItems: CartItem[],
    sedeId: number
  ): Promise<number> {
    const queries = [];

    // 1. Crear o actualizar cliente
    const customerId = await CustomerService.createOrUpdateCustomer(customerData);

    // 2. Crear pedido
    const orderQuery = `
      INSERT INTO pedidos (
        numero_pedido, cliente_id, sede_id, tipo_pedido, estado,
        subtotal, iva, total, metodo_pago, requiere_factura, instrucciones_especiales
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    queries.push({
      query: orderQuery,
      params: [
        orderData.numero_pedido,
        customerId,
        sedeId,
        orderData.tipo_pedido,
        orderData.estado,
        orderData.subtotal,
        orderData.iva,
        orderData.total,
        orderData.metodo_pago,
        orderData.requiere_factura,
        orderData.instrucciones_especiales || null
      ]
    });

    // Ejecutar transacción para crear pedido
    const results = await executeTransaction(queries);
    const orderId = results[0].insertId;

    // 3. Crear items del pedido
    for (const item of cartItems) {
      await this.createOrderItem(orderId, item);
    }

    return orderId;
  }

  // Crear item de pedido
  private static async createOrderItem(orderId: number, cartItem: CartItem): Promise<void> {
    const basePrice = cartItem.withFries 
      ? (cartItem.menuItem.priceWithFries || cartItem.menuItem.price) 
      : cartItem.menuItem.price;
    
    const customizationsTotal = cartItem.customizations.reduce(
      (sum, option) => sum + option.price, 0
    );
    
    const unitPrice = basePrice + customizationsTotal;
    const subtotal = unitPrice * cartItem.quantity;

    // Insertar item del pedido
    const itemQuery = `
      INSERT INTO pedido_items (
        pedido_id, producto_id, cantidad, precio_unitario, 
        con_papas, instrucciones_especiales, subtotal
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const itemResult = await executeQuery(itemQuery, [
      orderId,
      cartItem.menuItem.id,
      cartItem.quantity,
      unitPrice,
      cartItem.withFries,
      cartItem.specialInstructions || null,
      subtotal
    ]);

    const itemId = itemResult.insertId;

    // Insertar personalizaciones del item
    for (const customization of cartItem.customizations) {
      const customizationQuery = `
        INSERT INTO pedido_item_personalizaciones (
          pedido_item_id, opcion_id, precio_adicional
        ) VALUES (?, ?, ?)
      `;
      
      await executeQuery(customizationQuery, [
        itemId,
        customization.id,
        customization.price
      ]);
    }
  }

  // Obtener pedidos por sede
  static async getOrdersBySede(sedeId: number, limit: number = 50): Promise<any[]> {
    const query = `
      SELECT p.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      WHERE p.sede_id = ?
      ORDER BY p.fecha_pedido DESC
      LIMIT ?
    `;
    
    return await executeQuery(query, [sedeId, limit]);
  }

  // Actualizar estado del pedido
  static async updateOrderStatus(orderId: number, newStatus: string): Promise<void> {
    const query = 'UPDATE pedidos SET estado = ? WHERE id = ?';
    await executeQuery(query, [newStatus, orderId]);
  }
}

// =====================================================
// SERVICIO DE FACTURAS
// =====================================================

export class InvoiceService {
  // Generar número de factura
  static async getNextInvoiceNumber(): Promise<string> {
    const query = 'SELECT CAST(valor AS UNSIGNED) as ultimo FROM configuracion_sistema WHERE clave = "ultimo_numero_factura"';
    const result = await executeQuery(query);
    const nextNumber = (result[0]?.ultimo || 0) + 1;
    
    // Actualizar el último número
    const updateQuery = 'UPDATE configuracion_sistema SET valor = ? WHERE clave = "ultimo_numero_factura"';
    await executeQuery(updateQuery, [nextNumber.toString()]);
    
    return `FAC-${nextNumber.toString().padStart(6, '0')}`;
  }

  // Crear factura
  static async createInvoice(invoiceData: DatabaseInvoice): Promise<number> {
    const query = `
      INSERT INTO facturas (
        numero_factura, pedido_id, cliente_nombre, cliente_cedula, 
        cliente_email, subtotal, iva, total, archivo_pdf_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [
      invoiceData.numero_factura,
      invoiceData.pedido_id,
      invoiceData.cliente_nombre,
      invoiceData.cliente_cedula,
      invoiceData.cliente_email,
      invoiceData.subtotal,
      invoiceData.iva,
      invoiceData.total,
      invoiceData.archivo_pdf_url || null
    ]);
    
    return result.insertId;
  }
}

// =====================================================
// SERVICIO DE SEDES
// =====================================================

export class LocationService {
  // Obtener todas las sedes activas
  static async getAllLocations(): Promise<Location[]> {
    const query = 'SELECT * FROM sedes WHERE activo = true ORDER BY nombre';
    const locations = await executeQuery(query);
    
    return locations.map((location: any) => ({
      id: location.id.toString(),
      name: location.nombre,
      address: location.direccion,
      phone: location.telefono,
      whatsapp: location.whatsapp,
      neighborhood: location.barrio,
      deliveryZones: JSON.parse(location.zonas_entrega || '[]')
    }));
  }

  // Obtener sede por ID
  static async getLocationById(locationId: number): Promise<Location | null> {
    const query = 'SELECT * FROM sedes WHERE id = ? AND activo = true';
    const locations = await executeQuery(query, [locationId]);
    
    if (locations.length === 0) return null;
    
    const location = locations[0];
    return {
      id: location.id.toString(),
      name: location.nombre,
      address: location.direccion,
      phone: location.telefono,
      whatsapp: location.whatsapp,
      neighborhood: location.barrio,
      deliveryZones: JSON.parse(location.zonas_entrega || '[]')
    };
  }
}

// =====================================================
// SERVICIO DE REPORTES
// =====================================================

export class ReportsService {
  // Reporte de ventas por fecha
  static async getSalesReport(startDate: string, endDate: string, sedeId?: number): Promise<any[]> {
    const query = `
      CALL generar_reporte_ventas(?, ?, ?)
    `;
    
    return await executeQuery(query, [startDate, endDate, sedeId || null]);
  }

  // Productos más vendidos
  static async getTopProducts(sedeId?: number, limit: number = 10): Promise<any[]> {
    let query = `
      SELECT 
        p.nombre,
        SUM(pi.cantidad) as total_vendido,
        SUM(pi.subtotal) as total_ventas
      FROM pedido_items pi
      JOIN productos p ON pi.producto_id = p.id
      JOIN pedidos ped ON pi.pedido_id = ped.id
      WHERE ped.estado != 'cancelado'
    `;
    
    const params = [];
    
    if (sedeId) {
      query += ' AND ped.sede_id = ?';
      params.push(sedeId);
    }
    
    query += `
      GROUP BY p.id, p.nombre
      ORDER BY total_vendido DESC
      LIMIT ?
    `;
    params.push(limit);
    
    return await executeQuery(query, params);
  }

  // Ventas diarias
  static async getDailySales(sedeId?: number, days: number = 30): Promise<any[]> {
    let query = `
      SELECT * FROM ventas_diarias
      WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    `;
    
    const params = [days];
    
    if (sedeId) {
      query += ' AND sede_id = ?';
      params.push(sedeId);
    }
    
    query += ' ORDER BY fecha DESC';
    
    return await executeQuery(query, params);
  }
}

// =====================================================
// SERVICIO DE CONFIGURACIÓN
// =====================================================

export class ConfigService {
  // Obtener configuración por clave
  static async getConfig(key: string): Promise<string | null> {
    const query = 'SELECT valor FROM configuracion_sistema WHERE clave = ?';
    const result = await executeQuery(query, [key]);
    return result.length > 0 ? result[0].valor : null;
  }

  // Establecer configuración
  static async setConfig(key: string, value: string, description?: string): Promise<void> {
    const query = `
      INSERT INTO configuracion_sistema (clave, valor, descripcion)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE valor = VALUES(valor), descripcion = VALUES(descripcion)
    `;
    
    await executeQuery(query, [key, value, description || null]);
  }

  // Obtener todas las configuraciones
  static async getAllConfigs(): Promise<any[]> {
    const query = 'SELECT * FROM configuracion_sistema ORDER BY clave';
    return await executeQuery(query);
  }
}

// =====================================================
// SERVICIO DE LOGS
// =====================================================

export class LogService {
  // Registrar log
  static async log(
    level: 'info' | 'warning' | 'error' | 'debug',
    message: string,
    context?: any,
    userId?: number,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const query = `
      INSERT INTO logs_sistema (nivel, mensaje, contexto, usuario_id, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    await executeQuery(query, [
      level,
      message,
      context ? JSON.stringify(context) : null,
      userId || null,
      ipAddress || null,
      userAgent || null
    ]);
  }

  // Obtener logs recientes
  static async getRecentLogs(limit: number = 100, level?: string): Promise<any[]> {
    let query = 'SELECT * FROM logs_sistema';
    const params = [];
    
    if (level) {
      query += ' WHERE nivel = ?';
      params.push(level);
    }
    
    query += ' ORDER BY fecha_creacion DESC LIMIT ?';
    params.push(limit);
    
    return await executeQuery(query, params);
  }
}