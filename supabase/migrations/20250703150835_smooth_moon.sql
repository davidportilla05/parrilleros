-- =====================================================
-- PARRILLEROS FAST FOOD - ESQUEMA DE BASE DE DATOS
-- =====================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS parrilleros_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE parrilleros_db;

-- =====================================================
-- TABLA: categorias
-- =====================================================
CREATE TABLE IF NOT EXISTS categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE,
    orden_display INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: productos
-- =====================================================
CREATE TABLE IF NOT EXISTS productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    precio_con_papas DECIMAL(10,2) NULL,
    imagen_url VARCHAR(500),
    categoria_id INT NOT NULL,
    personalizable BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    orden_display INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    INDEX idx_categoria (categoria_id),
    INDEX idx_activo (activo),
    INDEX idx_precio (precio)
);

-- =====================================================
-- TABLA: opciones_personalizacion
-- =====================================================
CREATE TABLE IF NOT EXISTS opciones_personalizacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio_adicional DECIMAL(10,2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_activo (activo)
);

-- =====================================================
-- TABLA: producto_personalizaciones (relación muchos a muchos)
-- =====================================================
CREATE TABLE IF NOT EXISTS producto_personalizaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    opcion_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (opcion_id) REFERENCES opciones_personalizacion(id) ON DELETE CASCADE,
    UNIQUE KEY unique_producto_opcion (producto_id, opcion_id),
    INDEX idx_producto (producto_id),
    INDEX idx_opcion (opcion_id)
);

-- =====================================================
-- TABLA: sedes
-- =====================================================
CREATE TABLE IF NOT EXISTS sedes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    direccion VARCHAR(300) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    barrio VARCHAR(100) NOT NULL,
    zonas_entrega JSON,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_activo (activo)
);

-- =====================================================
-- TABLA: clientes
-- =====================================================
CREATE TABLE IF NOT EXISTS clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(200) NULL,
    cedula VARCHAR(20) NULL,
    direccion VARCHAR(300) NULL,
    barrio VARCHAR(100) NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_telefono (telefono),
    INDEX idx_email (email),
    INDEX idx_cedula (cedula)
);

-- =====================================================
-- TABLA: pedidos
-- =====================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_pedido VARCHAR(20) NOT NULL UNIQUE,
    cliente_id INT NOT NULL,
    sede_id INT NOT NULL,
    tipo_pedido ENUM('domicilio', 'recoger') NOT NULL,
    estado ENUM('pendiente', 'confirmado', 'preparando', 'listo', 'entregado', 'cancelado') DEFAULT 'pendiente',
    subtotal DECIMAL(10,2) NOT NULL,
    iva DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    requiere_factura BOOLEAN DEFAULT FALSE,
    instrucciones_especiales TEXT,
    tiempo_estimado_minutos INT DEFAULT 45,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_confirmacion TIMESTAMP NULL,
    fecha_entrega TIMESTAMP NULL,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE CASCADE,
    INDEX idx_numero_pedido (numero_pedido),
    INDEX idx_cliente (cliente_id),
    INDEX idx_sede (sede_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_pedido (fecha_pedido),
    INDEX idx_tipo_pedido (tipo_pedido)
);

-- =====================================================
-- TABLA: pedido_items
-- =====================================================
CREATE TABLE IF NOT EXISTS pedido_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    con_papas BOOLEAN DEFAULT FALSE,
    instrucciones_especiales TEXT,
    subtotal DECIMAL(10,2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_pedido (pedido_id),
    INDEX idx_producto (producto_id)
);

-- =====================================================
-- TABLA: pedido_item_personalizaciones
-- =====================================================
CREATE TABLE IF NOT EXISTS pedido_item_personalizaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_item_id INT NOT NULL,
    opcion_id INT NOT NULL,
    precio_adicional DECIMAL(10,2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_item_id) REFERENCES pedido_items(id) ON DELETE CASCADE,
    FOREIGN KEY (opcion_id) REFERENCES opciones_personalizacion(id) ON DELETE CASCADE,
    INDEX idx_pedido_item (pedido_item_id),
    INDEX idx_opcion (opcion_id)
);

-- =====================================================
-- TABLA: facturas
-- =====================================================
CREATE TABLE IF NOT EXISTS facturas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_factura VARCHAR(20) NOT NULL UNIQUE,
    pedido_id INT NOT NULL,
    cliente_nombre VARCHAR(200) NOT NULL,
    cliente_cedula VARCHAR(20) NOT NULL,
    cliente_email VARCHAR(200) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    iva DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archivo_pdf_url VARCHAR(500) NULL,
    enviado_email BOOLEAN DEFAULT FALSE,
    fecha_envio_email TIMESTAMP NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    INDEX idx_numero_factura (numero_factura),
    INDEX idx_pedido (pedido_id),
    INDEX idx_cliente_cedula (cliente_cedula),
    INDEX idx_fecha_emision (fecha_emision)
);

-- =====================================================
-- TABLA: ventas_diarias (resumen para reportes)
-- =====================================================
CREATE TABLE IF NOT EXISTS ventas_diarias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sede_id INT NOT NULL,
    fecha DATE NOT NULL,
    total_pedidos INT DEFAULT 0,
    total_productos_vendidos INT DEFAULT 0,
    total_ventas DECIMAL(12,2) DEFAULT 0.00,
    total_iva DECIMAL(12,2) DEFAULT 0.00,
    promedio_pedido DECIMAL(10,2) DEFAULT 0.00,
    pedidos_domicilio INT DEFAULT 0,
    pedidos_recoger INT DEFAULT 0,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_sede_fecha (sede_id, fecha),
    INDEX idx_sede (sede_id),
    INDEX idx_fecha (fecha)
);

-- =====================================================
-- TABLA: productos_mas_vendidos (cache para reportes)
-- =====================================================
CREATE TABLE IF NOT EXISTS productos_mas_vendidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    sede_id INT NOT NULL,
    periodo ENUM('diario', 'semanal', 'mensual') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    cantidad_vendida INT NOT NULL,
    total_ventas DECIMAL(12,2) NOT NULL,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id),
    INDEX idx_sede (sede_id),
    INDEX idx_periodo (periodo),
    INDEX idx_fecha_inicio (fecha_inicio)
);

-- =====================================================
-- TABLA: configuracion_sistema
-- =====================================================
CREATE TABLE IF NOT EXISTS configuracion_sistema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    descripcion TEXT,
    tipo ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_clave (clave)
);

-- =====================================================
-- TABLA: logs_sistema
-- =====================================================
CREATE TABLE IF NOT EXISTS logs_sistema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nivel ENUM('info', 'warning', 'error', 'debug') NOT NULL,
    mensaje TEXT NOT NULL,
    contexto JSON NULL,
    usuario_id INT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nivel (nivel),
    INDEX idx_fecha_creacion (fecha_creacion)
);

-- =====================================================
-- INSERTAR DATOS INICIALES
-- =====================================================

-- Insertar categorías
INSERT INTO categorias (nombre, descripcion, icono, orden_display) VALUES
('Hamburguesas Clásicas', 'Hamburguesas tradicionales con ingredientes clásicos', 'beef', 1),
('Hamburguesas Deluxe', 'Hamburguesas premium con ingredientes especiales', 'beef', 2),
('Hamburguesas Burger Master', 'Hamburguesas de concurso con preparaciones únicas', 'beef', 3),
('Perros Calientes', 'Hot dogs con variedad de ingredientes', 'beef', 4),
('Papas', 'Papas preparadas de diferentes formas', 'french-fries', 5),
('Acompañamientos', 'Complementos para tus comidas', 'french-fries', 6),
('Bebidas', 'Refrescos, jugos y bebidas variadas', 'cup-soda', 7);

-- Insertar opciones de personalización
INSERT INTO opciones_personalizacion (nombre, descripcion, precio_adicional) VALUES
('AD CHORIZO', 'Adición de chorizo', 4000.00),
('AD TOCINETA', 'Adición de tocineta', 4000.00),
('AD CARNE', 'Adición de carne', 8000.00),
('AD CARNE CERTIFIED ANGUS BEEF', 'Adición de carne premium', 13000.00),
('AD PIÑA ASADA', 'Adición de piña asada', 2500.00),
('AD CEBOLLA CARAMELIZADA', 'Adición de cebolla caramelizada', 3000.00),
('AD QUESO FUNDIDO', 'Adición de queso fundido', 3000.00),
('AD QUESO CHEDDAR', 'Adición de queso cheddar', 4000.00),
('AD QUESO COLBY JACK', 'Adición de queso colby jack', 4000.00),
('AD QUESO SABANA', 'Adición de queso sabana', 4000.00),
('AD AROS DE CEBOLLA APANADOS', 'Adición de aros de cebolla (3 unidades)', 4500.00),
('AD CEBOLLA CRUNCH', 'Adición de cebolla crunch', 3000.00),
('AD PEPINILLOS', 'Adición de pepinillos', 3000.00),
('AD JALAPEÑOS', 'Adición de jalapeños', 3000.00),
('AD QUESO LIQUIDO Y TIERRA DE TOCINETA', 'Adición de queso líquido y tocineta', 7000.00),
('AD RIPIO DE PAPA CROCANTE', 'Adición de ripio de papa', 1000.00);

-- Insertar sedes
INSERT INTO sedes (nombre, direccion, telefono, whatsapp, barrio, zonas_entrega) VALUES
('Parrilleros Tamasagra', 'Manzana 9A casa 1 - Tamasagra', '301 222 2098', '+573186025827', 'Tamasagra', '["Cualquier sitio de la ciudad"]'),
('Parrilleros San Ignacio', 'Cra 32 # 14 - 84 - San Ignacio', '316 606 0005', '+573148300987', 'San Ignacio', '["Cualquier sitio de la ciudad"]'),
('Parrilleros Cuadras', 'Calle 20 # 31C - 38 - Las Cuadras', '313 341 9733', '+573186025829', 'Las Cuadras', '["Cualquier sitio de la ciudad"]');

-- Insertar configuración inicial del sistema
INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo) VALUES
('ultimo_numero_pedido', '0', 'Último número de pedido generado', 'number'),
('ultimo_numero_factura', '0', 'Último número de factura generado', 'number'),
('iva_porcentaje', '8', 'Porcentaje de IVA aplicado', 'number'),
('tiempo_entrega_default', '45', 'Tiempo de entrega por defecto en minutos', 'number'),
('empresa_nombre', 'PARRILLEROS FAST FOOD', 'Nombre de la empresa', 'string'),
('empresa_nit', '123456789-1', 'NIT de la empresa', 'string'),
('empresa_direccion', 'Pasto, Nariño, Colombia', 'Dirección principal de la empresa', 'string'),
('empresa_telefono', '301 222 2098', 'Teléfono principal de la empresa', 'string'),
('notificaciones_email', 'true', 'Activar notificaciones por email', 'boolean'),
('backup_automatico', 'true', 'Activar backup automático diario', 'boolean');

-- =====================================================
-- TRIGGERS PARA AUTOMATIZACIÓN
-- =====================================================

-- Trigger para actualizar ventas diarias cuando se inserta un pedido
DELIMITER //
CREATE TRIGGER actualizar_ventas_diarias_insert
AFTER INSERT ON pedidos
FOR EACH ROW
BEGIN
    INSERT INTO ventas_diarias (sede_id, fecha, total_pedidos, total_ventas, total_iva)
    VALUES (NEW.sede_id, DATE(NEW.fecha_pedido), 1, NEW.total, NEW.iva)
    ON DUPLICATE KEY UPDATE
        total_pedidos = total_pedidos + 1,
        total_ventas = total_ventas + NEW.total,
        total_iva = total_iva + NEW.iva,
        promedio_pedido = total_ventas / total_pedidos,
        pedidos_domicilio = CASE WHEN NEW.tipo_pedido = 'domicilio' THEN pedidos_domicilio + 1 ELSE pedidos_domicilio END,
        pedidos_recoger = CASE WHEN NEW.tipo_pedido = 'recoger' THEN pedidos_recoger + 1 ELSE pedidos_recoger END;
END//

-- Trigger para actualizar ventas diarias cuando se actualiza un pedido
DELIMITER //
CREATE TRIGGER actualizar_ventas_diarias_update
AFTER UPDATE ON pedidos
FOR EACH ROW
BEGIN
    IF OLD.total != NEW.total OR OLD.iva != NEW.iva THEN
        UPDATE ventas_diarias 
        SET total_ventas = total_ventas - OLD.total + NEW.total,
            total_iva = total_iva - OLD.iva + NEW.iva,
            promedio_pedido = total_ventas / total_pedidos
        WHERE sede_id = NEW.sede_id AND fecha = DATE(NEW.fecha_pedido);
    END IF;
END//

DELIMITER ;

-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_pedidos_sede_fecha ON pedidos(sede_id, fecha_pedido);
CREATE INDEX idx_pedidos_estado_fecha ON pedidos(estado, fecha_pedido);
CREATE INDEX idx_productos_categoria_activo ON productos(categoria_id, activo);
CREATE INDEX idx_ventas_sede_fecha ON ventas_diarias(sede_id, fecha);

-- =====================================================
-- VISTAS PARA CONSULTAS FRECUENTES
-- =====================================================

-- Vista para pedidos con información completa
CREATE VIEW vista_pedidos_completos AS
SELECT 
    p.id,
    p.numero_pedido,
    p.tipo_pedido,
    p.estado,
    p.total,
    p.fecha_pedido,
    c.nombre as cliente_nombre,
    c.telefono as cliente_telefono,
    c.direccion as cliente_direccion,
    s.nombre as sede_nombre,
    s.telefono as sede_telefono
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
JOIN sedes s ON p.sede_id = s.id;

-- Vista para productos con categoría
CREATE VIEW vista_productos_completos AS
SELECT 
    p.id,
    p.nombre,
    p.descripcion,
    p.precio,
    p.precio_con_papas,
    p.imagen_url,
    p.personalizable,
    p.activo,
    c.nombre as categoria_nombre,
    c.icono as categoria_icono
FROM productos p
JOIN categorias c ON p.categoria_id = c.id;

-- Vista para ventas por sede
CREATE VIEW vista_ventas_por_sede AS
SELECT 
    s.nombre as sede_nombre,
    vd.fecha,
    vd.total_pedidos,
    vd.total_ventas,
    vd.promedio_pedido,
    vd.pedidos_domicilio,
    vd.pedidos_recoger
FROM ventas_diarias vd
JOIN sedes s ON vd.sede_id = s.id;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Procedimiento para obtener el siguiente número de pedido
DELIMITER //
CREATE PROCEDURE obtener_siguiente_numero_pedido(OUT siguiente_numero INT)
BEGIN
    DECLARE ultimo_numero INT DEFAULT 0;
    
    SELECT CAST(valor AS UNSIGNED) INTO ultimo_numero 
    FROM configuracion_sistema 
    WHERE clave = 'ultimo_numero_pedido';
    
    SET siguiente_numero = ultimo_numero + 1;
    
    UPDATE configuracion_sistema 
    SET valor = siguiente_numero 
    WHERE clave = 'ultimo_numero_pedido';
END//

-- Procedimiento para generar reporte de ventas
DELIMITER //
CREATE PROCEDURE generar_reporte_ventas(
    IN fecha_inicio DATE,
    IN fecha_fin DATE,
    IN sede_id_param INT
)
BEGIN
    SELECT 
        DATE(p.fecha_pedido) as fecha,
        COUNT(*) as total_pedidos,
        SUM(p.total) as total_ventas,
        AVG(p.total) as promedio_pedido,
        SUM(CASE WHEN p.tipo_pedido = 'domicilio' THEN 1 ELSE 0 END) as pedidos_domicilio,
        SUM(CASE WHEN p.tipo_pedido = 'recoger' THEN 1 ELSE 0 END) as pedidos_recoger
    FROM pedidos p
    WHERE DATE(p.fecha_pedido) BETWEEN fecha_inicio AND fecha_fin
    AND (sede_id_param IS NULL OR p.sede_id = sede_id_param)
    AND p.estado != 'cancelado'
    GROUP BY DATE(p.fecha_pedido)
    ORDER BY fecha DESC;
END//

DELIMITER ;

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================

/*
ESTRUCTURA COMPLETADA:

1. TABLAS PRINCIPALES:
   - categorias: Categorías de productos
   - productos: Catálogo de productos
   - opciones_personalizacion: Opciones para personalizar productos
   - sedes: Ubicaciones de Parrilleros
   - clientes: Información de clientes
   - pedidos: Pedidos realizados
   - facturas: Facturas emitidas

2. TABLAS DE RELACIÓN:
   - producto_personalizaciones: Relación productos-opciones
   - pedido_items: Items de cada pedido
   - pedido_item_personalizaciones: Personalizaciones por item

3. TABLAS DE ANÁLISIS:
   - ventas_diarias: Resumen diario de ventas
   - productos_mas_vendidos: Cache de productos populares

4. TABLAS DE SISTEMA:
   - configuracion_sistema: Configuraciones generales
   - logs_sistema: Registro de eventos

5. AUTOMATIZACIÓN:
   - Triggers para actualizar ventas automáticamente
   - Procedimientos para generar números y reportes
   - Vistas para consultas optimizadas

6. OPTIMIZACIÓN:
   - Índices estratégicos para consultas rápidas
   - Claves foráneas para integridad referencial
   - Campos de auditoría (fechas de creación/actualización)
*/