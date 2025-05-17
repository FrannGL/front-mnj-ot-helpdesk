import { Box } from '@mui/material';

import { OrderRow } from './OrderRow';

import type { Order } from '../interfaces';

interface OrdersListProps {
  orders: Order[];
  onOrderClick?: (id: number) => void;
}

export function OrdersList({ orders, onOrderClick }: OrdersListProps) {
  return (
    <Box>
      {orders.map((order, index) => (
        <OrderRow key={order.id} order={order} onOrderClick={onOrderClick} index={index} />
      ))}
    </Box>
  );
}
