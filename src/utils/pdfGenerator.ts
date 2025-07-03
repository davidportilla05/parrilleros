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
  // Create a receipt-style PDF (narrow width like a thermal printer receipt)
  const receiptWidth = 80; // 80mm width (typical thermal receipt width)
  const doc = new jsPDF({
    unit: 'mm',
    format: [receiptWidth, 200], // Start with 200mm height, will auto-extend
    orientation: 'portrait'
  });
  
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 5;
  const leftMargin = 2;
  const rightMargin = pageWidth - 2;
  const contentWidth = pageWidth - 4;
  
  // Helper function to add text with automatic line wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 8, style: string = 'normal'): number => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', style);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, index: number) => {
      doc.text(line, x, y + (index * (fontSize * 0.4)));
    });
    return y + (lines.length * (fontSize * 0.4));
  };
  
  // Helper function to add centered text
  const addCenteredText = (text: string, y: number, fontSize: number = 8, style: string = 'normal'): number => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', style);
    doc.text(text, pageWidth / 2, y, { align: 'center' });
    return y + (fontSize * 0.4);
  };
  
  // Helper function to add separator line
  const addSeparatorLine = (y: number): number => {
    doc.setDrawColor(0, 0, 0);
    doc.line(leftMargin, y, rightMargin, y);
    return y + 2;
  };
  
  // Header - Company Info
  yPosition = addCenteredText('PARRILLEROS', yPosition + 3, 12, 'bold');
  yPosition = addCenteredText('FAST FOOD', yPosition + 1, 10, 'bold');
  yPosition = addCenteredText('Hamburguesas Artesanales', yPosition + 1, 8, 'normal');
  yPosition = addSeparatorLine(yPosition + 2);
  
  // Order number and date - PROMINENT
  yPosition = addCenteredText(`PEDIDO #${data.orderNumber.toString().padStart(3, '0')}`, yPosition + 2, 14, 'bold');
  yPosition = addCenteredText(`${data.date.toLocaleDateString('es-CO')} ${data.date.toLocaleTimeString('es-CO')}`, yPosition + 1, 8, 'normal');
  yPosition = addSeparatorLine(yPosition + 2);
  
  // Location info
  yPosition = addCenteredText(data.locationName, yPosition + 2, 10, 'bold');
  yPosition = addWrappedText(data.locationAddress, leftMargin, yPosition + 1, contentWidth, 8, 'normal');
  yPosition = addCenteredText(`Tel: ${data.locationPhone}`, yPosition + 1, 8, 'normal');
  yPosition = addSeparatorLine(yPosition + 2);
  
  // Customer info
  yPosition = addCenteredText('DATOS DEL CLIENTE', yPosition + 2, 10, 'bold');
  yPosition = addWrappedText(`Cliente: ${data.customerName}`, leftMargin, yPosition + 1, contentWidth, 8, 'normal');
  yPosition = addWrappedText(`Telefono: ${data.customerPhone}`, leftMargin, yPosition + 1, contentWidth, 8, 'normal');
  yPosition = addWrappedText(`Direccion: ${data.address}`, leftMargin, yPosition + 1, contentWidth, 8, 'normal');
  yPosition = addWrappedText(`Barrio: ${data.neighborhood}`, leftMargin, yPosition + 1, contentWidth, 8, 'normal');
  
  if (data.requiresInvoice && data.customerCedula && data.customerEmail) {
    yPosition = addWrappedText(`CC: ${data.customerCedula}`, leftMargin, yPosition + 1, contentWidth, 8, 'normal');
    yPosition = addWrappedText(`Email: ${data.customerEmail}`, leftMargin, yPosition + 1, contentWidth, 8, 'normal');
  }
  
  yPosition = addSeparatorLine(yPosition + 2);
  
  // Items header
  yPosition = addCenteredText('PRODUCTOS PEDIDOS', yPosition + 2, 10, 'bold');
  yPosition = addSeparatorLine(yPosition + 1);
  
  // Items list
  data.items.forEach((item, index) => {
    const basePrice = item.withFries ? (item.menuItem.priceWithFries || item.menuItem.price) : item.menuItem.price;
    const customizationsTotal = item.customizations.reduce((sum, option) => sum + option.price, 0);
    const unitPrice = basePrice + customizationsTotal;
    const itemTotal = unitPrice * item.quantity;
    
    // Item name and quantity
    let itemName = `${index + 1}. ${item.menuItem.name}`;
    if (item.withFries) itemName += ' + Papas';
    yPosition = addWrappedText(itemName, leftMargin, yPosition + 2, contentWidth, 9, 'bold');
    
    // Quantity and price line
    const qtyPriceLine = `${item.quantity} x $${unitPrice.toLocaleString()} = $${itemTotal.toLocaleString()}`;
    yPosition = addWrappedText(qtyPriceLine, leftMargin + 2, yPosition + 1, contentWidth - 2, 8, 'normal');
    
    // Customizations
    if (item.customizations.length > 0) {
      const customizationsText = `+ ${item.customizations.map(c => c.name.replace('AD ', '')).join(', ')}`;
      yPosition = addWrappedText(customizationsText, leftMargin + 2, yPosition + 1, contentWidth - 2, 7, 'italic');
    }
    
    // Special instructions
    if (item.specialInstructions) {
      yPosition = addWrappedText(`* ${item.specialInstructions}`, leftMargin + 2, yPosition + 1, contentWidth - 2, 7, 'italic');
    }
    
    // Add some space between items
    yPosition += 1;
  });
  
  yPosition = addSeparatorLine(yPosition + 2);
  
  // Totals section
  yPosition = addCenteredText('RESUMEN DE COSTOS', yPosition + 2, 10, 'bold');
  
  // Subtotal
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', leftMargin, yPosition + 3);
  doc.text(`$${data.subtotal.toLocaleString()}`, rightMargin, yPosition + 3, { align: 'right' });
  
  // IVA
  doc.text('IVA (8%):', leftMargin, yPosition + 6);
  doc.text(`$${data.iva.toLocaleString()}`, rightMargin, yPosition + 6, { align: 'right' });
  
  yPosition = addSeparatorLine(yPosition + 8);
  
  // Total
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', leftMargin, yPosition + 3);
  doc.text(`$${data.total.toLocaleString()}`, rightMargin, yPosition + 3, { align: 'right' });
  
  yPosition = addSeparatorLine(yPosition + 5);
  
  // Payment method
  yPosition = addWrappedText(`Forma de pago: ${data.paymentMethod}`, leftMargin, yPosition + 2, contentWidth, 8, 'normal');
  yPosition = addSeparatorLine(yPosition + 2);
  
  // Delivery info
  yPosition = addCenteredText('INFORMACION DE ENTREGA', yPosition + 2, 9, 'bold');
  yPosition = addCenteredText('Tiempo estimado: 45-60 min', yPosition + 1, 8, 'normal');
  yPosition = addCenteredText('Te contactaremos pronto', yPosition + 1, 8, 'normal');
  yPosition = addSeparatorLine(yPosition + 2);
  
  // Footer
  yPosition = addCenteredText('¡Gracias por tu preferencia!', yPosition + 3, 9, 'bold');
  yPosition = addCenteredText('PARRILLEROS FAST FOOD', yPosition + 1, 8, 'normal');
  yPosition = addCenteredText('Hamburguesas artesanales', yPosition + 1, 7, 'normal');
  yPosition = addCenteredText('a la parrilla', yPosition + 1, 7, 'normal');
  
  yPosition += 3;
  yPosition = addCenteredText(`Factura generada: ${new Date().toLocaleString('es-CO')}`, yPosition, 6, 'normal');
  
  // QR Code placeholder
  yPosition += 5;
  const qrSize = 15;
  const qrX = (pageWidth - qrSize) / 2;
  doc.setDrawColor(0, 0, 0);
  doc.rect(qrX, yPosition, qrSize, qrSize);
  doc.setFontSize(6);
  doc.text('QR CODE', pageWidth / 2, yPosition + (qrSize / 2), { align: 'center' });
  
  // Final separator
  yPosition += qrSize + 2;
  yPosition = addSeparatorLine(yPosition);
  yPosition = addCenteredText('--- FIN DE FACTURA ---', yPosition + 2, 7, 'bold');
  
  // Save the PDF with order number
  const fileName = `Factura_Parrilleros_${data.orderNumber.toString().padStart(3, '0')}_${data.date.toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};