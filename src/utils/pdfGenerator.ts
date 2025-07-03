import jsPDF from 'jspdf';
import { CartItem } from '../types';

interface InvoiceData {
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCedula?: string;
  address: string;
  neighborhood: string;
  locationName: string;
  locationAddress: string;
  locationPhone: string;
  items: CartItem[];
  subtotal: number;
  iva: number;
  total: number;
  paymentMethod: string;
  requiresInvoice: boolean;
  date: Date;
}

export const generateInvoicePDF = (data: InvoiceData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Colors
  const primaryColor = [255, 140, 0]; // #FF8C00
  const darkColor = [26, 26, 26]; // #1A1A1A
  const grayColor = [107, 114, 128]; // #6B7280
  const lightGrayColor = [243, 244, 246]; // #F3F4F6
  
  let yPosition = 20;
  
  // Header with company branding
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Company logo area (simulated with text)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');

  
  // Company name
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PARRILLEROS', 25, 20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('FAST FOOD', 25, 28);
  
  // Invoice title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA DE VENTA', pageWidth - 15, 20, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Pedido #${data.orderNumber.toString().padStart(3, '0')}`, pageWidth - 15, 28, { align: 'right' });
  
  yPosition = 50;
  
  // Date and location info
  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${data.date.toLocaleDateString('es-CO')}`, 15, yPosition);
  doc.text(`Hora: ${data.date.toLocaleTimeString('es-CO')}`, 15, yPosition + 5);
  doc.text(`Sede: ${data.locationName}`, 15, yPosition + 10);
  doc.text(`${data.locationAddress}`, 15, yPosition + 15);
  doc.text(`Tel: ${data.locationPhone}`, 15, yPosition + 20);
  
  yPosition += 35;
  
  // Customer information section
  doc.setFillColor(...lightGrayColor);
  doc.rect(15, yPosition, pageWidth - 30, 25, 'F');
  
  doc.setTextColor(...darkColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN DEL CLIENTE', 20, yPosition + 8);
  
  yPosition += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Cliente: ${data.customerName}`, 20, yPosition + 5);
  doc.text(`Teléfono: ${data.customerPhone}`, 20, yPosition + 10);
  doc.text(`Dirección: ${data.address}, ${data.neighborhood}`, 20, yPosition + 15);
  
  if (data.requiresInvoice && data.customerCedula && data.customerEmail) {
    doc.text(`CC: ${data.customerCedula}`, 20, yPosition + 20);
    doc.text(`Email: ${data.customerEmail}`, 20, yPosition + 25);
    yPosition += 10;
  }
  
  yPosition += 35;
  
  // Items table header
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPosition, pageWidth - 30, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('CANT', 20, yPosition + 8);
  doc.text('DESCRIPCIÓN', 40, yPosition + 8);
  doc.text('PRECIO UNIT', pageWidth - 80, yPosition + 8);
  doc.text('TOTAL', pageWidth - 30, yPosition + 8);
  
  yPosition += 15;
  
  // Items
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'normal');
  
  data.items.forEach((item, index) => {
    const basePrice = item.withFries ? (item.menuItem.priceWithFries || item.menuItem.price) : item.menuItem.price;
    const customizationsTotal = item.customizations.reduce((sum, option) => sum + option.price, 0);
    const unitPrice = basePrice + customizationsTotal;
    const itemTotal = unitPrice * item.quantity;
    
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Item row background (alternating)
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, yPosition - 3, pageWidth - 30, 12, 'F');
    }
    
    // Item details
    doc.setFontSize(9);
    doc.text(item.quantity.toString(), 20, yPosition + 5);
    
    let itemName = item.menuItem.name;
    if (item.withFries) itemName += ' + Papas';
    doc.text(itemName, 40, yPosition + 5);
    
    doc.text(`$${unitPrice.toLocaleString()}`, pageWidth - 80, yPosition + 5);
    doc.text(`$${itemTotal.toLocaleString()}`, pageWidth - 30, yPosition + 5);
    
    yPosition += 8;
    
    // Customizations
    if (item.customizations.length > 0) {
      doc.setFontSize(8);
      doc.setTextColor(...grayColor);
      const customizationsText = `+ ${item.customizations.map(c => c.name.replace('AD ', '')).join(', ')}`;
      doc.text(customizationsText, 45, yPosition + 3);
      yPosition += 5;
    }
    
    // Special instructions
    if (item.specialInstructions) {
      doc.setFontSize(8);
      doc.setTextColor(...grayColor);
      doc.text(`* ${item.specialInstructions}`, 45, yPosition + 3);
      yPosition += 5;
    }
    
    doc.setTextColor(...darkColor);
    yPosition += 5;
  });
  
  yPosition += 10;
  
  // Totals section
  const totalsStartY = yPosition;
  doc.setDrawColor(...grayColor);
  doc.line(pageWidth - 100, totalsStartY, pageWidth - 15, totalsStartY);
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', pageWidth - 80, yPosition);
  doc.text(`$${data.subtotal.toLocaleString()}`, pageWidth - 30, yPosition, { align: 'right' });
  
  yPosition += 8;
  doc.text('IVA (8%):', pageWidth - 80, yPosition);
  doc.text(`$${data.iva.toLocaleString()}`, pageWidth - 30, yPosition, { align: 'right' });
  
  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', pageWidth - 80, yPosition);
  doc.setTextColor(...primaryColor);
  doc.text(`$${data.total.toLocaleString()}`, pageWidth - 30, yPosition, { align: 'right' });
  
  yPosition += 15;
  
  // Payment method
  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Forma de pago: ${data.paymentMethod}`, 15, yPosition);
  
  yPosition += 15;
  
  // Delivery info
  doc.setFillColor(254, 243, 199); // bg-amber-100
  doc.rect(15, yPosition, pageWidth - 30, 20, 'F');
  doc.setTextColor(146, 64, 14); // text-amber-800
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('🛵 INFORMACIÓN DE ENTREGA', 20, yPosition + 8);
  doc.setFont('helvetica', 'normal');
  doc.text('Tiempo estimado: 45-60 minutos', 20, yPosition + 15);
  
  yPosition += 30;
  
  // Footer
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('¡Gracias por su preferencia!', pageWidth / 2, yPosition, { align: 'center' });
  doc.text('PARRILLEROS FAST FOOD - Hamburguesas artesanales a la parrilla', pageWidth / 2, yPosition + 8, { align: 'center' });
  doc.text(`Factura generada el ${new Date().toLocaleString('es-CO')}`, pageWidth / 2, yPosition + 16, { align: 'center' });
  
  // QR Code placeholder (you could integrate a QR library here)
  doc.setDrawColor(...grayColor);
  doc.rect(pageWidth - 35, pageHeight - 35, 20, 20);
  doc.setFontSize(6);
  doc.text('QR', pageWidth - 25, pageHeight - 23, { align: 'center' });
  doc.text('Code', pageWidth - 25, pageHeight - 19, { align: 'center' });
  
  // Save the PDF
  const fileName = `Factura_Parrilleros_${data.orderNumber.toString().padStart(3, '0')}_${data.date.toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};