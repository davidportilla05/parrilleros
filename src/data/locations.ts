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
    ]
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
    ]
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
    ]
  }
];