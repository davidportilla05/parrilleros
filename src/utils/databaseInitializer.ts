import { executeQuery } from '../config/database';
import { LogService } from '../services/databaseService';

// =====================================================
// INICIALIZADOR DE BASE DE DATOS
// =====================================================

export class DatabaseInitializer {
  
  // Poblar productos desde el menú existente
  static async populateProductsFromMenu(): Promise<void> {
    try {
      console.log('🔄 Iniciando población de productos...');
      
      // Importar datos del menú existente
      const { menuItems, categories } = await import('../data/menu');
      
      // Insertar categorías
      for (const category of categories) {
        const categoryQuery = `
          INSERT IGNORE INTO categorias (nombre, descripcion, icono, orden_display)
          VALUES (?, ?, ?, ?)
        `;
        
        await executeQuery(categoryQuery, [
          category.name,
          `Categoría de ${category.name}`,
          category.icon,
          categories.indexOf(category) + 1
        ]);
      }
      
      console.log('✅ Categorías insertadas');
      
      // Obtener IDs de categorías
      const categoriesFromDB = await executeQuery('SELECT * FROM categorias');
      const categoryMap = new Map();
      categoriesFromDB.forEach((cat: any) => {
        categoryMap.set(cat.nombre, cat.id);
      });
      
      // Insertar productos
      for (const item of menuItems) {
        // Mapear categoría del frontend a la base de datos
        let categoryName = '';
        switch (item.category) {
          case 'classic-burgers':
            categoryName = 'Hamburguesas Clásicas';
            break;
          case 'deluxe-burgers':
            categoryName = 'Hamburguesas Deluxe';
            break;
          case 'contest-burgers':
            categoryName = 'Hamburguesas Burger Master';
            break;
          case 'hotdogs':
            categoryName = 'Perros Calientes';
            break;
          case 'fries':
            categoryName = 'Papas';
            break;
          case 'sides':
            categoryName = 'Acompañamientos';
            break;
          case 'drinks':
            categoryName = 'Bebidas';
            break;
          default:
            categoryName = 'Hamburguesas Clásicas';
        }
        
        const categoryId = categoryMap.get(categoryName);
        if (!categoryId) {
          console.warn(`Categoría no encontrada: ${categoryName}`);
          continue;
        }
        
        const productQuery = `
          INSERT IGNORE INTO productos (
            id, nombre, descripcion, precio, precio_con_papas, 
            imagen_url, categoria_id, personalizable, activo, orden_display
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await executeQuery(productQuery, [
          item.id,
          item.name,
          item.description,
          item.price,
          item.priceWithFries || null,
          item.image,
          categoryId,
          item.customizable || false,
          true,
          item.id
        ]);
      }
      
      console.log('✅ Productos insertados');
      
      // Relacionar productos con opciones de personalización
      await this.linkProductCustomizations();
      
      await LogService.log('info', 'Base de datos poblada con productos del menú', {
        categoriesCount: categories.length,
        productsCount: menuItems.length
      });
      
      console.log('✅ Base de datos poblada exitosamente');
      
    } catch (error) {
      console.error('❌ Error poblando base de datos:', error);
      await LogService.log('error', 'Error poblando base de datos', { error });
      throw error;
    }
  }
  
  // Relacionar productos con opciones de personalización
  private static async linkProductCustomizations(): Promise<void> {
    try {
      // Obtener productos personalizables (hamburguesas principalmente)
      const customizableProducts = await executeQuery(`
        SELECT p.id, c.nombre as categoria_nombre 
        FROM productos p 
        JOIN categorias c ON p.categoria_id = c.id 
        WHERE p.personalizable = true
      `);
      
      // Obtener todas las opciones de personalización
      const customizationOptions = await executeQuery('SELECT * FROM opciones_personalizacion');
      
      for (const product of customizableProducts) {
        // Determinar qué opciones aplican según la categoría
        let applicableOptions = customizationOptions;
        
        // Para hamburguesas, todas las opciones aplican
        if (product.categoria_nombre.includes('Hamburguesas')) {
          applicableOptions = customizationOptions;
        }
        // Para perros calientes, opciones limitadas
        else if (product.categoria_nombre.includes('Perros')) {
          applicableOptions = customizationOptions.filter((opt: any) => 
            opt.nombre.includes('CHORIZO') || 
            opt.nombre.includes('TOCINETA') || 
            opt.nombre.includes('QUESO') ||
            opt.nombre.includes('CEBOLLA') ||
            opt.nombre.includes('JALAPEÑOS')
          );
        }
        
        // Insertar relaciones
        for (const option of applicableOptions) {
          const relationQuery = `
            INSERT IGNORE INTO producto_personalizaciones (producto_id, opcion_id)
            VALUES (?, ?)
          `;
          
          await executeQuery(relationQuery, [product.id, option.id]);
        }
      }
      
      console.log('✅ Relaciones producto-personalización creadas');
      
    } catch (error) {
      console.error('❌ Error creando relaciones de personalización:', error);
      throw error;
    }
  }
  
  // Verificar si la base de datos necesita inicialización
  static async needsInitialization(): Promise<boolean> {
    try {
      const productCount = await executeQuery('SELECT COUNT(*) as count FROM productos');
      return productCount[0].count === 0;
    } catch (error) {
      console.error('Error verificando inicialización:', error);
      return true;
    }
  }
  
  // Inicializar base de datos completa
  static async initializeDatabase(): Promise<void> {
    try {
      console.log('🚀 Iniciando inicialización de base de datos...');
      
      const needsInit = await this.needsInitialization();
      
      if (needsInit) {
        await this.populateProductsFromMenu();
        console.log('✅ Base de datos inicializada completamente');
      } else {
        console.log('ℹ️ Base de datos ya está inicializada');
      }
      
    } catch (error) {
      console.error('❌ Error en inicialización de base de datos:', error);
      throw error;
    }
  }
  
  // Limpiar y reinicializar base de datos (solo para desarrollo)
  static async resetDatabase(): Promise<void> {
    try {
      console.log('⚠️ REINICIANDO BASE DE DATOS...');
      
      // Limpiar tablas en orden correcto (respetando claves foráneas)
      const cleanupQueries = [
        'DELETE FROM pedido_item_personalizaciones',
        'DELETE FROM pedido_items',
        'DELETE FROM facturas',
        'DELETE FROM pedidos',
        'DELETE FROM clientes',
        'DELETE FROM producto_personalizaciones',
        'DELETE FROM productos',
        'DELETE FROM categorias',
        'DELETE FROM ventas_diarias',
        'DELETE FROM productos_mas_vendidos',
        'DELETE FROM logs_sistema'
      ];
      
      for (const query of cleanupQueries) {
        await executeQuery(query);
      }
      
      // Reiniciar contadores
      await executeQuery(`
        UPDATE configuracion_sistema 
        SET valor = '0' 
        WHERE clave IN ('ultimo_numero_pedido', 'ultimo_numero_factura')
      `);
      
      console.log('🗑️ Base de datos limpiada');
      
      // Repoblar
      await this.populateProductsFromMenu();
      
      await LogService.log('warning', 'Base de datos reiniciada completamente');
      
      console.log('✅ Base de datos reiniciada exitosamente');
      
    } catch (error) {
      console.error('❌ Error reiniciando base de datos:', error);
      throw error;
    }
  }
  
  // Verificar integridad de la base de datos
  static async verifyDatabaseIntegrity(): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    try {
      // Verificar que existan categorías
      const categoryCount = await executeQuery('SELECT COUNT(*) as count FROM categorias');
      if (categoryCount[0].count === 0) {
        issues.push('No hay categorías en la base de datos');
      }
      
      // Verificar que existan productos
      const productCount = await executeQuery('SELECT COUNT(*) as count FROM productos');
      if (productCount[0].count === 0) {
        issues.push('No hay productos en la base de datos');
      }
      
      // Verificar que existan sedes
      const locationCount = await executeQuery('SELECT COUNT(*) as count FROM sedes');
      if (locationCount[0].count === 0) {
        issues.push('No hay sedes configuradas');
      }
      
      // Verificar que existan opciones de personalización
      const customizationCount = await executeQuery('SELECT COUNT(*) as count FROM opciones_personalizacion');
      if (customizationCount[0].count === 0) {
        issues.push('No hay opciones de personalización');
      }
      
      // Verificar configuraciones esenciales
      const essentialConfigs = [
        'ultimo_numero_pedido',
        'ultimo_numero_factura',
        'iva_porcentaje',
        'empresa_nombre'
      ];
      
      for (const config of essentialConfigs) {
        const configExists = await executeQuery(
          'SELECT COUNT(*) as count FROM configuracion_sistema WHERE clave = ?',
          [config]
        );
        
        if (configExists[0].count === 0) {
          issues.push(`Configuración faltante: ${config}`);
        }
      }
      
      const isValid = issues.length === 0;
      
      if (isValid) {
        console.log('✅ Integridad de base de datos verificada');
      } else {
        console.warn('⚠️ Problemas de integridad encontrados:', issues);
      }
      
      return { isValid, issues };
      
    } catch (error) {
      console.error('❌ Error verificando integridad:', error);
      issues.push(`Error de verificación: ${error}`);
      return { isValid: false, issues };
    }
  }
}

// =====================================================
// FUNCIÓN DE INICIALIZACIÓN AUTOMÁTICA
// =====================================================

export const initializeDatabaseOnStartup = async (): Promise<void> => {
  try {
    console.log('🔍 Verificando estado de la base de datos...');
    
    // Verificar integridad
    const { isValid, issues } = await DatabaseInitializer.verifyDatabaseIntegrity();
    
    if (!isValid) {
      console.log('🔧 Inicializando base de datos...');
      await DatabaseInitializer.initializeDatabase();
      
      // Verificar nuevamente
      const { isValid: isValidAfterInit } = await DatabaseInitializer.verifyDatabaseIntegrity();
      
      if (isValidAfterInit) {
        console.log('✅ Base de datos inicializada y verificada');
      } else {
        console.error('❌ La base de datos sigue teniendo problemas después de la inicialización');
      }
    } else {
      console.log('✅ Base de datos en buen estado');
    }
    
  } catch (error) {
    console.error('❌ Error en inicialización automática:', error);
  }
};