// Base de datos en memoria usando SQLite para WebContainer
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Esquema de la base de datos IndexedDB
interface ParrillerosDB extends DBSchema {
  productos: {
    key: number;
    value: {
      id: number;
      nombre: string;
      descripcion: string;
      precio: number;
      precio_con_papas?: number;
      imagen_url: string;
      categoria_id: number;
      personalizable: boolean;
      activo: boolean;
      orden_display: number;
    };
    indexes: { 'by-categoria': number; 'by-activo': boolean };
  };
  categorias: {
    key: number;
    value: {
      id: number;
      nombre: string;
      descripcion: string;
      icono: string;
      orden_display: number;
      activo: boolean;
    };
  };
  clientes: {
    key: number;
    value: {
      id: number;
      nombre: string;
      telefono: string;
      email?: string;
      cedula?: string;
      direccion?: string;
      barrio?: string;
      fecha_creacion: string;
    };
    indexes: { 'by-telefono': string };
  };
  pedidos: {
    key: number;
    value: {
      id: number;
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
      fecha_pedido: string;
      items: any[];
    };
    indexes: { 'by-numero': string; 'by-sede': number; 'by-fecha': string };
  };
  facturas: {
    key: number;
    value: {
      id: number;
      numero_factura: string;
      pedido_id: number;
      cliente_nombre: string;
      cliente_cedula: string;
      cliente_email: string;
      subtotal: number;
      iva: number;
      total: number;
      fecha_creacion: string;
    };
    indexes: { 'by-numero': string; 'by-pedido': number };
  };
  configuracion: {
    key: string;
    value: {
      clave: string;
      valor: string;
      descripcion?: string;
      fecha_actualizacion: string;
    };
  };
  opciones_personalizacion: {
    key: number;
    value: {
      id: number;
      nombre: string;
      precio_adicional: number;
      activo: boolean;
      categoria: string;
    };
  };
  sedes: {
    key: number;
    value: {
      id: number;
      nombre: string;
      direccion: string;
      telefono: string;
      whatsapp: string;
      barrio: string;
      zonas_entrega: string[];
      activo: boolean;
    };
  };
}

// Instancia de la base de datos
let dbInstance: IDBPDatabase<ParrillerosDB> | null = null;

// Inicializar base de datos IndexedDB
export const initializeDB = async (): Promise<IDBPDatabase<ParrillerosDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<ParrillerosDB>('parrilleros-db', 1, {
    upgrade(db) {
      // Crear store de productos
      const productStore = db.createObjectStore('productos', { keyPath: 'id' });
      productStore.createIndex('by-categoria', 'categoria_id');
      productStore.createIndex('by-activo', 'activo');

      // Crear store de categorías
      db.createObjectStore('categorias', { keyPath: 'id' });

      // Crear store de clientes
      const clientStore = db.createObjectStore('clientes', { keyPath: 'id', autoIncrement: true });
      clientStore.createIndex('by-telefono', 'telefono', { unique: true });

      // Crear store de pedidos
      const orderStore = db.createObjectStore('pedidos', { keyPath: 'id', autoIncrement: true });
      orderStore.createIndex('by-numero', 'numero_pedido', { unique: true });
      orderStore.createIndex('by-sede', 'sede_id');
      orderStore.createIndex('by-fecha', 'fecha_pedido');

      // Crear store de facturas
      const invoiceStore = db.createObjectStore('facturas', { keyPath: 'id', autoIncrement: true });
      invoiceStore.createIndex('by-numero', 'numero_factura', { unique: true });
      invoiceStore.createIndex('by-pedido', 'pedido_id');

      // Crear store de configuración
      db.createObjectStore('configuracion', { keyPath: 'clave' });

      // Crear store de opciones de personalización
      db.createObjectStore('opciones_personalizacion', { keyPath: 'id' });

      // Crear store de sedes
      db.createObjectStore('sedes', { keyPath: 'id' });
    },
  });

  return dbInstance;
};

// Obtener instancia de la base de datos
export const getDB = async (): Promise<IDBPDatabase<ParrillerosDB>> => {
  if (!dbInstance) {
    dbInstance = await initializeDB();
  }
  return dbInstance;
};

// Función para probar la conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    const db = await getDB();
    // Intentar una operación simple
    await db.count('productos');
    console.log('✅ Conexión a IndexedDB establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a IndexedDB:', error);
    return false;
  }
};

// Función para ejecutar queries simuladas
export const executeQuery = async (query: string, params: any[] = []): Promise<any> => {
  const db = await getDB();
  
  // Simular queries SQL básicas con IndexedDB
  try {
    // Parsear query básico (esto es una simplificación)
    if (query.includes('SELECT') && query.includes('productos')) {
      const products = await db.getAll('productos');
      return products;
    }
    
    if (query.includes('SELECT') && query.includes('categorias')) {
      const categories = await db.getAll('categorias');
      return categories;
    }
    
    if (query.includes('SELECT') && query.includes('configuracion_sistema')) {
      const configs = await db.getAll('configuracion');
      return configs;
    }
    
    // Para otras queries, retornar array vacío
    return [];
  } catch (error) {
    console.error('Error ejecutando query:', error);
    throw error;
  }
};

// Función para ejecutar transacciones
export const executeTransaction = async (queries: { query: string; params: any[] }[]): Promise<any> => {
  const db = await getDB();
  
  try {
    const results = [];
    
    // Ejecutar todas las queries en una transacción
    const tx = db.transaction(['productos', 'categorias', 'clientes', 'pedidos', 'facturas'], 'readwrite');
    
    for (const { query, params } of queries) {
      // Simular ejecución de query
      const result = { insertId: Date.now() + Math.random() };
      results.push(result);
    }
    
    await tx.done;
    return results;
  } catch (error) {
    console.error('Error en transacción:', error);
    throw error;
  }
};

// Funciones específicas para IndexedDB
export const dbOperations = {
  // Productos
  async getAllProducts() {
    const db = await getDB();
    return await db.getAll('productos');
  },

  async getProductsByCategory(categoryId: number) {
    const db = await getDB();
    return await db.getAllFromIndex('productos', 'by-categoria', categoryId);
  },

  async addProduct(product: any) {
    const db = await getDB();
    return await db.add('productos', product);
  },

  // Categorías
  async getAllCategories() {
    const db = await getDB();
    return await db.getAll('categorias');
  },

  async addCategory(category: any) {
    const db = await getDB();
    return await db.add('categorias', category);
  },

  // Clientes
  async addCustomer(customer: any) {
    const db = await getDB();
    const customerWithDate = {
      ...customer,
      fecha_creacion: new Date().toISOString()
    };
    return await db.add('clientes', customerWithDate);
  },

  async getCustomerByPhone(phone: string) {
    const db = await getDB();
    return await db.getFromIndex('clientes', 'by-telefono', phone);
  },

  // Pedidos
  async addOrder(order: any) {
    const db = await getDB();
    const orderWithDate = {
      ...order,
      fecha_pedido: new Date().toISOString()
    };
    return await db.add('pedidos', orderWithDate);
  },

  async getOrderByNumber(orderNumber: string) {
    const db = await getDB();
    return await db.getFromIndex('pedidos', 'by-numero', orderNumber);
  },

  async getAllOrders() {
    const db = await getDB();
    return await db.getAll('pedidos');
  },

  // Facturas
  async addInvoice(invoice: any) {
    const db = await getDB();
    const invoiceWithDate = {
      ...invoice,
      fecha_creacion: new Date().toISOString()
    };
    return await db.add('facturas', invoiceWithDate);
  },

  // Configuración
  async getConfig(key: string) {
    const db = await getDB();
    const config = await db.get('configuracion', key);
    return config?.valor || null;
  },

  async setConfig(key: string, value: string, description?: string) {
    const db = await getDB();
    return await db.put('configuracion', {
      clave: key,
      valor: value,
      descripcion,
      fecha_actualizacion: new Date().toISOString()
    });
  },

  // Opciones de personalización
  async getAllCustomizationOptions() {
    const db = await getDB();
    return await db.getAll('opciones_personalizacion');
  },

  async addCustomizationOption(option: any) {
    const db = await getDB();
    return await db.add('opciones_personalizacion', option);
  },

  // Sedes
  async getAllLocations() {
    const db = await getDB();
    return await db.getAll('sedes');
  },

  async addLocation(location: any) {
    const db = await getDB();
    return await db.add('sedes', location);
  }
};