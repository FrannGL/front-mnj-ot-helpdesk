import OrdersView from 'src/modules/orders/components/OrdersView';
import { fetchOrdersServer } from 'src/modules/orders/actions/fetchOrders';

export default async function Page() {
  const initialData = await fetchOrdersServer({ page: 1 });

  return <OrdersView initialData={initialData} />;
}
