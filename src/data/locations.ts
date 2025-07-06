import { Location } from '../types';

export const locations: Location[] = [
  {
    id: 'sede-tamasagra',
    name: 'Parrilleros Tamasagra',
    address: 'Manzana 9A casa 1 - Tamasagra',
    phone: '301 222 2098',
    whatsapp: '+573186025827',
    neighborhood: 'Tamasagra',
    deliveryZones: [
      'Cualquier sitio de la ciudad'
    ],
    deliveryFees: {
      // Zonas cercanas - Tarifa básica
      'Tamasagra': 6000,
      'San Vicente': 6000,
      'Villa del Río': 6000,
      'Aranda': 6000,
      
      // Zonas intermedias
      'Centro': 8000,
      'San Ignacio': 8000,
      'Las Cuadras': 8000,
      'Bolivariano': 8000,
      'Pandiaco': 8000,
      'Mijitayo': 8000,
      'La Rosa': 8000,
      'Fátima': 8000,
      
      // Zonas lejanas
      'Torobajo': 10000,
      'San Fernando': 10000,
      'Mapachico': 10000,
      'Canchala': 10000,
      'Chapal': 10000,
      'Cabrera': 10000,
      'Jongovito': 10000,
      
      // Zonas muy lejanas
      'Catambuco': 12000,
      'Genoy': 12000,
      'La Laguna': 12000,
      'Obonuco': 12000,
      'Buesaquillo': 12000,
      'Mocondino': 12000,
      
      // Tarifa por defecto para barrios no listados
      'default': 8000
    }
  },
  {
    id: 'sede-san ignacio',
    name: 'Parrilleros San Ignacio',
    address: 'Cra 32 # 14 - 84 - San Ignacio',
    phone: '316 606 0005',
    whatsapp: '+573148300987',
    neighborhood: 'San Ignacio',
    deliveryZones: [
      'Cualquier sitio de la ciudad'
    ],
    deliveryFees: {
      // Zonas cercanas - Tarifa básica
      'San Ignacio': 6000,
      'Centro': 6000,
      'Bolivariano': 6000,
      'Pandiaco': 6000,
      'Mijitayo': 6000,
      
      // Zonas intermedias
      'Tamasagra': 8000,
      'San Vicente': 8000,
      'Villa del Río': 8000,
      'Aranda': 8000,
      'Las Cuadras': 8000,
      'La Rosa': 8000,
      'Fátima': 8000,
      'Torobajo': 8000,
      
      // Zonas lejanas
      'San Fernando': 10000,
      'Mapachico': 10000,
      'Canchala': 10000,
      'Chapal': 10000,
      'Cabrera': 10000,
      'Jongovito': 10000,
      
      // Zonas muy lejanas
      'Catambuco': 12000,
      'Genoy': 12000,
      'La Laguna': 12000,
      'Obonuco': 12000,
      'Buesaquillo': 12000,
      'Mocondino': 12000,
      
      // Tarifa por defecto para barrios no listados
      'default': 8000
    }
  },
  {
    id: 'sede-las cuadras',
    name: 'Parrilleros Cuadras',
    address: 'Calle 20 # 31C - 38 - Las Cuadras',
    phone: '313 341 9733',
    whatsapp: '+573186025829',
    neighborhood: 'Las Cuadras',
    deliveryZones: [
       'Cualquier sitio de la ciudad'
    ],
    deliveryFees: {
      // Zonas cercanas - Tarifa básica
      'Las Cuadras': 6000,
      'La Rosa': 6000,
      'Fátima': 6000,
      'Torobajo': 6000,
      'San Fernando': 6000,
      
      // Zonas intermedias
      'Centro': 8000,
      'San Ignacio': 8000,
      'Bolivariano': 8000,
      'Pandiaco': 8000,
      'Mijitayo': 8000,
      'Tamasagra': 8000,
      'San Vicente': 8000,
      'Villa del Río': 8000,
      'Aranda': 8000,
      
      // Zonas lejanas
      'Mapachico': 10000,
      'Canchala': 10000,
      'Chapal': 10000,
      'Cabrera': 10000,
      'Jongovito': 10000,
      
      // Zonas muy lejanas
      'Catambuco': 12000,
      'Genoy': 12000,
      'La Laguna': 12000,
      'Obonuco': 12000,
      'Buesaquillo': 12000,
      'Mocondino': 12000,
      
      // Tarifa por defecto para barrios no listados
      'default': 8000
    }
  }
];