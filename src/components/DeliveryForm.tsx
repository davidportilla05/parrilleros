import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeliveryForm from './DeliveryForm';
import { OrderContext } from '../context/OrderContext';

test('submits form when all fields are filled', async () => {
  const mockOnBack = jest.fn();
  const mockClearCart = jest.fn();
  const mockOrderContext = {
    cart: [{ id: 1, name: 'Product', price: 10000, quantity: 1 }],
    total: 10000,
    clearCart: mockClearCart,
    orderNumber: 123,
  };

  render(
    <OrderContext.Provider value={mockOrderContext}>
      <DeliveryForm onBack={mockOnBack} />
    </OrderContext.Provider>
  );

  fireEvent.change(screen.getByLabelText(/Nombre completo/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText(/Dirección/i), { target: { value: '123 Main St' } });
  fireEvent.change(screen.getByLabelText(/Barrio/i), { target: { value: 'Downtown' } });
  fireEvent.change(screen.getByLabelText(/Número de celular/i), { target: { value: '3001234567' } });
  fireEvent.change(screen.getByLabelText(/Número de cédula/i), { target: { value: '12345678' } });
  fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'john@example.com' } });
  fireEvent.change(screen.getByLabelText(/Forma de pago/i), { target: { value: 'Efectivo' } });

  fireEvent.click(screen.getByText(/Enviar Pedido a Domicilio/i));

  await waitFor(() => {
    expect(screen.getByText(/¡Pedido Enviado Exitosamente!/i)).toBeInTheDocument();
  });
});