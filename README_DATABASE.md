# 🗄️ Sistema de Base de Datos MySQL - Parrilleros Fast Food

## 📋 Descripción General

Este documento describe la implementación completa del sistema de base de datos MySQL para el kiosco de autoservicio de Parrilleros Fast Food. El sistema está diseñado para manejar productos, pedidos, facturas, ventas y reportes de manera eficiente y escalable.

## 🏗️ Arquitectura de la Base de Datos

### 📊 Diagrama de Entidades

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   categorias    │    │    productos    │    │     sedes       │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄──┤│ categoria_id(FK)│    │ id (PK)         │
│ nombre          │    │ nombre          │    │ nombre          │
│ descripcion     │    │ precio          │    │ direccion       │
│ icono           │    │ imagen_url      │    │ telefono        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   clientes      │    │    pedidos      │    │ pedido_items    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄──┤│ cliente_id (FK) │◄──┤│ pedido_id (FK)  │
│ nombre          │    │ sede_id (FK)    │    │ producto_id(FK) │
│ telefono        │    │ numero_pedido   │    │ cantidad        │
│ email           │    │ total           │    │ precio_unitario │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🗂️ Tablas Principales

#### 1. **categorias**
- Almacena las categorías de productos (Hamburguesas, Bebidas, etc.)
- Incluye orden de visualización e iconos

#### 2. **productos**
- Catálogo completo de productos
- Precios regulares y con papas
- URLs de imágenes y configuración de personalización

#### 3. **opciones_personalizacion**
- Adiciones disponibles (quesos, carnes, vegetales)
- Precios adicionales por cada opción

#### 4. **sedes**
- Información de cada ubicación de Parrilleros
- Zonas de entrega en formato JSON

#### 5. **clientes**
- Datos de clientes para pedidos a domicilio
- Información de contacto y facturación

#### 6. **pedidos**
- Pedidos realizados con estado y totales
- Relación con cliente y sede

#### 7. **pedido_items**
- Items individuales de cada pedido
- Cantidades, precios y personalizaciones

#### 8. **facturas**
- Facturas emitidas para clientes que las requieren
- Números de factura únicos y archivos PDF

## 🚀 Instalación y Configuración

### 1. **Requisitos Previos**

```bash
# MySQL 8.0 o superior
# Node.js 18+ con npm
# Dependencias del proyecto ya instaladas
```

### 2. **Configuración de Base de Datos**

```sql
-- Crear base de datos
CREATE DATABASE parrilleros_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario (opcional)
CREATE USER 'parrilleros_user'@'localhost' IDENTIFIED BY 'password_seguro';
GRANT ALL PRIVILEGES ON parrilleros_db.* TO 'parrilleros_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. **Variables de Entorno**

Crea un archivo `.env` basado en `.env.example`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=parrilleros_db
```

### 4. **Inicialización Automática**

El sistema incluye inicialización automática que:

```typescript
// Se ejecuta al iniciar la aplicación
import { initializeDatabaseOnStartup } from './src/utils/databaseInitializer';

// Inicializar en el arranque
await initializeDatabaseOnStartup();
```

## 🔧 Servicios y APIs

### 📦 ProductService

```typescript
// Obtener todos los productos
const products = await ProductService.getAllProducts();

// Productos por categoría
const burgers = await ProductService.getProductsByCategory('Hamburguesas Clásicas');

// Opciones de personalización
const options = await ProductService.getCustomizationOptions(productId);
```

### 🛒 OrderService

```typescript
// Crear pedido completo
const { orderId, orderNumber } = await OrderService.createOrder(
  customerData,
  orderData,
  cartItems,
  sedeId
);

// Obtener siguiente número de pedido
const nextNumber = await OrderService.getNextOrderNumber();

// Actualizar estado
await OrderService.updateOrderStatus(orderId, 'confirmado');
```

### 🧾 InvoiceService

```typescript
// Crear factura
const invoiceNumber = await InvoiceService.createInvoice({
  numero_factura: 'FAC-000001',
  pedido_id: orderId,
  cliente_nombre: 'Juan Pérez',
  cliente_cedula: '12345678',
  cliente_email: 'juan@email.com',
  subtotal: 18400,
  iva: 1600,
  total: 20000
});
```

### 📊 ReportsService

```typescript
// Reporte de ventas
const salesReport = await ReportsService.getSalesReport(
  '2025-01-01',
  '2025-01-31',
  sedeId
);

// Productos más vendidos
const topProducts = await ReportsService.getTopProducts(sedeId, 10);

// Ventas diarias
const dailySales = await ReportsService.getDailySales(sedeId, 30);
```

## 🎯 Hooks de React

### useDatabase - Hook Principal

```typescript
import { useDatabase } from './src/hooks/useDatabase';

function MyComponent() {
  const { products, orders, invoices, locations, reports } = useDatabase();
  
  // Crear pedido
  const handleCreateOrder = async () => {
    const result = await orders.createOrder(
      customerData,
      cartItems,
      sedeId,
      paymentMethod,
      requiresInvoice
    );
  };
  
  return (
    <div>
      {products.loading ? 'Cargando...' : 'Productos listos'}
    </div>
  );
}
```

### useOrders - Gestión de Pedidos

```typescript
import { useOrders } from './src/hooks/useDatabase';

function OrdersPage() {
  const { orders, loading, createOrder, updateOrderStatus } = useOrders();
  
  const handleNewOrder = async () => {
    try {
      const { orderId, orderNumber } = await createOrder(
        customerData,
        cartItems,
        sedeId,
        'Efectivo',
        false
      );
      
      console.log(`Pedido creado: ${orderNumber}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return <OrdersList orders={orders} loading={loading} />;
}
```

## 📈 Características Avanzadas

### 🔄 Triggers Automáticos

```sql
-- Actualización automática de ventas diarias
CREATE TRIGGER actualizar_ventas_diarias_insert
AFTER INSERT ON pedidos
FOR EACH ROW
BEGIN
    -- Actualiza automáticamente las estadísticas diarias
    INSERT INTO ventas_diarias (sede_id, fecha, total_pedidos, total_ventas)
    VALUES (NEW.sede_id, DATE(NEW.fecha_pedido), 1, NEW.total)
    ON DUPLICATE KEY UPDATE
        total_pedidos = total_pedidos + 1,
        total_ventas = total_ventas + NEW.total;
END;
```

### 📊 Vistas Optimizadas

```sql
-- Vista para pedidos completos
CREATE VIEW vista_pedidos_completos AS
SELECT 
    p.numero_pedido,
    p.estado,
    p.total,
    c.nombre as cliente_nombre,
    s.nombre as sede_nombre
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
JOIN sedes s ON p.sede_id = s.id;
```

### 🔧 Procedimientos Almacenados

```sql
-- Generar siguiente número de pedido
CALL obtener_siguiente_numero_pedido(@siguiente_numero);

-- Generar reportes de ventas
CALL generar_reporte_ventas('2025-01-01', '2025-01-31', 1);
```

## 🛡️ Seguridad y Optimización

### 🔒 Medidas de Seguridad

1. **Validación de Datos**: Todos los inputs son validados
2. **Transacciones**: Operaciones críticas usan transacciones
3. **Logs de Auditoría**: Registro completo de operaciones
4. **Claves Foráneas**: Integridad referencial garantizada

### ⚡ Optimizaciones

1. **Índices Estratégicos**: Para consultas frecuentes
2. **Pool de Conexiones**: Gestión eficiente de conexiones
3. **Cache de Consultas**: Resultados frecuentes en memoria
4. **Paginación**: Para listados grandes

### 📊 Índices Principales

```sql
-- Índices para optimización
CREATE INDEX idx_pedidos_sede_fecha ON pedidos(sede_id, fecha_pedido);
CREATE INDEX idx_productos_categoria_activo ON productos(categoria_id, activo);
CREATE INDEX idx_ventas_sede_fecha ON ventas_diarias(sede_id, fecha);
```

## 📋 Mantenimiento

### 🔄 Backup Automático

```typescript
// Configurar backup diario
const backupConfig = {
  schedule: '0 2 * * *', // 2:00 AM diario
  retention: 30, // 30 días
  compression: true
};
```

### 🧹 Limpieza de Datos

```sql
-- Limpiar logs antiguos (más de 90 días)
DELETE FROM logs_sistema 
WHERE fecha_creacion < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- Archivar pedidos antiguos (más de 1 año)
INSERT INTO pedidos_archivo SELECT * FROM pedidos 
WHERE fecha_pedido < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

### 📊 Monitoreo

```typescript
// Verificar salud de la base de datos
const healthCheck = await DatabaseInitializer.verifyDatabaseIntegrity();

if (!healthCheck.isValid) {
  console.error('Problemas detectados:', healthCheck.issues);
}
```

## 🚨 Solución de Problemas

### ❌ Problemas Comunes

1. **Error de Conexión**
   ```bash
   Error: connect ECONNREFUSED 127.0.0.1:3306
   ```
   - Verificar que MySQL esté ejecutándose
   - Revisar credenciales en `.env`

2. **Tablas No Encontradas**
   ```bash
   Error: Table 'parrilleros_db.productos' doesn't exist
   ```
   - Ejecutar inicialización: `DatabaseInitializer.initializeDatabase()`

3. **Datos Duplicados**
   ```bash
   Error: Duplicate entry for key 'numero_pedido'
   ```
   - Verificar secuencia de números en `configuracion_sistema`

### 🔧 Comandos de Diagnóstico

```typescript
// Verificar conexión
const isConnected = await testConnection();

// Verificar integridad
const { isValid, issues } = await DatabaseInitializer.verifyDatabaseIntegrity();

// Reinicializar (solo desarrollo)
await DatabaseInitializer.resetDatabase();
```

## 📚 Recursos Adicionales

### 📖 Documentación

- [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
- [Node.js MySQL2 Driver](https://github.com/sidorares/node-mysql2)
- [Database Design Best Practices](https://www.mysqltutorial.org/mysql-database-design/)

### 🛠️ Herramientas Recomendadas

- **MySQL Workbench**: Para administración visual
- **phpMyAdmin**: Interfaz web para MySQL
- **DBeaver**: Cliente universal de base de datos
- **MySQL Shell**: Herramienta de línea de comandos

---

## 🎯 Próximos Pasos

1. **Implementar Cache Redis** para consultas frecuentes
2. **Añadir Replicación** para alta disponibilidad
3. **Implementar Sharding** para escalabilidad
4. **Añadir Métricas** con Prometheus/Grafana
5. **Implementar CDC** (Change Data Capture) para sincronización

---

**¡La base de datos está lista para manejar el crecimiento de Parrilleros Fast Food! 🍔🚀**