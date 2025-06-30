import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface TourStep {
  element: string;
  popover: {
    title: string;
    description: string;
    side?: 'left' | 'right' | 'top' | 'bottom';
    align?: 'start' | 'center' | 'end';
  };
}

interface UseTourOptions {
  steps: TourStep[];
  showProgress?: boolean;
  allowClose?: boolean;
  overlayClickNext?: boolean;
  smoothScroll?: boolean;
  onDestroyed?: () => void;
  onHighlighted?: (element: Element, step: number, options: any) => void;
}

export const useDriverTour = (options: UseTourOptions) => {
  const driverRef = useRef<any>(null);

  useEffect(() => {
    // Initialize driver with custom styling for kiosk
    driverRef.current = driver({
      showProgress: options.showProgress ?? true,
      allowClose: options.allowClose ?? true,
      overlayClickNext: options.overlayClickNext ?? false,
      smoothScroll: options.smoothScroll ?? true,
      steps: options.steps,
      onDestroyed: options.onDestroyed,
      onHighlighted: options.onHighlighted,
      popoverClass: 'kiosk-tour-popover',
      activeClass: 'kiosk-tour-active',
      overlayColor: 'rgba(0, 0, 0, 0.7)',
      stagePadding: 8,
      stageRadius: 12,
      popoverOffset: 10,
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: 'Siguiente →',
      prevBtnText: '← Anterior',
      doneBtnText: '¡Entendido! ✓',
      closeBtnText: '✕',
    });

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [options]);

  const startTour = () => {
    if (driverRef.current) {
      driverRef.current.drive();
    }
  };

  const stopTour = () => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }
  };

  const moveNext = () => {
    if (driverRef.current) {
      driverRef.current.moveNext();
    }
  };

  const movePrevious = () => {
    if (driverRef.current) {
      driverRef.current.movePrevious();
    }
  };

  const highlight = (element: string) => {
    if (driverRef.current) {
      driverRef.current.highlight({
        element,
        popover: {
          title: 'Elemento destacado',
          description: 'Este elemento está siendo resaltado'
        }
      });
    }
  };

  return {
    startTour,
    stopTour,
    moveNext,
    movePrevious,
    highlight,
    driver: driverRef.current
  };
};

// Predefined tour configurations for different pages
export const welcomeTourSteps: TourStep[] = [
  {
    element: 'body',
    popover: {
      title: '🍔 ¡Bienvenido a Parrilleros!',
      description: 'Te guiaremos paso a paso para hacer tu pedido de forma fácil y rápida. ¡Empecemos!',
      side: 'bottom'
    }
  }
];

export const menuTourSteps: TourStep[] = [
  {
    element: '[data-tour="back-button"]',
    popover: {
      title: '🔙 Botón de Regreso',
      description: 'Usa este botón para volver a la pantalla anterior en cualquier momento.',
      side: 'bottom'
    }
  },
  {
    element: '[data-tour="search-bar"]',
    popover: {
      title: '🔍 Barra de Búsqueda',
      description: 'Busca rápidamente hamburguesas, bebidas o acompañamientos escribiendo aquí.',
      side: 'bottom'
    }
  },
  {
    element: '[data-tour="category-selector"]',
    popover: {
      title: '📂 Selector de Categorías',
      description: 'Navega por diferentes categorías: hamburguesas clásicas, deluxe, bebidas y más.',
      side: 'bottom'
    }
  },
  {
    element: '[data-tour="menu-grid"]',
    popover: {
      title: '🍽️ Menú de Productos',
      description: 'Aquí verás todos los productos disponibles. Toca cualquier producto para personalizarlo.',
      side: 'top'
    }
  },
  {
    element: '[data-tour="cart-button"]',
    popover: {
      title: '🛒 Carrito de Compras',
      description: 'Tu carrito aparecerá aquí cuando agregues productos. Toca para ver tu pedido.',
      side: 'left'
    }
  }
];

export const cartTourSteps: TourStep[] = [
  {
    element: '[data-tour="order-summary"]',
    popover: {
      title: '📋 Resumen del Pedido',
      description: 'Aquí puedes revisar todos los productos que has agregado y el total a pagar.',
      side: 'right'
    }
  },
  {
    element: '[data-tour="delivery-button"]',
    popover: {
      title: '🛵 Pedido a Domicilio',
      description: 'Toca aquí para solicitar entrega a domicilio. Te pediremos tus datos y dirección.',
      side: 'top'
    }
  },
  {
    element: '[data-tour="add-more-button"]',
    popover: {
      title: '➕ Agregar Más Productos',
      description: 'Si quieres agregar más productos a tu pedido, usa este botón.',
      side: 'top'
    }
  }
];

export const locationSelectionTourSteps: TourStep[] = [
  {
    element: '[data-tour="location-grid"]',
    popover: {
      title: '📍 Selecciona tu Sede',
      description: 'Elige la sede más cercana a tu ubicación para un mejor servicio de domicilio.',
      side: 'bottom'
    }
  },
  {
    element: '[data-tour="continue-button"]',
    popover: {
      title: '✅ Continuar',
      description: 'Una vez seleccionada tu sede, usa este botón para continuar con el formulario.',
      side: 'top'
    }
  }
];

export const deliveryFormTourSteps: TourStep[] = [
  {
    element: '[data-tour="delivery-form"]',
    popover: {
      title: '📝 Datos de Entrega',
      description: 'Completa todos tus datos personales y dirección de entrega. Todos los campos son obligatorios.',
      side: 'left'
    }
  },
  {
    element: '[data-tour="order-summary-delivery"]',
    popover: {
      title: '💰 Resumen Final',
      description: 'Revisa una vez más tu pedido y el total antes de enviarlo.',
      side: 'left'
    }
  },
  {
    element: '[data-tour="submit-button"]',
    popover: {
      title: '🚀 Enviar Pedido',
      description: 'Una vez completados todos los datos, envía tu pedido y te contactaremos pronto.',
      side: 'top'
    }
  }
];