import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { OngoingOrdersStatuses } from '..';
import { ApiContext, AppDispatch } from '../../../../app/context';
import { ORDERS_UPDATED, ORDER_CHAT_UPDATED } from '../../../order/actions';
import { ObserveOrdersOptions } from '../types';

export default function (options: ObserveOrdersOptions) {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);

  // side effects
  // observe orders
  React.useEffect(() => {
    return api.order().observeOrders({ ...options, statuses: OngoingOrdersStatuses }, setOrders);
  }, []);
  // observe chat
  React.useEffect(() => {
    dispatch({ type: ORDERS_UPDATED, payload: orders });
    const unsubscribers = orders.map((order) =>
      api
        .order()
        .observeOrderChat(order.id, (messages) =>
          dispatch({ type: ORDER_CHAT_UPDATED, payload: { orderId: order.id, messages } })
        )
    );
    return () => unsubscribers.forEach((unsub) => unsub());
  }, [orders]);
}
