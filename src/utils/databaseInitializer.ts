import { dbOperations } from '../config/database';
import { LogService } from '../services/databaseService';

// =====================================================
// INICIALIZADOR DE BASE DE DATOS PARA WEBCONTAINER
// =====================================================

export class DatabaseInitializer {
  
  // Poblar productos desde el menú existente
  static async populateProductsFromMenu(): Promise<void> {
    try {
      console.log('🔄 Iniciando población de productos en IndexedDB...');
      
      // Importar datos del menú existente
      const { menuItems, categories, customizationOptions } = await import('../data/menu');
      const { locations } = await import('../data/locations');
      
      // Insertar categorías
      for (const category of categories) {
        const categoryData = {
          id: categories.indexOf(category) + 1,
          nombre: category.name,
          descripcion: `Categoría de ${category.name}`,
          icono: category.icon,
          orden_display: categories.indexOf(category) + 1,
          activo: true
        };
        
        try {
          await dbOperations.addCategory(categoryData);
        } catch (error) {
          // Ignorar errores de duplicados
          console.log(`Categoría ya existe: ${category.name}`);
        }
      }
      
      console.log('✅ Categorías insertadas');
      
      // Obtener categorías para mapeo
      const categoriesFromDB = await dbOperations.getAllCategories();
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
            categoryName = 'Hamburguesas';
        }
        
        const categoryId = categoryMap.get(categoryName) || 1;
        
        const productData = {
          id: item.id,
          nombre: item.name,
          descripcion: item.description,
          precio: item.price,
          precio_con_papas: item.priceWithFries,
          imagen_url: item.image,
          categoria_id: categoryId,
          personalizable: item.customizable || false,
          activo: true,
          orden_display: item.id
        };
        
        try {
          await dbOperations.addProduct(productData);
        } catch (error) {
          // Ignorar errores de duplicados
          console.log(`Producto ya existe: ${item.name}`);
        }
      }
      
      console.log('✅ Productos insertados');
      
      // Insertar opciones de personalización
      for (const option of customizationOptions) {
        const optionData = {
          id: option.id,
          nombre: option.name,
          precio_adicional: option.price,
          activo: true,
          categoria: 'general'
        };
        
        try {
          await dbOperations.addCustomizationOption(optionData);
        } catch (error) {
          console.log(`Opción ya existe: ${option.name}`);
        }
      }
      
      console.log('✅ Opciones de personalización insertadas');
      
      // Insertar sedes
      for (const location of locations) {
        const locationData = {
          id: parseInt(location.id.split('-')[1]) || locations.indexOf(location) + 1,
          nombre: location.name,
          direccion: location.address,
          telefono: location.phone,
          whatsapp: location.whatsapp,
          barrio: location.neighborhood,
          zonas_entrega: location.deliveryZones,
          activo: true
        };
        
        try {
          await dbOperations.addLocation(locationData);
        } catch (error) {
          console.log(`Sede ya existe: ${location.name}`);
        }
      }
      
      console.log('✅ Sedes insertadas');
      
      // Configurar valores iniciales
      await dbOperations.setConfig('ultimo_numero_pedido', '0', 'Último número de pedido generado');
      await dbOperations.setConfig('ultimo_numero_factura', '0', 'Último número de factura generado');
      await dbOperations.setConfig('iva_porcentaje', '8', 'Porcentaje de IVA aplicado');
      await dbOperations.setConfig('empresa_nombre', 'Parrilleros Fast Food', 'Nombre de la empresa');
      
      console.log('✅ Configuración inicial establecida');
      
      await LogService.log('info', 'Base de datos poblada con productos del menú', {
        categoriesCount: categories.length,
        productsCount: menuItems.length,
        locationsCount: locations.length
      });
      
      console.log('✅ Base de datos IndexedDB poblada exitosamente');
      
    } catch (error) {
      console.error('❌ Error poblando base de datos:', error);
      await LogService.log('error', 'Error poblando base de datos', { error });
      throw error;
    }
  }
  
  // Verificar si la base de datos necesita inicialización
  static async needsInitialization(): Promise<boolean> {
    try {
      const products = await dbOperations.getAllProducts();
      return products.length === 0;
    } catch (error) {
      console.error('Error verificando inicialización:', error);
      return true;
    }
  }
  
  // Inicializar base de datos completa
  static async initializeDatabase(): Promise<void> {
    try {
      console.log('🚀 Iniciando inicialización de base de datos IndexedDB...');
      
      const needsInit = await this.needsInitialization();
      
      if (needsInit) {
        await this.populateProductsFromMenu();
        console.log('✅ Base de datos IndexedDB inicializada completamente');
      } else {
        console.log('ℹ️ Base de datos IndexedDB ya está inicializada');
      }
      
    } catch (error) {
      console.error('❌ Error en inicialización de base de datos:', error);
      throw error;
    }
  }
  
  // Verificar integridad de la base de datos
  static async verifyDatabaseIntegrity(): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    try {
      // Verificar que existan categorías
      const categories = await dbOperations.getAllCategories();
      if (categories.length === 0) {
        issues.push('No hay categorías en la base de datos');
      }
      
      // Verificar que existan productos
      const products = await dbOperations.getAllProducts();
      if (products.length === 0) {
        issues.push('No hay productos en la base de datos');
      }
      
      // Verificar que existan sedes
      const locations = await dbOperations.getAllLocations();
      if (locations.length === 0) {
        issues.push('No hay sedes configuradas');
      }
      
      // Verificar que existan opciones de personalización
      const customizations = await dbOperations.getAllCustomizationOptions();
      if (customizations.length === 0) {
        issues.push('No hay opciones de personalización');
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
    console.log('🔍 Verificando estado de la base de datos IndexedDB...');
    
    // Verificar integridad
    const { isValid, issues } = await DatabaseInitializer.verifyDatabaseIntegrity();
    
    if (!isValid) {
      console.log('🔧 Inicializando base de datos IndexedDB...');
      await DatabaseInitializer.initializeDatabase();
      
      // Verificar nuevamente
      const { isValid: isValidAfterInit } = await DatabaseInitializer.verifyDatabaseIntegrity();
      
      if (isValidAfterInit) {
        console.log('✅ Base de datos IndexedDB inicializada y verificada');
      } else {
        console.error('❌ La base de datos sigue teniendo problemas después de la inicialización');
      }
    } else {
      console.log('✅ Base de datos IndexedDB en buen estado');
    }
    
  } catch (error) {
    console.error('❌ Error en inicialización automática:', error);
  }
};