import { Location } from '../types';

export const locations: Location[] = [
  {
    id: 'sede-tamasagra',
    name: 'Parrilleros Tamasagra',
    address: 'Manzana 9A casa 1 - Tamasagra',
    phone: '3012222098',
    whatsapp: '+573186025827',
    neighborhood: 'Centro'
  },
  {
    id: 'sede-san ignacio',
    name: 'Parrilleros San Ignacio',
    address: 'Carrera 15 #45-20, Versalles',
    phone: '(602) 555-0102',
    whatsapp: '+573148300987',
    neighborhood: 'Versalles',
    deliveryZones: [
      'Versalles',
      'Flora Industrial',
      'San Fernando',
      'Champagnat',
      'Los Álamos'
    ]
  },
  {
    id: 'sede-las cuadras',
    name: 'Parrilleros Cuadras',
    address: 'Calle 5 #30-15, Fatima',
    phone: '(602) 555-0103',
    whatsapp: '+573186025829',
    neighborhood: 'Fatima',
    deliveryZones: [
      'Fatima',
      'Corazón de Jesús',
      'Bolivariano',
      'San Vicente',
      'Pandiaco'
    ]
  }
];