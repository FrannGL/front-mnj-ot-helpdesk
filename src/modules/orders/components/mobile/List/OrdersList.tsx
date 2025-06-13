import type { Order } from 'src/modules/orders/interfaces';

import OrderRow from './OrderRow';



interface OrdersListProps {
  orders: Order[];
  onOrderClick?: (id: number) => void;
}

const OrdersList = ({ orders, onOrderClick }: OrdersListProps) => (
  <>
    {orders.map((order, index) => (
      <OrderRow key={order.id} order={order} onOrderClick={onOrderClick} index={index} />
    ))}
  </>
);

export default OrdersList;
