import React from 'react';
import { useNavigate } from 'react-router-dom';
import TicketView from '../components/TicketView';
import { useOrder } from '../context/OrderContext';

const TicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { clearCart } = useOrder();

  const handleDone = () => {
    clearCart();
    navigate('/');
  };

  return <TicketView onDone={handleDone} />;
};

export default TicketPage